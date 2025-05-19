"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ChartOptions,
  ChartData,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface SkillGapChartProps {
  skillGap: { skill: string; missing: number }[];
}

export default function SkillGapChart({ skillGap }: SkillGapChartProps) {
  if (!skillGap || skillGap.length === 0) {
    return <p className="text-gray-400">No skill gap data available.</p>;
  }

  const data: ChartData<"bar"> = {
    labels: skillGap.map((item) =>
      item.skill.length > 5
        ? item.skill.split(" ").reduce((acc: string[], word) => {
            // Group words into lines of max 20 characters
            const lastLine = acc[acc.length - 1];
            if (!lastLine || (lastLine + " " + word).length > 5) {
              acc.push(word);
            } else {
              acc[acc.length - 1] += " " + word;
            }
            return acc;
          }, [])
        : item.skill
    ),
    datasets: [
      {
        label: "Missing Skills",
        data: skillGap.map((item) => item.missing),
        backgroundColor: "#EF4444",
        borderRadius: 4,
        barThickness: 30,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
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
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
      <p className="text-gray-400 mb-4">
        You're missing these skills based on job recommendations:
      </p>
      <div className="h-96">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
