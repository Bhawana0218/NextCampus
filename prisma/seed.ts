import bcrypt from "bcryptjs";
import { Prisma, PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();

function parseCollegeSeedData(raw: unknown): Prisma.CollegeCreateManyInput[] {
  if (!Array.isArray(raw)) return [];
  return raw as Prisma.CollegeCreateManyInput[];
}

async function loadCollegeSeedData(): Promise<Prisma.CollegeCreateManyInput[]> {
  const configuredPath = process.env.COLLEGE_SEED_FILE?.trim();
  const filePath = configuredPath
    ? path.resolve(process.cwd(), configuredPath)
    : path.resolve(process.cwd(), "prisma", "colleges.seed.json");

  try {
    const content = await readFile(filePath, "utf8");
    const parsed = JSON.parse(content) as unknown;
    const data = parseCollegeSeedData(parsed);
    console.log(`Loaded ${data.length} college records from ${filePath}`);
    return data;
  } catch (error) {
    console.log(`No college seed file loaded from ${filePath}.`);
    console.log(
      "Set COLLEGE_SEED_FILE or create prisma/colleges.seed.json to seed colleges."
    );
    if (error instanceof Error) {
      console.log(`Seed file note: ${error.message}`);
    }
    return [];
  }
}

async function main() {
  console.log("Seeding database...");

  const colleges = await loadCollegeSeedData();
  const shouldResetColleges = process.env.SEED_RESET_COLLEGES === "true";
  let createdCount = 0;

  if (shouldResetColleges) {
    await prisma.savedCollege.deleteMany();
    await prisma.college.deleteMany();
  }

  if (colleges.length > 0) {
    const created = await prisma.college.createMany({
      data: colleges,
      skipDuplicates: true,
    });
    createdCount = created.count;
  }

  const demoPassword = await bcrypt.hash("Test@1234", 12);
  await prisma.user.upsert({
    where: { email: "demo@nextcampus.app" },
    update: { name: "Demo Student", password: demoPassword },
    create: {
      name: "Demo Student",
      email: "demo@nextcampus.app",
      password: demoPassword,
      rank: 12000,
      budget: 250000,
      interests: ["CSE", "ECE"],
    },
  });

  console.log(`Seed complete. Inserted ${createdCount} colleges.`);
  if (!shouldResetColleges) {
    console.log("Tip: set SEED_RESET_COLLEGES=true to clear existing colleges before seeding.");
  }
  console.log("Demo user: demo@nextcampus.app / Test@1234");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
