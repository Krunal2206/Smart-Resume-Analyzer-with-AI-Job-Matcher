"use client";

import { useState } from "react";
import { Trash2, RefreshCcw, Download, Loader2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

interface Resume {
  _id: string;
  name: string;
  email: string;
  skills?: string[];
  createdAt: Date;
}

interface ResumeCardProps {
  resume: Resume;
  onDelete: (id: string) => void;
  onReanalyze: (id: string) => void;
}

export default function ResumeCard({
  resume,
  onDelete,
  onReanalyze,
}: ResumeCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDelete = async () => {
    await onDelete(resume._id);
    setShowDeleteConfirm(false);
  };

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      await onReanalyze(resume._id);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/download?id=${resume._id}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.name}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-2 transition-all hover:border-gray-700">
        <h2
          className="text-xl font-semibold text-white line-clamp-1"
          title={resume.name}
        >
          {resume.name}
        </h2>
        <p className="text-sm text-gray-400 line-clamp-1" title={resume.email}>
          Email: {resume.email}
        </p>
        <p className="text-sm text-gray-400">
          Uploaded: {new Date(resume.createdAt).toLocaleString()}
        </p>
        <div className="text-sm text-gray-400">
          <span className="block float-left">Skills: </span>
          <div className="overflow-hidden">
            <p className="line-clamp-2" title={resume.skills?.join(", ")}>
              {resume.skills?.join(", ") || "—"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-4 text-sm border-t border-gray-800 pt-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            Download
          </button>

          <button
            onClick={handleReanalyze}
            disabled={isReanalyzing}
            className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isReanalyzing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCcw size={14} />
            )}
            Re-analyze
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors ml-auto cursor-pointer"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        type="danger"
      />
    </>
  );
}
