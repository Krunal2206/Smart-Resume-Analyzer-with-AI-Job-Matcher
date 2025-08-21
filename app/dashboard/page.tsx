import CareerTip from "@/components/CareerTip";
import EducationTimeline from "@/components/EducationTimeline";
import RecommendedJobs from "@/components/RecommendedJobs";
import ResumeDownload from "@/components/ResumeDownload";
import ResumeSummary from "@/components/ResumeSummary";
import SkillGapChart from "@/components/SkillGapChart";
import SkillReadiness from "@/components/SkillReadiness";
import SkillsList from "@/components/SkillsList";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { BarChart3 } from "lucide-react";
import { redirect } from "next/navigation";
import { fetchJobsBySkills } from "@/lib/fetchJobsBySkills";
import DashboardCharts from "@/components/DashboardCharts";
import redis from "@/lib/redis";
import AnimatedSection from "@/components/AnimatedSection";
import { Education, Job, ResumeData, SkillFrequency, SkillGap } from "@/types/resume";

// Helper function to safely parse and clean data
function safeParseData(data: unknown): ResumeData | null {
  try {
    return JSON.parse(JSON.stringify(data)) as ResumeData;
  } catch (error) {
    console.error("Error parsing data:", error);
    return null;
  }
}

// Helper function to process skills safely
function processSkills(resumes: ResumeData[]): string[] {
  const allSkills: string[] = [];

  for (const resume of resumes) {
    if (resume?.skills && Array.isArray(resume.skills)) {
      for (const skill of resume.skills) {
        if (typeof skill === "string" && skill.trim()) {
          allSkills.push(skill.trim());
        }
      }
    }
  }

  return allSkills;
}

// Helper function to create skill frequency chart
function createSkillChart(skills: string[]): SkillFrequency[] {
  const frequency: Record<string, number> = {};

  skills.forEach((skill) => {
    if (skill && typeof skill === "string") {
      frequency[skill] = (frequency[skill] || 0) + 1;
    }
  });

  return Object.entries(frequency)
    .map(([skill, count]) => ({ skill, count }))
    .filter((item) => item.skill && item.count > 0);
}

export default async function Dashboard() {
  try {
    const session = await auth();
    if (!session) {
      redirect("/auth/signin");
    }

    const userEmail = session.user?.email;
    if (!userEmail) {
      redirect("/auth/signin");
    }

    const cacheKey = `dashboard:analytics:${userEmail}`;
    let resumes: ResumeData[] = [];
    let skillsChart: SkillFrequency[] = [];

    try {
      const cached = await redis.get(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        resumes = Array.isArray(parsed.resumes) ? parsed.resumes : [];
        skillsChart = Array.isArray(parsed.skillsChart)
          ? parsed.skillsChart
          : [];
      } else {
        await connectDB();

        // Fetch resumes with lean option to avoid circular references
        const resumesRaw = await Resume.find({ userEmail })
          .sort({ createdAt: -1 })
          .lean()
          .exec();

        // Clean and parse resume data
        resumes = resumesRaw
          .map((resume: unknown) => safeParseData(resume))
          .filter((resume): resume is ResumeData => resume !== null);

        // Process skills safely
        const allSkills = processSkills(resumes);
        skillsChart = createSkillChart(allSkills);

        // Cache the cleaned data
        await redis.set(
          cacheKey,
          JSON.stringify({ resumes, skillsChart }),
          "EX",
          60 * 60
        );
      }
    } catch (cacheError) {
      console.error("Cache error:", cacheError);

      // Fallback: fetch directly from DB
      await connectDB();
      const resumesRaw = await Resume.find({ userEmail })
        .sort({ createdAt: -1 })
        .lean()
        .select("-__v")
        .exec();

      resumes = resumesRaw
        .map((resume: unknown) => safeParseData(resume))
        .filter((resume): resume is ResumeData => resume !== null);
      const allSkills = processSkills(resumes);
      skillsChart = createSkillChart(allSkills);
    }

    // Process all skills for job recommendations
    const allSkills = processSkills(resumes);
    let externalJobs: Job[] = [];

    if (allSkills.length > 0) {
      try {
        externalJobs = await fetchJobsBySkills(allSkills.slice(0, 10)); // Limit to prevent API overload
      } catch (error) {
        console.error("Error fetching jobs:", error);
        externalJobs = [];
      }
    }

    // Safely process skill gap data
    const skillGapDataRaw = resumes[0]?.skillGap || [];
    const skillGapData = skillGapDataRaw
      .map((item: SkillGap) => {
        if (!item || typeof item !== "object") return null;

        const missing =
          typeof item.missing === "string"
            ? Number(item.missing) || 0
            : Number(item.missing) || 0;

        return {
          skill: String(item.skill || ""),
          missing: isNaN(missing) ? 0 : missing,
        };
      })
      .filter(
        (item): item is { skill: string; missing: number } => item !== null
      );

    // Safely process readiness data
    const readinessData = Array.isArray(resumes[0]?.readiness)
      ? resumes[0].readiness
      : [];

    // Safely process education data
    const educationDataRaw = resumes[0]?.education || [];
    const educationData = educationDataRaw
      .map((item: Education) => {
        if (!item || typeof item !== "object") return null;

        return {
          year: String(item.year || ""),
          degree: String(item.degree || ""),
          university: String(item.university || ""),
        };
      })
      .filter(
        (item): item is { year: string; degree: string; university: string } =>
          item !== null
      );

    return (
      <section className="min-h-screen bg-gray-950 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Resume Summary */}
          {session.user && (
            <AnimatedSection>
              <ResumeSummary
                user={{
                  ...session.user,
                  name: session.user.name || "Guest",
                  email: session.user.email ?? undefined,
                }}
              />
            </AnimatedSection>
          )}

          {/* Skills */}
          <AnimatedSection>
            <SkillsList skills={allSkills} />
          </AnimatedSection>

          {/* Job Recommendations */}
          {externalJobs.length > 0 ? (
            <AnimatedSection>
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-blue-400 mb-4">
                  Recommended Jobs
                </h2>
                <RecommendedJobs jobs={externalJobs} />
              </div>
            </AnimatedSection>
          ) : (
            <p className="text-gray-400 text-sm italic mb-12">
              Upload a resume to get live job recommendations.
            </p>
          )}

          {/* Skill Gap */}
          {skillGapData.length > 0 && (
            <AnimatedSection>
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  <BarChart3 size={22} /> Skill Gap Analysis
                </h2>
                <SkillGapChart skillGap={skillGapData} />
              </div>
            </AnimatedSection>
          )}

          {/* Education Timeline */}
          {educationData.length > 0 && (
            <AnimatedSection>
              <EducationTimeline education={educationData} />
            </AnimatedSection>
          )}

          {/* Readiness Tracker */}
          {readinessData.length > 0 && (
            <AnimatedSection>
              <SkillReadiness readiness={readinessData} />
            </AnimatedSection>
          )}

          {/* Download Resume */}
          <AnimatedSection>
            <ResumeDownload />
          </AnimatedSection>

          {/* Dashboard Charts */}
          <AnimatedSection>
            <DashboardCharts resumes={resumes} allSkills={allSkills} />
          </AnimatedSection>

          {/* Career Tip Box */}
          <AnimatedSection>
            <CareerTip />
          </AnimatedSection>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Dashboard error:", error);

    // Return error boundary
    return (
      <section className="min-h-screen bg-gray-950 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-400">
              Please try refreshing the page or contact support if the issue
              persists.
            </p>
          </div>
        </div>
      </section>
    );
  }
}
