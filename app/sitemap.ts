import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = "https://startupgarage.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
}
