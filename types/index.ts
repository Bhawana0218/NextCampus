export type CollegeType = "IIT" | "NIT" | "Private" | "Deemed" | "State";

export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  description: string;
  placements: string;
  image: string;
  courses: string[];
  facilities: string[];
  type: CollegeType;
  established: number;
  totalStudents: number;
  // Intelligence fields
  applyLink: string;
  avgPackage: number;       // in LPA
  topRecruiters: string[];
  aiSummary: string;
  trending: boolean;
  searchCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  rank?: number | null;
  budget?: number | null;
  interests: string[];
  createdAt: string;
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  createdAt: string;
  college: College;
}

export interface AuthPayload {
  id: string;
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface CollegesResponse {
  colleges: College[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CollegeFilters {
  search?: string;
  location?: string;
  type?: string;
  minFees?: number;
  maxFees?: number;
  course?: string;
  page?: number;
  pageSize?: number;
}

export interface RecommendInput {
  rank?: number;
  budget?: number;
  location?: string;
  branch?: string;
}

export interface CollegeWithScore extends College {
  fitScore: number;
  fitBreakdown: {
    fees: number;
    placement: number;
    rating: number;
    location: number;
  };
}
