import { BrainCog, FileText, LineChart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Feature from "@/components/Feature";
import AnimatedSection from "@/components/AnimatedSection";

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-20">
      {/* Hero Section */}
      <AnimatedSection>
        <section className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight text-blue-500">
            Smart Resume Analyzer & AI Job Matcher
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Upload your resume and let AI unlock your job potential — skill
            analysis, job matching, and personalized career insights.
          </p>

          <Link
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl transition"
          >
            Get Started – Upload Resume
          </Link>

          {/* SVG Image */}
          <div className="w-full max-w-md">
            <Image
              src="/ai-resume.svg"
              alt="AI analyzing resume"
              width={500}
              height={500}
              className="mx-auto"
              priority
            />
          </div>
        </section>
      </AnimatedSection>

      {/* How it works */}
      <section className="mt-12 max-w-5xl mx-auto text-left">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          How It Works
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Feature
              icon={<FileText size={32} />}
              title="Upload Resume"
              desc="Upload your resume in PDF or DOCX format."
            />
            <Feature
              icon={<BrainCog size={32} />}
              title="AI-Based Parsing"
              desc="AI extracts your skills, education, and experience."
            />
            <Feature
              icon={<Sparkles size={32} />}
              title="Visual Dashboard"
              desc="Get insights on your strengths and gaps instantly."
            />
            <Feature
              icon={<LineChart size={32} />}
              title="Smart Job Matching"
              desc="See jobs aligned with your profile using AI."
            />
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
};

export default Home;
