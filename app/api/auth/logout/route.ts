import { COOKIE_NAME_EXPORT } from "@/lib/auth";

export async function POST() {
  const response = Response.json({ message: "Logged out successfully" });
  response.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME_EXPORT}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  );
  return response;
}
