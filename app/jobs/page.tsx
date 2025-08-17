"use client";

import RecommendedJobs from "@/components/RecommendedJobs";
import React, { useEffect, useState, useCallback } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Job } from "@/types/resume";

const JobSearchPage = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [results, setResults] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: query.trim(),
        page: page.toString(),
        ...(location && { location }),
        ...(remote && { remote: "true" }),
      });

      const res = await fetch(`/api/search-jobs?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      setResults(data.jobs || []);
    } catch (err) {
      console.error("Job search failed:", err);
    } finally {
      setLoading(false);
    }
  }, [query, location, remote, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = () => {
    setPage(1); // reset to first page
    fetchJobs();
  };

  return (
    <section className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-500 mb-6">Find Jobs</h1>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Skills or job title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
            <input
              type="text"
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remote}
                onChange={() => setRemote(!remote)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              Remote Only
            </label>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="cursor-pointer mb-10 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          {results.length > 0 && (
            <>
              <div className="text-gray-400 text-sm mb-4">
                Showing {results.length} results
              </div>

              <AnimatedSection>
                <RecommendedJobs jobs={results} />
              </AnimatedSection>

              <div className="flex gap-4 items-center justify-center mt-10">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="cursor-pointer px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-gray-400 text-sm">Page {page}</span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="cursor-pointer px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {!results.length && query && !loading && (
            <p className="text-gray-400 italic">
              No jobs found. Try a different search.
            </p>
          )}
        </div>
      </AnimatedSection>
    </section>
  );
};

export default JobSearchPage;
