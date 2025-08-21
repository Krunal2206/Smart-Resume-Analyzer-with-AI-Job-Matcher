import { Resume } from "@/models/Resume";
import { ResumeData } from "@/types/resume";

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

// Helper function to safely convert MongoDB lean results to ResumeData
function convertToResumeData(mongoResult: unknown): ResumeData | null {
  try {
    const data = mongoResult as Record<string, unknown>;

    // Basic validation to ensure we have required fields
    if (!data || typeof data !== "object" || !data.userEmail) {
      return null;
    }

    return {
      _id: data._id as string,
      userEmail: data.userEmail as string,
      name: (data.name as string) || "",
      email: (data.email as string) || "",
      skills: Array.isArray(data.skills) ? (data.skills as string[]) : [],
      skillGap: Array.isArray(data.skillGap) ? data.skillGap : [],
      readiness: Array.isArray(data.readiness) ? data.readiness : [],
      education: Array.isArray(data.education) ? data.education : [],
      createdAt: data.createdAt as Date,
      updatedAt: data.updatedAt as Date,
      // Add other fields from your ResumeData interface as needed
    } as ResumeData;
  } catch (error) {
    console.error("Error converting resume data:", error);
    return null;
  }
}

export async function getPaginatedResumes(
  params: PaginationParams
): Promise<PaginatedResult<ResumeData>> {
  const { page = 1, limit = 10, userEmail } = params;
  const skip = (page - 1) * limit;

  const query = userEmail ? { userEmail } : {};

  const [resumesRaw, total] = await Promise.all([
    Resume.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-rawText") // Exclude large text field
      .lean()
      .exec(),
    Resume.countDocuments(query),
  ]);

  // Safely convert MongoDB results to ResumeData
  const resumes = resumesRaw
    .map(convertToResumeData)
    .filter((resume): resume is ResumeData => resume !== null);

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
