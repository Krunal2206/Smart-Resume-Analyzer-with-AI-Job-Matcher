import React from "react";

interface ReadinessTrack {
  role: string;
  percent: number;
}

interface SkillReadinessProps {
  readiness: ReadinessTrack[];
}

const SkillReadiness: React.FC<SkillReadinessProps> = ({ readiness }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">
        Skill Readiness
      </h2>
      <div className="space-y-4">
        {readiness.map((track: ReadinessTrack, idx: number) => (
          <div key={idx}>
            <p className="text-sm text-gray-300 mb-1">{track.role}</p>
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full ${
                  track.percent >= 75 ? "bg-green-500" : "bg-yellow-500"
                }`}
                style={{ width: `${track.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillReadiness;
