import UploadResumeForm from "../../components/UploadResumeForm";
import AnimatedSection from "@/components/AnimatedSection";

export default function UploadPage() {

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-950 text-white">
    <AnimatedSection>
      <UploadResumeForm />
    </AnimatedSection>
    </section>
  );
}
