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

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }

  const userEmail = session.user?.email;
  const cacheKey = `dashboard:analytics:${userEmail}`;

  const cached = await redis.get(cacheKey);
  let resumes, skillsChart;

  if (cached) {
    const parsed = JSON.parse(cached);
    resumes = parsed.resumes;
    skillsChart = parsed.skillsChart;
  } else {
    await connectDB();
    resumes = await Resume.find({ userEmail }).sort({
      createdAt: -1,
    });

    const allSkills = resumes.flatMap((r: any) => r.skills || []);
    const frequency: Record<string, number> = {};

    allSkills.forEach((skill) => {
      frequency[skill] = (frequency[skill] || 0) + 1;
    });

    skillsChart = Object.entries(frequency).map(([skill, count]) => ({
      skill,
      count,
    }));

    await redis.set(
      cacheKey,
      JSON.stringify({ resumes, skillsChart }),
      "EX",
      60 * 60
    );
  } // Cache for 1 hour

  const allSkills = resumes.flatMap((r: any) => r.skills || []);

  let externalJobs: any[] = [];

  if (allSkills.length > 0) {
    try {
      externalJobs = await fetchJobsBySkills(allSkills);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  const skillGapData = resumes[0]?.skillGap || [];
  const readinessData = resumes[0]?.readiness || [];
  const educationData = resumes[0]?.education || [];

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

        {/* Skills Chart */}

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

        {/* ✅ Education Timeline */}
        {educationData.length > 0 && (
          <AnimatedSection>
            <EducationTimeline education={educationData} />
          </AnimatedSection>
        )}

        {/* ✅ Readiness Tracker */}
        {readinessData.length > 0 && (
          <AnimatedSection>
            <SkillReadiness readiness={readinessData} />
          </AnimatedSection>
        )}

        {/* Download Resume */}
        <ResumeDownload />

        {/* ✅ Dashboard Charts */}
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
}
