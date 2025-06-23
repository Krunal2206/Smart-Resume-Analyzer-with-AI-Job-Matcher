import AnimatedSection from "@/components/AnimatedSection";

export default function TermsPage() {
  return (
    <AnimatedSection>
      <div className="max-w-4xl mx-auto py-16 px-4 text-white h-screen">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">
          Terms of Service
        </h1>
        <p className="mb-4">
          By accessing or using this platform, you agree to be bound by the
          terms below. If you disagree, please do not use the platform.
        </p>
        <p className="mb-4">
          By uploading a resume, you confirm that the document is your own and
          does not contain misleading or harmful content.
        </p>
        <p className="mb-4">
          You may not use this platform to upload malicious files, impersonate
          others, or misuse AI-generated content.
        </p>
        <p className="mb-4">
          You are responsible for the accuracy of the information you provide.
        </p>
        <p className="mb-4">
          We reserve the right to suspend or delete accounts that violate these
          terms without prior notice.
        </p>
        <p className="mb-4">
          This platform is provided as-is without guarantees of job placement or
          third-party availability. Use at your own discretion.
        </p>
        <p className="mb-4">
          These terms may be updated periodically. Continued use of the platform
          implies agreement to the updated terms.
        </p>
      </div>
    </AnimatedSection>
  );
}
