import { Briefcase } from "lucide-react";
import React from "react";

interface Job {
  job_id: string | number;
  job_title: string;
  employer_name: string;
  job_location: string;
  job_country: string;
  job_employment_type: string;
  job_apply_link: string;
  job_is_remote: boolean;
  job_posted_at: string;
}

interface RecommendedJobsProps {
  jobs: Job[];
}

const RecommendedJobs: React.FC<RecommendedJobsProps> = ({ jobs }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
      {jobs.slice(0, 10).map((job) => (
        <div
          key={job.job_id}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800"
        >
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2 flex-wrap">
            <Briefcase size={18} className="flex-none" /> {job.job_title}
          </h3>

          <p className="text-gray-400 mb-2">Company: {job.employer_name}</p>

          {job.job_location && job.job_country && (
            <p className="text-gray-500 text-sm italic mb-2">
              {job.job_location}, {job.job_country}
            </p>
          )}

          <p className="text-gray-500 text-sm italic mb-2">
            Employment Type: {job.job_employment_type}
          </p>

            <p className="text-gray-500 text-sm italic mb-2">
              Work Location: {job.job_is_remote == true ? "Remote" : "On-site"}
            </p>

            {job.job_posted_at && (
              <p className="text-gray-500 text-sm italic mb-2">
                Job Posted At: {job.job_posted_at}
              </p>
            )}

          <a
            href={job.job_apply_link}
            target="_blank"
            className="text-blue-400 hover:underline text-sm"
          >
            Apply Now →
          </a>
        </div>
      ))}
    </div>
  );
};

export default RecommendedJobs;
