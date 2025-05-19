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
import {
  BarChart3,
} from "lucide-react";
import { redirect } from "next/navigation";
import { fetchJobsBySkills } from "@/lib/fetchJobsBySkills";
import DashboardCharts from "@/components/DashboardCharts";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }  
  
  await connectDB();
  const resumes = await Resume.find({ userEmail: session.user?.email }).sort({
    createdAt: -1,
  });
  
  const allSkills = resumes.flatMap((r) => r.skills || []);
  let externalJobs = [];

  if (allSkills.length > 0) {
    try {
      externalJobs = await fetchJobsBySkills(allSkills);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  const skillGapData = JSON.parse(JSON.stringify(resumes[0]?.skillGap || []));

  return (
    <section className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Resume Summary */}
        {session.user && (
          <ResumeSummary
            user={{
              ...session.user,
              name: session.user.name || "Guest",
              email: session.user.email ?? undefined,
            }}
          />
        )}

        {/* Skills */}
        <SkillsList skills={allSkills} />

        {/* Job Recommendations */}
        {externalJobs.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">
              Recommended Jobs
            </h2>

            <RecommendedJobs jobs={externalJobs} />
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">
            Upload a resume to get live job recommendations.
          </p>
        )}

        {/* Skill Gap */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <BarChart3 size={22} /> Skill Gap Analysis
          </h2>
          {skillGapData.length > 0 && <SkillGapChart skillGap={skillGapData} />}
        </div>

        {/* Career Timeline */}
        {resumes[0]?.education?.length > 0 && (
          <EducationTimeline education={resumes[0].education} />
        )}

        {/* Skill Readiness Tracker */}
        {resumes[0]?.readiness?.length > 0 && (
          <SkillReadiness readiness={resumes[0].readiness} />
        )}

        {/* Download Resume */}
        <ResumeDownload />

        {/* ✅ Dashboard Charts */}
        <DashboardCharts
          resumes={JSON.parse(JSON.stringify(resumes))}
          allSkills={allSkills}
        />

        {/* Career Tip Box */}
        <CareerTip />
      </div>
    </section>
  );
}
