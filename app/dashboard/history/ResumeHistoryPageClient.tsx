"use client";

import ResumeCard from "@/components/ResumeCard";
import { useToastStore } from "@/lib/useToast";
import { useState } from "react";
import { ResumeData } from "@/types/resume";

export default function ResumeHistoryPageClient({
  initialData,
}: {
  initialData: {
    data: ResumeData[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      limit: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}) {
  const [resumes, setResumes] = useState<ResumeData[]>(initialData.data);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialData.pagination);
  const { trigger } = useToastStore();

  const fetchPage = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/resumes?page=${pageNum}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResumes(data.data);
      setPagination(data.pagination);
    } catch (error) {
      trigger("Failed to load resumes", "Error fetching resumes");
    } finally {
      setLoading(false);
    }
  };

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

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No matching resumes found.</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((resume) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onDelete={() => handleDelete(resume._id)}
                  onReanalyze={() => handleReanalyze(resume._id)}
                />
              ))}
            </div>

            {!query && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() =>
                    pagination.hasPrev && fetchPage(pagination.currentPage - 1)
                  }
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-50 hover:bg-gray-700 transition cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {pagination.currentPage} of {pagination.pages}
                </span>
                <button
                  onClick={() =>
                    pagination.hasNext && fetchPage(pagination.currentPage + 1)
                  }
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-50 hover:bg-gray-700 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
