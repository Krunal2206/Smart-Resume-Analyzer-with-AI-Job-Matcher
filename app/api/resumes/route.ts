import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getPaginatedResumes } from "@/lib/pagination";
import { CacheService } from "@/lib/cache";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Try to get from cache first
    const cacheKey = CacheService.generateKey([
      "resumes",
      userEmail,
      page.toString(),
      limit.toString(),
    ]);

    await connectDB();
    const result = await CacheService.getOrSet(
      cacheKey,
      () => getPaginatedResumes({ userEmail, page, limit }),
      { ttl: 60 * 5 } // Cache for 5 minutes
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Resume history error:", error);
    return NextResponse.json(
      { message: "Failed to fetch resume history" },
      { status: 500 }
    );
  }
}
