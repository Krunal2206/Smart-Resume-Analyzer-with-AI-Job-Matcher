import OpenAI from "openai";
import redis from "@/lib/redis";

const token = process.env["OPENAI_API_KEY"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const client = new OpenAI({ baseURL: endpoint, apiKey: token });

export default async function analyzeResumeWithAI(resumeText: string) {

  const hashkey = `resume:cache:${Buffer.from(resumeText).toString("base64").slice(0, 32)}`;
  const cached = await redis.get(hashkey);

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      console.warn("Failed to parse cached response, calling AI again.");
    }
  }

  const gptResponse = await client.chat.completions.create({
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
  });

  const aiReply = gptResponse.choices[0]?.message?.content || "";

  try {
    const output = JSON.parse(aiReply);
    await redis.set(hashkey, JSON.stringify(output), "EX", 60 * 60 * 24); // Cache for 24 hours

    return output;
  } catch {
    throw new Error("Failed to parse GPT response");
  }
}
