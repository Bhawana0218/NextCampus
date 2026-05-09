import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const college = await prisma.college.findUnique({
      where: { id },
    });

    if (!college) {
      return Response.json({ error: "College not found" }, { status: 404 });
    }

    return Response.json(college);
  } catch (error) {
    console.error("GET /api/colleges/[id] error:", error);
    return Response.json({ error: "Failed to fetch college" }, { status: 500 });
  }
}
