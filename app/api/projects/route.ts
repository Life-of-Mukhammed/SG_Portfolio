import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { toProjectDTO } from "@/lib/serialize";
import { slugify } from "@/lib/utils";

const optionalUrl = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => (v == null || v === "" ? null : v));

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  tagline: z.string().default(""),
  description: z.string().min(1),
  logoUrl: optionalUrl,
  coverUrl: optionalUrl,
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  status: z.enum(["MVP", "GROWTH", "SCALE"]).default("MVP"),
  funding: z.number().int().min(0).default(0),
  websiteUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  screenshots: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  founderName: z.string().min(1),
  founderAvatar: optionalUrl,
  usersCount: z.number().int().min(0).default(0),
  revenue: z.number().int().min(0).default(0),
  growthRate: z.number().default(0),
  featured: z.boolean().default(false),
  accentColor: z.string().default("#6E56CF"),
  founderPhone: z.string().nullable().optional(),
  founderEmail: z.union([z.string(), z.null()]).optional().transform((v) => (v == null || v === "" ? null : v)),
  founderTelegram: z.string().nullable().optional(),
  founderRole: z.string().nullable().optional(),
  founderBio: z.string().nullable().optional(),
  founderSkills: z.array(z.string()).default([]),
  region: z.string().nullable().optional(),
  teamSize: z.number().int().min(0).nullable().optional(),
  commitment: z.string().nullable().optional(),
  pitchDeckUrl: optionalUrl,
  resumeUrl: optionalUrl,
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q");

  const where: Record<string, unknown> = {};
  if (category && category !== "All") where.category = category;
  if (status && status !== "All") where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { tagline: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const rows = await prisma.project.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ data: rows.map(toProjectDTO) });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  const created = await prisma.project.create({
    data: {
      name: data.name,
      slug,
      tagline: data.tagline,
      description: data.description,
      logoUrl: data.logoUrl ?? null,
      coverUrl: data.coverUrl ?? null,
      category: data.category,
      tags: JSON.stringify(data.tags),
      status: data.status,
      funding: data.funding,
      websiteUrl: data.websiteUrl ?? null,
      linkedinUrl: data.linkedinUrl ?? null,
      screenshots: JSON.stringify(data.screenshots),
      techStack: JSON.stringify(data.techStack),
      founderName: data.founderName,
      founderAvatar: data.founderAvatar ?? null,
      usersCount: data.usersCount,
      revenue: data.revenue,
      growthRate: data.growthRate,
      featured: data.featured,
      accentColor: data.accentColor,
      founderPhone: data.founderPhone ?? null,
      founderEmail: data.founderEmail ?? null,
      founderTelegram: data.founderTelegram ?? null,
      founderRole: data.founderRole ?? null,
      founderBio: data.founderBio ?? null,
      founderSkills: JSON.stringify(data.founderSkills ?? []),
      region: data.region ?? null,
      teamSize: data.teamSize ?? null,
      commitment: data.commitment ?? null,
      pitchDeckUrl: data.pitchDeckUrl ?? null,
      resumeUrl: data.resumeUrl ?? null,
    },
  });

  return NextResponse.json({ data: toProjectDTO(created) }, { status: 201 });
}
