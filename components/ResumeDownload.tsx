"use client";
import { Download } from "lucide-react";

export default function ResumeDownload() {
  const handleDownload = () => {
    window.open("/api/download", "_blank");
  };

  return (
    <div className="mb-12 text-center">
      <button
        onClick={handleDownload}
        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto cursor-pointer"
      >
        <Download size={18} /> Download Improved Resume (PDF)
      </button>
    </div>
  );
}
