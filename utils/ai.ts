import OpenAI from "openai";
import redis from "@/lib/redis";

const token = process.env["OPENAI_API_KEY"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const client = new OpenAI({ baseURL: endpoint, apiKey: token });

export default async function analyzeResumeWithAI(resumeText: string) {
  const hashkey = `resume:cache:${Buffer.from(resumeText)
    .toString("base64")
    .slice(0, 32)}`;

  try {
    const cached = await redis.get(hashkey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        console.warn("Failed to parse cached response, calling AI again.");
      }
    }
  } catch (error) {
    console.warn("Redis error, proceeding without cache:", error);
  }

  try {
    const gptResponse = await client.chat.completions.create(
      {
        model: model,
        messages: [
          {
            role: "system",
            content: `
            You are a smart resume parser. 
            Extract the following from the resume:
            - full name
            - email address
            - technical skills (as an array)
            - education history (as an array of objects with 'year', 'degree', 'university')
            - Skill readiness (array of { role, percent } where percent = readiness % for the role)
            - Skill gap (array of { skill, missing } — indicating how much a skill is lacking for job market relevance)
            - Recommended jobs (array of { title, company, skillsMatch })
            Return clean, valid JSON. Do NOT include extra commentary.
          `,
          },
          {
            role: "user",
            content: `Here is the resume:\n\n${resumeText}\n\nReturn JSON like:\n{
            "name": "John Doe",
            "email": "john@example.com",
            "skills": ["React", "Node.js"],
            "education": [
              {
                "year": "2021–2023",
                "degree": "M.Sc. Computer Science",
                "university": "ABC University"
              },
              {
                "year": "2017–2021",
                "degree": "B.E. Computer Engineering",
                "university": "XYZ Institute of Technology"
              }
            ],
            "readiness": [
              { "role": "Frontend Developer", "percent": 85 },
              { "role": "AI Engineer", "percent": 60 }
            ]
            "skillGap": [
              { "skill": "TypeScript", "missing": 2 },
              { "skill": "GraphQL", "missing": 1 },
              { "skill": "Docker", "missing": 3 }
            ]
            "recommendedJobs": [
              {
                "title": "Frontend Developer",
                "company": "TechNova Inc.",
                "skillsMatch": 87
              },
              {
                "title": "AI Engineer",
                "company": "SmartML Labs",
                "skillsMatch": 72
              }
            ]
        }`,
          },
        ],
        temperature: 0.3,
      },
      {
        timeout: 30000, // 30 second timeout
      }
    );

    const aiReply = gptResponse.choices[0]?.message?.content || "";

    if (!aiReply.trim()) {
      throw new Error("Empty response from AI service");
    }

    const output = JSON.parse(aiReply);

    // Cache the result if Redis is available
    try {
      await redis.set(hashkey, JSON.stringify(output), "EX", 60 * 60 * 24); // Cache for 24 hours
    } catch (cacheError) {
      console.warn("Failed to cache AI response:", cacheError);
    }

    return output;
  } catch (error) {
    console.error("AI analysis failed:", error);

    // Return a fallback response if AI fails
    return {
      name: "Unable to parse",
      email: "Unable to parse",
      skills: [],
      education: [],
      readiness: [],
      skillGap: [],
      recommendedJobs: [],
    };
  }
}
