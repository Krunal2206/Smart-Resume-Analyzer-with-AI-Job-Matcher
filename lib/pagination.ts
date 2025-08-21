import mongoose from "mongoose";
import { Resume } from "@/models/Resume";

export interface PaginationParams {
  page?: number;
  limit?: number;
  userEmail?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function getPaginatedResumes(
  params: PaginationParams
): Promise<PaginatedResult<any>> {
  const { page = 1, limit = 10, userEmail } = params;
  const skip = (page - 1) * limit;

  const query = userEmail ? { userEmail } : {};

  const [resumes, total] = await Promise.all([
    Resume.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-rawText") // Exclude large text field
      .lean(),
    Resume.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: resumes,
    pagination: {
      total,
      pages: totalPages,
      currentPage: page,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
