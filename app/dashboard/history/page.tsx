import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { redirect } from "next/navigation";
import ResumeHistoryPageClient from "./ResumeHistoryPageClient";
import AnimatedSection from "@/components/AnimatedSection";

export default async function ResumeHistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  await connectDB();

  const limit = 10;
  const page = 1;

  // Get total count
  const total = await Resume.countDocuments({ userEmail: session.user.email });

  // Get paginated resumes
  const resumes = await Resume.find({ userEmail: session.user.email })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPages = Math.ceil(total / limit);

  const initialData = {
    data: JSON.parse(JSON.stringify(resumes)),
    pagination: {
      total,
      pages: totalPages,
      currentPage: page,
      limit,
      hasNext: page < totalPages,
      hasPrev: false,
    },
  };

  return (
    <AnimatedSection>
      <ResumeHistoryPageClient initialData={initialData} />
    </AnimatedSection>
  );
}
