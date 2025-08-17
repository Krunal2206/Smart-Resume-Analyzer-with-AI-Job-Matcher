export interface SkillGap {
  skill: string;
  missing: string;
}

export interface Education {
  year: string | number;
  degree: string;
  university: string;
}

export interface RecommendedJob {
  title: string;
  company: string;
  skillsMatch: number;
}

export interface Readiness {
  role: string;
  percent: number;
}

export interface ResumeData {
  name: string;
  email: string;
  skills?: string[];
  education?: Education[];
  recommendedJobs?: RecommendedJob[];
  readiness?: Readiness[];
  skillGap?: SkillGap[];
}