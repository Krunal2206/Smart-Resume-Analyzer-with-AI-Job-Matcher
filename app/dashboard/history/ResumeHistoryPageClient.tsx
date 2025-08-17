"use client";

import ResumeCard from "@/components/ResumeCard";
import { useToastStore } from "@/lib/useToast";
import { useState } from "react";
import { ResumeData } from "@/types/resume";

export default function ResumeHistoryPageClient({
  initialResumes,
}: {
  initialResumes: ResumeData[];
}) {
  const [resumes, setResumes] = useState<ResumeData[]>(initialResumes);
  const [query, setQuery] = useState("");
  const { trigger } = useToastStore();

  const handleDelete = async (id: string) => {
    await fetch(`/api/delete/${id}`, { method: "DELETE" });
    setResumes(resumes.filter((r) => r._id !== id));
  };

  const handleReanalyze = async (id: string) => {
    await fetch(`/api/reanalyze/${id}`, { method: "POST" });
    trigger("Re-analysis complete. Refresh in a moment.");
  };

  const filtered = resumes.filter((r) =>
    `${r.name} ${r.skills?.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-500 mb-6">
          Your Resume Archive
        </h1>

        <input
          type="text"
          placeholder="Search by name or skill..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
        />

        {filtered.length === 0 ? (
          <p className="text-gray-400">No matching resumes found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onDelete={handleDelete}
                onReanalyze={handleReanalyze}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
