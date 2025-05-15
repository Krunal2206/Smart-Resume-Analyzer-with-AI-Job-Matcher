"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface SkillGapChartProps {
  skillGap: { skill: string; missing: number }[];
}

export default function SkillGapChart({ skillGap }: SkillGapChartProps) {
  if (!skillGap || skillGap.length === 0) {
    return <p className="text-gray-400">No skill gap data available.</p>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
      <p className="text-gray-400 mb-4">
        You're missing these skills based on job recommendations:
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={skillGap}
          layout="vertical"
          margin={{ left: 40 }}
          barSize={30}
        >
          <XAxis type="number" hide />
          <YAxis dataKey="skill" type="category" tick={{ fill: "#ccc" }} />
          <Tooltip />
          <Bar dataKey="missing" fill="#EF4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
