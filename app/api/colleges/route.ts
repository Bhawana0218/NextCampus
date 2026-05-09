import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const type = searchParams.get("type") || "";
    const course = searchParams.get("course") || "";
    const minFees = searchParams.get("minFees");
    const maxFees = searchParams.get("maxFees");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(20, Math.max(1, parseInt(searchParams.get("pageSize") || "9")));

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.state = { contains: location, mode: "insensitive" };
    }

    if (type) {
      where.type = type;
    }

    if (course) {
      where.courses = { has: course };
    }

    if (minFees || maxFees) {
      where.fees = {};
      if (minFees) (where.fees as Record<string, number>).gte = parseInt(minFees);
      if (maxFees) (where.fees as Record<string, number>).lte = parseInt(maxFees);
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy: { rating: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.college.count({ where }),
    ]);

    return Response.json({
      colleges,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("GET /api/colleges error:", error);
    return Response.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}
