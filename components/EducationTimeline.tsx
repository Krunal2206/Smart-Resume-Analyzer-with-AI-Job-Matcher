import { GraduationCap } from 'lucide-react';
import React from 'react'

interface Education {
  year: string;
  degree: string;
  university: string;
}

const EducationTimeline = ({ education }: { education: Education[] }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">
        Career Timeline
      </h2>
      <ul className="space-y-4 border-l border-blue-600 pl-6">
        {education.map(
          (
            edu: { year: string; degree: string; university: string },
            eduIdx: number
          ) => (
            <li key={eduIdx}>
              <div className="text-blue-300 font-bold">{edu.year}</div>
              <p className="text-white font-medium flex items-center gap-2">
                <GraduationCap size={16} className='flex-none' /> {edu.degree}
              </p>
              <p className="text-sm text-gray-400">{edu.university}</p>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default EducationTimeline
