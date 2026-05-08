import type { Project } from "@/lib/types";

type DbProject = {
  id: string;
  externalId?: string | null;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  coverUrl: string | null;
  category: string;
  tags: string;
  status: string;
  funding: number;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  screenshots: string;
  techStack: string;
  founderName: string;
  founderAvatar: string | null;
  usersCount: number;
  revenue: number;
  growthRate: number;
  featured: boolean;
  accentColor: string;
  founderPhone?: string | null;
  founderEmail?: string | null;
  founderTelegram?: string | null;
  founderRole?: string | null;
  founderBio?: string | null;
  founderSkills?: string | null;
  region?: string | null;
  teamSize?: number | null;
  commitment?: string | null;
  pitchDeckUrl?: string | null;
  resumeUrl?: string | null;
  acceptedAt?: Date | null;
  qa?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const parseList = (s: string | null | undefined): string[] => {
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseQA = (
  s: string | null | undefined,
): Array<{ question: string; answer: string }> => {
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed)
      ? parsed.filter(
          (x) =>
            x && typeof x.question === "string" && typeof x.answer === "string",
        )
      : [];
  } catch {
    return [];
  }
};

export function toProjectDTO(p: DbProject): Project {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    logoUrl: p.logoUrl,
    coverUrl: p.coverUrl,
    category: p.category,
    tags: parseList(p.tags),
    status: p.status as Project["status"],
    funding: p.funding,
    websiteUrl: p.websiteUrl,
    linkedinUrl: p.linkedinUrl,
    screenshots: parseList(p.screenshots),
    techStack: parseList(p.techStack),
    founderName: p.founderName,
    founderAvatar: p.founderAvatar,
    usersCount: p.usersCount,
    revenue: p.revenue,
    growthRate: p.growthRate,
    featured: p.featured,
    accentColor: p.accentColor,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    founderPhone: p.founderPhone ?? null,
    founderEmail: p.founderEmail ?? null,
    founderTelegram: p.founderTelegram ?? null,
    founderRole: p.founderRole ?? null,
    founderBio: p.founderBio ?? null,
    founderSkills: parseList(p.founderSkills),
    region: p.region ?? null,
    teamSize: p.teamSize ?? null,
    commitment: p.commitment ?? null,
    pitchDeckUrl: p.pitchDeckUrl ?? null,
    resumeUrl: p.resumeUrl ?? null,
    acceptedAt: p.acceptedAt ? p.acceptedAt.toISOString() : null,
    qa: parseQA(p.qa),
  };
}
