import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // id can be either savedCollege.id or collegeId — support both
    const saved = await prisma.savedCollege.findFirst({
      where: {
        userId: authUser.id,
        OR: [{ id }, { collegeId: id }],
      },
    });

    if (!saved) {
      return Response.json({ error: "Saved college not found" }, { status: 404 });
    }

    await prisma.savedCollege.delete({ where: { id: saved.id } });

    return Response.json({ message: "College removed from saved list" });
  } catch (error) {
    console.error("DELETE /api/saved/[id] error:", error);
    return Response.json({ error: "Failed to remove saved college" }, { status: 500 });
  }
}
