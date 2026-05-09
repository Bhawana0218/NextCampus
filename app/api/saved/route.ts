import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: authUser.id },
      include: { college: true },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ saved });
  } catch (error) {
    console.error("GET /api/saved error:", error);
    return Response.json({ error: "Failed to fetch saved colleges" }, { status: 500 });
  }
}

const saveSchema = z.object({
  collegeId: z.string().min(1, "College ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = saveSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message ?? "Validation error" }, { status: 400 });
    }

    const { collegeId } = parsed.data;

    // Check college exists
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      return Response.json({ error: "College not found" }, { status: 404 });
    }

    // Upsert to handle duplicates gracefully
    const saved = await prisma.savedCollege.upsert({
      where: { userId_collegeId: { userId: authUser.id, collegeId } },
      update: {},
      create: { userId: authUser.id, collegeId },
      include: { college: true },
    });

    return Response.json({ saved, message: "College saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/saved error:", error);
    return Response.json({ error: "Failed to save college" }, { status: 500 });
  }
}
