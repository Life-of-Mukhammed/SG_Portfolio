import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const BASE = "https://startupgarage.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const projects = await prisma.project.findMany({
      select: { slug: true, updatedAt: true },
    });
    return [
      { url: BASE, lastModified: new Date(), priority: 1 },
      ...projects.map((p) => ({
        url: `${BASE}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        priority: 0.8,
      })),
    ];
  } catch {
    return [{ url: BASE, lastModified: new Date(), priority: 1 }];
  }
}
