"use client";

import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import AnimatedSection from "./AnimatedSection";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);

interface AnalyticsData {
  providerCounts: Record<string, number>;
  uploadsByMonth: { month: string; value: number }[];
  topSkills: { name: string; value: number }[];
}

export default function AdminAnalytics({
  uploadsByMonth,
  topSkills,
  providerCounts,
}: AnalyticsData) {
  return (
    <div className="space-y-10">
      {/* Upload Trend */}
      <AnimatedSection>
        <ChartSection title="📈 Resumes Uploaded Over Time">
          <Line
            data={{
              labels: uploadsByMonth.map((d) => d.month),
              datasets: [
                {
                  label: "Uploads",
                  data: uploadsByMonth.map((d) => d.value),
                  borderColor: "#3B82F6",
                  backgroundColor: "#3B82F6",
                  fill: true,
                  tension: 1,
                },
              ],
            }}
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
          />
        </ChartSection>
      </AnimatedSection>

      {/* Top Skills */}
      <AnimatedSection>
        <ChartSection title="🧠 Top 5 Skills">
          <Bar
            data={{
              labels: topSkills.map((s) => s.name),
              datasets: [
                {
                  label: "Frequency",
                  data: topSkills.map((s) => s.value),
                  backgroundColor: "#10B981",
                  borderRadius: 4,
                  barThickness: 70,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  ticks: {
                    color: "#ccc",
                    font: {
                      size: 12,
                    },
                  },
                },
                x: {
                  ticks: {
                    color: "#ccc",
                  },
                },
              },
              plugins: {
                legend: { display: true, position: "bottom" },
                tooltip: { enabled: true },
              },
            }}
          />
        </ChartSection>
      </AnimatedSection>

      {/* Login Provider */}
      <AnimatedSection>
        <ChartSection title="🔐 Login Methods">
          <Pie
            data={{
              labels: Object.keys(providerCounts),
              datasets: [
                {
                  data: Object.values(providerCounts),
                  backgroundColor: ["#3B82F6", "#F59E0B"],
                },
              ],
            }}
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
          />
        </ChartSection>
      </AnimatedSection>
    </div>
  );
}

function ChartSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-blue-400">{title}</h3>
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        {children}
      </div>
    </div>
  );
}
