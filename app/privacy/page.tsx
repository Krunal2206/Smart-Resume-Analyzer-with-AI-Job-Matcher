import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

export default function PrivacyPage() {
  return (
    <AnimatedSection>
      <div className="max-w-4xl mx-auto py-16 px-4 text-white h-screen">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">
          Privacy Policy
        </h1>
        <p className="mb-4">
          We collect the following personal data when you use our platform: full
          name, email address, resume content, and skills extracted from your
          documents.
        </p>
        <p className="mb-4">
          This data is used strictly to provide services such as resume
          analysis, skill matching, and job recommendations. We do not sell or
          share your data with third parties.
        </p>
        <p className="mb-4">
          Only authorized users (e.g., you and platform administrators) have
          access to your data. You may delete your data anytime from your
          dashboard.
        </p>
        <p className="mb-4">
          We use standard encryption and data storage practices to protect your
          information.
        </p>
        <p className="mb-4">
          We do not use cookies or third-party analytics services that track
          your behavior across other websites.
        </p>
        <p className="mb-4">
          If you have any concerns about how your data is handled, contact us
          through the form on our{" "}
          <Link href="/contact" className="text-blue-500 underline">
            Contact page
          </Link>
          .
        </p>
      </div>
    </AnimatedSection>
  );
}
