export interface SkillGap {
  skill: string;
  missing: string;
}

export interface Education {
  year: string | number;
  degree: string;
  university: string;
}

export type RecommendedJob = Job;

export interface Readiness {
  role: string;
  percent: number;
}

export interface ResumeData {
  _id: string;
  name: string;
  email: string;
  skills?: string[];
  education?: Education[];
  skillGap?: SkillGap[];
  readiness?: Readiness[];
  recommendedJobs?: RecommendedJob[];
  rawText?: string;
  userEmail: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_location: string;
  job_country: string;
  job_employment_type: string;
  job_apply_link: string;
  job_is_remote: boolean;
  job_posted_at: string;
  job_description?: string;
  job_url?: string;
  skillsMatch?: number;
  // Add any other properties that your Job type might have
  job_posted_date?: string;
  job_type?: string;
  salary?: string;
  job_salary?: string;
  job_benefits?: string[];
  job_requirements?: string[];
}

export type JobSearchResult = Job;