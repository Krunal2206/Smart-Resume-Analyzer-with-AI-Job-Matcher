import { auth } from "@/lib/auth";

// Extend the User type to include the role property
declare module "next-auth" {
  interface User {
    role?: string;
  }
}
import { redirect } from "next/navigation";
import AdminTabs from "@/components/AdminTabs";
import { getAdminAnalytics } from "@/lib/getAdminAnalytics";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  const {
    users,
    resumes,
    totalUsers,
    totalResumes,
    latestUpload,
    topSkills,
    providerCounts,
    uploadsByMonth,
  } = await getAdminAnalytics();

  return (
    <AdminTabs
      users={JSON.parse(JSON.stringify(users))}
      resumes={JSON.parse(JSON.stringify(resumes))}
      analytics={{
        totalUsers,
        totalResumes,
        latestUpload,
        topSkills: topSkills.map((skill) => skill.name),
        providerCounts,
        uploadsByMonth: uploadsByMonth.map((upload) => ({
          month: upload.month,
          value: upload.value,
        })),
      }}
    />
  );
}
