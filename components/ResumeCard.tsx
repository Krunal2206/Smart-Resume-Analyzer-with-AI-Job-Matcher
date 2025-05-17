"use client";

import { useState } from "react";
import { Trash2, RefreshCcw, Download } from "lucide-react";

interface ResumeCardProps {
  resume: any;
  onDelete: (id: string) => void;
  onReanalyze: (id: string) => void;
}

export default function ResumeCard({
  resume,
  onDelete,
  onReanalyze,
}: ResumeCardProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-2">
      <h2 className="text-xl font-semibold text-white">{resume.name}</h2>
      <p className="text-sm text-gray-400">Email: {resume.email}</p>
      <p className="text-sm text-gray-400">
        Uploaded: {new Date(resume.createdAt).toLocaleString()}
      </p>
      <p className="text-sm text-gray-400">
        Skills: {resume.skills?.join(", ") || "—"}
      </p>

      <div className="flex gap-4 mt-3 text-sm">
        <a
          href={`/api/download?id=${resume._id}`}
          target="_blank"
          className="text-blue-400 hover:underline flex items-center gap-1"
        >
          <Download size={14} /> Download
        </a>

        <button
          onClick={() => {
            setLoading(true);
            onReanalyze(resume._id);
          }}
          className="text-yellow-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RefreshCcw size={14} /> Re-analyze
        </button>

        <button
          onClick={() => {
            setLoading(true);
            onDelete(resume._id);
          }}
          className="text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
