import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    skills: [String],
    rawText: String,
    userEmail: { type: String, required: true },
    education: [
      {
        year: String,
        degree: String,
        university: String,
      },
    ],
    readiness: [
      {
        role: String,
        percent: Number,
      },
    ],
    skillGap: [
      {
        skill: String,
        missing: Number,
      },
    ],
    recommendedJobs: [
      {
        title: String,
        company: String,
        skillsMatch: Number,
      },
    ],
  },
  { timestamps: true }
);

export const Resume =
  mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
