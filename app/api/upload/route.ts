import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { auth } from "@/lib/auth";
import { optimizePDF, extractPDFTextInChunks } from "@/utils/pdfOptimizer";
import analyzeResumeWithAI from "@/utils/ai";
import { isRateLimited } from "@/lib/rateLimiter";
import { CacheService } from "@/lib/cache";
import { AppError } from "@/lib/errorHandler";
import redis from "@/lib/redis";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    console.log("Upload API called"); // Debug log

    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      console.log("User not authenticated"); // Debug log
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    // Rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    console.log("Checking rate limits for:", userEmail); // Debug log

    const { limited, ttl, remaining, retryAfter } = await isRateLimited(
      userEmail,
      "upload",
      ip
    );

    if (limited) {
      console.log("Rate limit exceeded for:", userEmail); // Debug log
      return NextResponse.json(
        {
          message: `Rate limit exceeded. Try again in ${Math.ceil(
            retryAfter || ttl / 60
          )} minute(s).`,
          error: "RATE_LIMIT_EXCEEDED",
          limited: true,
          ttl,
          remaining: 0,
          retryAfter,
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      console.log("No file uploaded"); // Debug log
      return NextResponse.json(
        {
          message: "No file uploaded",
          error: "FILE_MISSING",
        },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      console.log("Invalid file type:", file.type); // Debug log
      return NextResponse.json(
        {
          message: "Only PDF files are allowed",
          error: "INVALID_FILE_TYPE",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      console.log("Empty file uploaded"); // Debug log
      return NextResponse.json(
        {
          message: "Cannot upload empty file",
          error: "EMPTY_FILE",
        },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log("File too large:", file.size); // Debug log
      return NextResponse.json(
        {
          message: "File size exceeds 5MB limit",
          error: "FILE_TOO_LARGE",
        },
        { status: 400 }
      );
    }

    console.log("File validation passed, processing..."); // Debug log

    // Convert to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Optimize PDF & extract text
    console.log("Optimizing PDF..."); // Debug log
    const optimizedBuffer = await optimizePDF(buffer);

    console.log("Extracting text..."); // Debug log
    const resumeText = await extractPDFTextInChunks(optimizedBuffer);

    if (!resumeText || resumeText.trim().length === 0) {
      console.log("No text extracted from PDF"); // Debug log
      return NextResponse.json(
        {
          message:
            "Could not extract text from PDF. Please ensure the PDF contains readable text.",
          error: "NO_TEXT_EXTRACTED",
        },
        { status: 400 }
      );
    }

    console.log("Text extracted, analyzing with AI..."); // Debug log

    // Cache + AI analysis
    const cacheKey = CacheService.generateKey([
      "resume",
      "analysis",
      resumeText.slice(0, 100),
    ]);
    const parsed = await CacheService.getOrSet(
      cacheKey,
      () => analyzeResumeWithAI(resumeText),
      { ttl: 60 * 60 * 24 * 7 }
    );

    console.log("AI analysis completed, saving to database..."); // Debug log

    // Save in MongoDB
    await connectDB();
    await Resume.create({
      ...parsed,
      rawText: resumeText,
      userEmail,
      createdAt: new Date(),
    });

    // Clear dashboard cache
    await redis.del(`dashboard:analytics:${userEmail}`);

    console.log("Upload process completed successfully"); // Debug log

    return NextResponse.json(
      {
        message: "Resume parsed and saved successfully",
        parsed,
        limited: false,
        ttl,
        remaining,
        success: true,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Upload error:", error);

    // Handle specific error types
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          message: error.message,
          error: error.code,
        },
        { status: error.statusCode }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        message: "An unexpected error occurred during upload",
        error: errorMessage,
        success: false,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
