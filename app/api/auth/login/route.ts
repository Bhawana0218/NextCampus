import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, COOKIE_NAME_EXPORT } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const userRaw = await prisma.user.findFirst({
      where: { email },
    });

    // Cast to include name — LS may have stale Prisma types but tsc confirms name exists
    const user = userRaw as (typeof userRaw & { name: string }) | null;

    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({ id: user.id, email: user.email, name: user.name });

    const response = Response.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });

    response.headers.set(
      "Set-Cookie",
      `${COOKIE_NAME_EXPORT}=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
    );

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
