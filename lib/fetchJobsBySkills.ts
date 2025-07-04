import redis from "./redis";

const JOB_CACHE_TTL = 60 * 10;

export async function fetchJobsBySkills(skills: string[]) {

  const query = skills.slice(0, 3).join(" ");
  const key = `jobs:cache:${Buffer.from(query).toString("base64").slice(0, 32)}`;
  const cached = await redis.get(key);

  if (cached) {
    try {
      console.log("Cache hit for jobs by skills");
      return JSON.parse(cached);
    } catch {
      console.warn("Failed to parse cached jobs response, fetching fresh data.");
    }
  }

    const url = `https://${
      process.env.RAPIDAPI_HOST
    }/search?query=${encodeURIComponent(query)}&num_pages=1&date_posted=all`;

    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST!,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch jobs");

    const data = await res.json();
    await redis.set(key, JSON.stringify(data.data), "EX", JOB_CACHE_TTL);

    return data.data;
}