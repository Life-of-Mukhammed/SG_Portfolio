import { prisma } from "@/lib/db";
import { getResidents } from "@/lib/residents";
import { revalidatePath } from "next/cache";

export type SyncResult = {
  total: number;
  created: number;
  updated: number;
  skipped: number;
};

export async function syncResidentsFromMongo(): Promise<SyncResult> {
  const residents = await getResidents();

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const r of residents) {
    try {
      const existing = await prisma.project.findUnique({
        where: { externalId: r.id },
      });

      const data = {
        externalId: r.id,
        slug: r.slug,
        name: r.name,
        tagline: r.tagline ?? "",
        description: r.description,
        logoUrl: r.logoUrl,
        coverUrl: r.coverUrl,
        category: r.category,
        tags: JSON.stringify(r.tags ?? []),
        status: r.status,
        funding: r.funding,
        websiteUrl: r.websiteUrl,
        linkedinUrl: r.linkedinUrl,
        screenshots: JSON.stringify(r.screenshots ?? []),
        techStack: JSON.stringify(r.techStack ?? []),
        founderName: r.founderName,
        founderAvatar: r.founderAvatar,
        usersCount: r.usersCount,
        revenue: r.revenue,
        growthRate: r.growthRate,
        featured: r.featured,
        accentColor: r.accentColor,
        founderPhone: r.founderPhone ?? null,
        founderEmail: r.founderEmail ?? null,
        founderTelegram: r.founderTelegram ?? null,
        founderRole: r.founderRole ?? null,
        founderBio: r.founderBio ?? null,
        founderSkills: JSON.stringify(r.founderSkills ?? []),
        region: r.region ?? null,
        teamSize: r.teamSize ?? null,
        commitment: r.commitment ?? null,
        pitchDeckUrl: r.pitchDeckUrl ?? null,
        resumeUrl: r.resumeUrl ?? null,
        acceptedAt: r.acceptedAt ? new Date(r.acceptedAt) : null,
        qa: JSON.stringify(r.qa ?? []),
      };

      if (existing) {
        // Already imported — preserve admin's local edits, do not overwrite.
        skipped++;
      } else {
        // Slug must be unique — if collision (different externalId), suffix the slug
        const collision = await prisma.project.findUnique({
          where: { slug: data.slug },
        });
        const finalSlug = collision ? `${data.slug}-${r.id.slice(-4)}` : data.slug;
        await prisma.project.create({ data: { ...data, slug: finalSlug } });
        created++;
      }
    } catch (e) {
      skipped++;
      console.error("Sync skip:", r.id, e);
    }
  }

  // Bust the homepage and detail caches
  revalidatePath("/");
  revalidatePath("/projects/[id]", "page");

  return { total: residents.length, created, updated, skipped };
}
