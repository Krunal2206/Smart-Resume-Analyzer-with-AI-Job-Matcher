import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const JOB_CACHE_TTL = 60 * 10; // 10 minutes

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const location = searchParams.get("location") || "";
  const remote = searchParams.get("remote") === "true";
  const page = searchParams.get("page") || "1";

  const key = `jobsfinder:cache:${Buffer.from(`${query} ${location} ${remote} ${page}`).toString("base64").slice(0, 32)}`;
  const cached = await redis.get(key);

  if (cached) {
    try {
      console.log("Cache hit for job search");
      return NextResponse.json(JSON.parse(cached));
    } catch {
      console.warn("Failed to parse cached jobs response, fetching fresh data.");
    }
  }

  if (!query) {
    return NextResponse.json({ message: "Missing query" }, { status: 400 });
  }

  try {
    const keywords = `${query} ${remote ? "remote" : ""} ${location}`.trim();
    const url = `https://${
      process.env.RAPIDAPI_HOST
    }/search?query=${encodeURIComponent(keywords)}&page=${page}`;

    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST!,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch jobs");
    }
    await redis.set(
      key,
      JSON.stringify({ jobs: data.data }),
      "EX",
      JOB_CACHE_TTL
    );
    return NextResponse.json({ jobs: data.data || [] });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
