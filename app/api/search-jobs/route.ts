import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const JOB_CACHE_TTL = 60 * 10; // 10 minutes

interface JobSearchResponse {
  data?: unknown[];
  message?: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const location = searchParams.get("location") || "";
  const remote = searchParams.get("remote") === "true";
  const page = searchParams.get("page") || "1";

  const key = `jobsfinder:cache:${Buffer.from(
    `${query} ${location} ${remote} ${page}`
  )
    .toString("base64")
    .slice(0, 32)}`;

  // Try to get cached data
  try {
    const cached = await redis.get(key);
    if (cached) {
      try {
        console.log("Cache hit for job search");
        return NextResponse.json(JSON.parse(cached));
      } catch {
        console.warn(
          "Failed to parse cached jobs response, fetching fresh data."
        );
      }
    }
  } catch (error) {
    console.warn("Redis error, proceeding without cache:", error);
  }

  if (!query) {
    return NextResponse.json({ message: "Missing query" }, { status: 400 });
  }

  // Check if required environment variables are available
  if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST) {
    return NextResponse.json(
      { message: "Job search service temporarily unavailable" },
      { status: 503 }
    );
  }

  try {
    const keywords = `${query} ${remote ? "remote" : ""} ${location}`.trim();
    const url = `https://${
      process.env.RAPIDAPI_HOST
    }/search?query=${encodeURIComponent(keywords)}&page=${page}`;

    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }

    const data: JobSearchResponse = await res.json();

    if (!data.data) {
      throw new Error("Invalid response format from job API");
    }

    // Cache the successful response
    try {
      await redis.set(
        key,
        JSON.stringify({ jobs: data.data }),
        "EX",
        JOB_CACHE_TTL
      );
    } catch (cacheError) {
      console.warn("Failed to cache job search results:", cacheError);
    }

    return NextResponse.json({ jobs: data.data || [] });
  } catch (err: unknown) {
    console.error("Job search API error:", err);

    // Return cached data if available, even if expired
    try {
      const staleCache = await redis.get(key);
      if (staleCache) {
        console.log("Returning stale cache due to API failure");
        return NextResponse.json(JSON.parse(staleCache));
      }
    } catch (cacheError) {
      console.warn("Failed to retrieve stale cache:", cacheError);
    }

    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch jobs";
    return NextResponse.json(
      {
        message: "Job search temporarily unavailable. Please try again later.",
        error: errorMessage,
      },
      { status: 503 }
    );
  }
}
