import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { redirect } from "next/navigation";
import ResumeHistoryPageClient from "./ResumeHistoryPageClient";

export default async function ResumeHistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  await connectDB();
  const resumes = await Resume.find({ userEmail: session.user.email }).sort({
    createdAt: -1,
  });

  return (
    <ResumeHistoryPageClient
      initialResumes={JSON.parse(JSON.stringify(resumes))}
    />
  );
}
