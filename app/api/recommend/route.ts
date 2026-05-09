import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { rankColleges } from "@/lib/fitScore";
import type { College, RecommendInput } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const input: RecommendInput = {
      rank: searchParams.get("rank") ? parseInt(searchParams.get("rank")!) : undefined,
      budget: searchParams.get("budget") ? parseInt(searchParams.get("budget")!) : undefined,
      location: searchParams.get("location") || undefined,
      branch: searchParams.get("branch") || undefined,
    };

    // Fetch all colleges (or filter by branch if specified)
    const where: Record<string, unknown> = {};
    if (input.branch) {
      where.courses = { has: input.branch };
    }

    const colleges = await prisma.college.findMany({ where });

    // Rank by fit score
    const ranked = rankColleges(colleges as unknown as College[], input);

    // Return top 5 with scores
    const top5 = ranked.slice(0, 5);

    return Response.json({
      recommendations: top5,
      input,
      total: ranked.length,
    });
  } catch (error) {
    console.error("GET /api/recommend error:", error);
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
