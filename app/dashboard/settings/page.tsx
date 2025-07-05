import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/SettingsForm";
import AnimatedSection from "@/components/AnimatedSection";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  return (
    <section className="min-h-screen px-6 py-16 bg-gray-950 text-white">
      <AnimatedSection>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-400 mb-6">
            Profile Settings
          </h1>
          <SettingsForm
            user={{
              name: user.name || "",
              email: user.email,
              preferredRole: user.preferredRole || "",
              preferredLocation: user.preferredLocation || "",
            }}
          />
        </div>
      </AnimatedSection>
    </section>
  );
}
