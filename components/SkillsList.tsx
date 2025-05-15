import React from 'react'

interface SkillsListProps {
  skills: string[];
}

const SkillsList: React.FC<SkillsListProps> = ({ skills }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">Your Skills</h2>
      <div className="flex flex-wrap gap-3">
        {[...new Set(skills)].map((skill, idx) => (
          <span
            key={idx}
            className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsList
