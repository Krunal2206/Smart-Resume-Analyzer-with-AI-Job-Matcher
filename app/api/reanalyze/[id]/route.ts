import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { auth } from "@/lib/auth";
import analyzeResumeWithAI from "@/utils/ai";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    await connectDB();
    const resume = await Resume.findOne({
      _id: id,
      userEmail: session.user.email,
    });

    if (!resume) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    // Use the same AI resume parser logic
    const parsed = await analyzeResumeWithAI(resume.rawText);

    resume.name = parsed.name;
    resume.email = parsed.email;
    resume.skills = parsed.skills;
    resume.education = parsed.education;
    resume.skillGap = parsed.skillGap;
    resume.readiness = parsed.readiness;
    resume.recommendedJobs = parsed.recommendedJobs;

    await resume.save();

    return NextResponse.json({ message: "Resume re-analyzed and updated" });
  } catch (err: unknown) {
    console.error("Reanalyze error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
