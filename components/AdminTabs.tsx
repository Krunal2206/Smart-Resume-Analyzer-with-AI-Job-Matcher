"use client";

import { useState } from "react";
import AdminUsersTab from "./AdminUsersTab";
import AdminResumesTab from "./AdminResumesTab";
import { ChartNoAxesCombined, FileText, LogOut, Users} from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import AdminAnalytics from "./AdminAnalytics";

export default function AdminTabs({
  users,
  resumes,
  analytics,
}: {
  users: any[];
  resumes: any[];
  analytics: {
    totalUsers: number;
    totalResumes: number;
    latestUpload: string;
    topSkills: string[];
    providerCounts: Record<string, number>;
    uploadsByMonth: { month: string; value: number }[];
  };
}) {
  const [tab, setTab] = useState("users");

  return (
    <section className="min-h-screen bg-gray-950 text-white flex">
      <aside className="w-20 lg:w-20 bg-gray-900 text-gray-300 flex flex-col items-center shadow h-screen">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center w-full border-b border-gray-800">
          <span className="text-blue-400 font-bold text-xl">RA</span>
        </div>

        {/* Navigation */}
        <ul className="flex flex-col items-center w-full flex-1 space-y-2 mt-4">
          <li className="w-full flex justify-center">
            <button
              onClick={() => setTab("users")}
              className={`cursor-pointer h-16 w-full flex items-center justify-center hover:bg-gray-800 transition ${
                tab === "users" ? "text-blue-400 bg-gray-800" : ""
              }`}
            >
              <Users size={20} />
            </button>
          </li>

          <li className="w-full flex justify-center">
            <button
              onClick={() => setTab("resumes")}
              className={`cursor-pointer h-16 w-full flex items-center justify-center hover:bg-gray-800 transition ${
                tab === "resumes" ? "text-blue-400 bg-gray-800" : ""
              }`}
            >
              <FileText size={20} />
            </button>
          </li>

          <li className="w-full flex justify-center">
            <button
              onClick={() => setTab("analytics")}
              className={`cursor-pointer h-16 w-full flex items-center justify-center hover:bg-gray-800 transition ${
                tab === "analytics" ? "text-blue-400 bg-gray-800" : ""
              }`}
            >
              <ChartNoAxesCombined size={20} />
            </button>
          </li>
        </ul>

        {/* Bottom action button (Logout icon) */}
        <div className="h-16 w-full flex justify-center items-center border-t border-gray-800">
          <button className="cursor-pointer hover:bg-red-900 p-3 rounded-md">
            <LogOut size={20} className="text-red-400" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 overflow-y-auto">
        {/* Analytics Overview */}
        <AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-xl">
              <h4 className="text-sm text-gray-400">Total Users</h4>
              <p className="text-2xl font-bold text-white">
                {analytics.totalUsers}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <h4 className="text-sm text-gray-400">Total Resumes</h4>
              <p className="text-2xl font-bold text-white">
                {analytics.totalResumes}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <h4 className="text-sm text-gray-400">Latest Upload</h4>
              <p className="text-sm text-gray-300">
                {analytics.latestUpload
                  ? new Date(analytics.latestUpload).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <h4 className="text-sm text-gray-400">Top Skills</h4>
              <p className="text-sm text-gray-300">
                {analytics.topSkills.join(", ")}
              </p>
            </div>
          </div>
        </AnimatedSection>

        {tab === "users" && (
          <AnimatedSection>
            <AdminUsersTab users={users} />
          </AnimatedSection>
        )}
        {tab === "resumes" && (
          <AnimatedSection>
            <AdminResumesTab resumes={resumes} />
          </AnimatedSection>
        )}
        {tab === "analytics" && (
          <AnimatedSection>
            <AdminAnalytics
              {...analytics}
              topSkills={
                Array.isArray(analytics.topSkills)
                  ? analytics.topSkills.map((skill) =>
                      typeof skill === "string"
                        ? { name: skill, value: 1 }
                        : skill
                    )
                  : []
              }
            />
          </AnimatedSection>
        )}
      </main>
    </section>
  );
}
