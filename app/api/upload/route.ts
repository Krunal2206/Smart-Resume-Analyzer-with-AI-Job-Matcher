import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { auth } from "@/lib/auth";
import extractPDFText from "@/utils/pdf";
import analyzeResumeWithAI from "@/utils/ai";
import redis from "@/lib/redis";
import { isRateLimited } from "@/lib/rateLimiter";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const { limited, ttl, remaining } = await isRateLimited(userEmail);
    if (limited) {
      return NextResponse.json(
        {
          message: `Rate limit exceeded. Try again in ${Math.ceil(
            ttl / 60
          )} minute(s).`,
          limited: true,
          ttl,
          remaining,
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractPDFText(buffer);
    const parsed = await analyzeResumeWithAI(resumeText);

    await connectDB();
    await Resume.create({
      name: parsed.name,
      email: parsed.email,
      skills: parsed.skills,
      education: parsed.education,
      readiness: parsed.readiness,
      skillGap: parsed.skillGap,
      recommendedJobs: parsed.recommendedJobs,
      rawText: resumeText,
      userEmail,
    });

    await redis.del(`dashboard:analytics:${userEmail}`);

    return NextResponse.json({ message: "Resume parsed and saved", parsed, limited:false, ttl, remaining }, { status: 200 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Unexpected error occurred", error: error.message },
      { status: 500 }
    );
  }
}
