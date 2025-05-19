import { Lightbulb } from 'lucide-react';
import React from 'react'

const CareerTip = () => {
  return (
    <div className="mt-16 p-5 bg-gray-900 rounded-xl border border-gray-800 flex gap-4 items-start md:flex-row flex-col">
      <Lightbulb size={32} className="text-yellow-400 mt-1 flex-none" />
      <div>
        <p className="text-sm text-blue-300 font-semibold">Career Tip</p>
        <p className="text-gray-300 mt-1">
          Tailor your resume with keywords from the job description to improve
          match rates.
        </p>
      </div>
    </div>
  );
}

export default CareerTip
