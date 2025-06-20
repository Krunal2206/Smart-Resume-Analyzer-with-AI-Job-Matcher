import { User } from "@/models/User";
import { connectDB } from "./mongodb";
import { Resume } from "@/models/Resume";

export async function getAdminAnalytics() {
  await connectDB();

  const users = await User.find().lean();
  const resumes = await Resume.find().lean();

  const providerCounts: Record<string, number> = {};
  users.forEach((user) => {
    const provider = user.provider || "email"; // fallback
    providerCounts[provider] = (providerCounts[provider] || 0) + 1;
  });

  const monthlyUploads: Record<string, number> = {};
  resumes.forEach((r) => {
    const date = new Date(r.createdAt);
    const label = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    monthlyUploads[label] = (monthlyUploads[label] || 0) + 1;
  });

  const skillFrequency: Record<string, number> = {};
  resumes.forEach((r) => {
    (r.skills || []).forEach((skill: string) => {
      skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
    });
  });

  const topSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  return {
    users,
    resumes,
    totalUsers: users.length,
    totalResumes: resumes.length,
    latestUpload: resumes[0]?.createdAt,
    providerCounts,
    uploadsByMonth: Object.entries(monthlyUploads)
      .sort(([a], [b]) => a.localeCompare(b)) // sort by date string
      .map(([month, value]) => ({ month, value })),
    topSkills,
  };
}
