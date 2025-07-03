"use client";

import { useState } from "react";
import { useToastStore } from "@/lib/useToast";
import { FileText, UploadCloud } from "lucide-react";
import { redirect } from "next/navigation";

export default function UploadResumeForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState<{ name: string; email: string; skills?: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { trigger } = useToastStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setSelectedFile(selectedFile);
    } else {
      trigger("Invalid File ❌", "Only PDF files are allowed.");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      trigger("No file selected ❌", "Please upload a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    setIsLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();      

      if (!res.ok) {
        if (data.limited && data.ttl) {
          trigger(
            "Rate Limit Reached 🛑",
            `Try again in ${Math.ceil(data.ttl / 60)} minute(s).`
          );
        } else {
          trigger("Upload Failed ❌", data.message || "Unknown error");
        }
      } else {
        trigger("Resume Uploaded 🎯", "Resume parsed successfully!");

        if (
          typeof data.remaining !== "undefined" &&
          typeof data.ttl !== "undefined"
        ) {
          trigger(
            "Remaining Uploads ⏳",
            `You have ${data.remaining} upload(s) left in the next ${Math.ceil(
              data.ttl / 60
            )} minutes.`
          );
        }

        setParsedText(data.parsed);
        redirect("/dashboard");
      }
    } catch (error) {
      console.error("Upload error:", error);
      trigger("Something went wrong ❌", "Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-900 w-full max-w-2xl rounded-2xl shadow-xl p-8 border border-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
        Upload Your Resume
      </h1>

      {/* Drag and drop area */}
      <div className="border-2 border-dashed border-blue-500 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-800 transition">
        <label htmlFor="resume-upload" className="cursor-pointer block">
          <UploadCloud size={40} className="mx-auto text-blue-400 mb-4" />
          <p className="text-gray-300 mb-2">
            Drag & drop your resume here, or click to select a file
          </p>
          <p className="text-sm text-gray-500">Supported formats: PDF, DOCX</p>
        </label>
        <input
          type="file"
          id="resume-upload"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Selected file preview */}
      {selectedFile && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Selected file:{" "}
            <span className="font-medium text-white">{selectedFile.name}</span>
          </p>
        </div>
      )}

      {/* Sample resume link */}
      <p className="text-sm text-gray-400 mt-4 text-center">
        Don’t have a resume?
        <a
          href="/sample-resumes/sample.pdf"
          target="_blank"
          className="text-blue-500 underline ml-1"
        >
          Download a sample
        </a>
      </p>

      {/* Upload button */}
      <div className="mt-8 text-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 cursor-pointer"
          disabled={!selectedFile || isLoading}
          onClick={handleUpload}
        >
          {isLoading ? "Analyzing..." : "Analyze with AI"}
        </button>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="mt-4 flex justify-center">
          <span className="animate-pulse text-blue-400 font-medium">
            Analyzing resume...
          </span>
        </div>
      )}

      {/* AI Parsed Result (mocked) */}
      {parsedText && (
        <div className="mt-10 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <FileText size={20} />
            Resume Summary
          </h2>
          <ul className="text-gray-300 space-y-2">
            <li>
              <strong>Name:</strong> {parsedText?.name}
            </li>
            <li>
              <strong>Email:</strong> {parsedText?.email}
            </li>
            <li>
              <strong>Skills:</strong> {parsedText?.skills?.join(", ")}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
