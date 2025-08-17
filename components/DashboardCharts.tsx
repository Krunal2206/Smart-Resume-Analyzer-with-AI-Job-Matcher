"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

interface Resume {
  _id: string;
  createdAt: Date;
  skills?: string[];
}

type Skill = string | { name: string; level?: string };

export default function DashboardCharts({
  resumes,
  allSkills,
}: {
  resumes: Resume[];
  allSkills: Skill[];
}) {
  const { skillData, uploadData } = useMemo(() => {
    const skillCounts: Record<string, number> = {};
    allSkills.forEach((skill) => {
      const skillName = typeof skill === "string" ? skill : skill.name;
      skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
    });
    const skillData = Object.entries(skillCounts).map(([label, value]) => ({
      label,
      value,
    }));

    const uploadMap: Record<string, number> = {};
    resumes.forEach((r) => {
      const date = new Date(r.createdAt).toLocaleDateString();
      uploadMap[date] = (uploadMap[date] || 0) + 1;
    });
    const uploadData = Object.entries(uploadMap).map(([date, count]) => ({
      date,
      count,
    }));

    return { skillData, uploadData };
  }, [resumes, allSkills]);

  return (
    <div className="space-y-12">
      {/* Resume Upload Line Chart */}
      <div className="w-full">
        <h3 className="text-xl font-bold text-blue-400 mb-4">
          Resume Upload Trend
        </h3>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-96">
          <Line
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 1000,
                easing: "easeInOutQuart",
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (ctx) => `Uploads: ${ctx.parsed.y}`,
                  },
                },
                legend: { display: false },
              },
              scales: {
                x: { ticks: { color: "#ccc" } },
                y: { ticks: { color: "#ccc" } },
              },
            }}
            data={{
              labels: uploadData.map((d) => d.date),
              datasets: [
                {
                  label: "Uploads",
                  data: uploadData.map((d) => d.count),
                  borderColor: "#10B981",
                  backgroundColor: "rgba(16,185,129,0.2)",
                  fill: true,
                  tension: 1,
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Skill Distribution Pie Chart */}
      <div className="w-full">
        <h3 className="text-xl font-bold text-blue-400 mb-4">
          Skill Share (Top 5)
        </h3>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-96 flex justify-center">
          <Pie
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 1000,
                easing: "easeOutCubic",
              },
              plugins: {
                legend: {
                  labels: { color: "#ccc", padding: 20 },
                  position: "bottom",
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `${ctx.label}: ${ctx.parsed}`,
                  },
                },
              },
            }}
            data={{
              labels: skillData.slice(0, 5).map((d) => d.label),
              datasets: [
                {
                  data: skillData.slice(0, 5).map((d) => d.value),
                  backgroundColor: [
                    "#6366F1",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#3B82F6",
                  ],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
