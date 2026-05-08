import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { toProjectDTO } from "@/lib/serialize";

const optionalUrl = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => (v == null || v === "" ? null : v));

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().min(1).optional(),
  logoUrl: optionalUrl,
  coverUrl: optionalUrl,
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["MVP", "GROWTH", "SCALE"]).optional(),
  funding: z.number().int().min(0).optional(),
  websiteUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  screenshots: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
  founderName: z.string().optional(),
  founderAvatar: optionalUrl,
  usersCount: z.number().int().min(0).optional(),
  revenue: z.number().int().min(0).optional(),
  growthRate: z.number().optional(),
  featured: z.boolean().optional(),
  accentColor: z.string().optional(),
  // Resident fields
  founderPhone: z.string().nullable().optional(),
  founderEmail: z.union([z.string(), z.null()]).optional().transform((v) => (v == null || v === "" ? null : v)),
  founderTelegram: z.string().nullable().optional(),
  founderRole: z.string().nullable().optional(),
  founderBio: z.string().nullable().optional(),
  founderSkills: z.array(z.string()).optional(),
  region: z.string().nullable().optional(),
  teamSize: z.number().int().min(0).nullable().optional(),
  commitment: z.string().nullable().optional(),
  pitchDeckUrl: optionalUrl,
  resumeUrl: optionalUrl,
});

async function findByIdOrSlug(idOrSlug: string) {
  return prisma.project.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
  });
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const project = await findByIdOrSlug(params.id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: toProjectDTO(project) });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await findByIdOrSlug(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const updated = await prisma.project.update({
    where: { id: existing.id },
    data: {
      ...(d.name !== undefined && { name: d.name }),
      ...(d.slug !== undefined && { slug: d.slug }),
      ...(d.tagline !== undefined && { tagline: d.tagline }),
      ...(d.description !== undefined && { description: d.description }),
      ...(d.logoUrl !== undefined && { logoUrl: d.logoUrl }),
      ...(d.coverUrl !== undefined && { coverUrl: d.coverUrl }),
      ...(d.category !== undefined && { category: d.category }),
      ...(d.tags !== undefined && { tags: JSON.stringify(d.tags) }),
      ...(d.status !== undefined && { status: d.status }),
      ...(d.funding !== undefined && { funding: d.funding }),
      ...(d.websiteUrl !== undefined && { websiteUrl: d.websiteUrl }),
      ...(d.linkedinUrl !== undefined && { linkedinUrl: d.linkedinUrl }),
      ...(d.screenshots !== undefined && { screenshots: JSON.stringify(d.screenshots) }),
      ...(d.techStack !== undefined && { techStack: JSON.stringify(d.techStack) }),
      ...(d.founderName !== undefined && { founderName: d.founderName }),
      ...(d.founderAvatar !== undefined && { founderAvatar: d.founderAvatar }),
      ...(d.usersCount !== undefined && { usersCount: d.usersCount }),
      ...(d.revenue !== undefined && { revenue: d.revenue }),
      ...(d.growthRate !== undefined && { growthRate: d.growthRate }),
      ...(d.featured !== undefined && { featured: d.featured }),
      ...(d.accentColor !== undefined && { accentColor: d.accentColor }),
      ...(d.founderPhone !== undefined && { founderPhone: d.founderPhone }),
      ...(d.founderEmail !== undefined && { founderEmail: d.founderEmail }),
      ...(d.founderTelegram !== undefined && { founderTelegram: d.founderTelegram }),
      ...(d.founderRole !== undefined && { founderRole: d.founderRole }),
      ...(d.founderBio !== undefined && { founderBio: d.founderBio }),
      ...(d.founderSkills !== undefined && {
        founderSkills: JSON.stringify(d.founderSkills),
      }),
      ...(d.region !== undefined && { region: d.region }),
      ...(d.teamSize !== undefined && { teamSize: d.teamSize }),
      ...(d.commitment !== undefined && { commitment: d.commitment }),
      ...(d.pitchDeckUrl !== undefined && { pitchDeckUrl: d.pitchDeckUrl }),
      ...(d.resumeUrl !== undefined && { resumeUrl: d.resumeUrl }),
    },
  });

  return NextResponse.json({ data: toProjectDTO(updated) });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await findByIdOrSlug(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.project.delete({ where: { id: existing.id } });
  return NextResponse.json({ ok: true });
}
