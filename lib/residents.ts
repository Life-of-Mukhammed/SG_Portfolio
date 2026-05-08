import { cache } from "react";
import type { Project, ProjectStatus } from "./types";
import { getResidencyDb } from "./mongo";
import { slugify } from "./utils";

const ACCENT_PALETTE = [
  "#22D3EE",
  "#6E56CF",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#0EA5E9",
];

function pickAccent(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return ACCENT_PALETTE[h % ACCENT_PALETTE.length];
}

function normalizeStage(stage?: string): ProjectStatus {
  const s = (stage ?? "").toLowerCase();
  if (s.includes("scale")) return "SCALE";
  if (s.includes("growth")) return "GROWTH";
  return "MVP";
}

function normalizeSphere(sphere?: string): string {
  if (!sphere) return "Other";
  return sphere.split(",")[0].trim();
}

function isoDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string") return v;
  return new Date().toISOString();
}

function mapDoc(d: Record<string, unknown>): Project {
  const id = String(d._id);
  const name = (d.startup_name as string) || "Unnamed";
  const baseSlug = slugify(name);
  const slug = baseSlug ? `${baseSlug}-${id.slice(-6)}` : id;

  const answers = Array.isArray(d.applicationAnswers)
    ? (d.applicationAnswers as Array<{ question?: string; answer?: string }>)
        .filter((a) => a?.question && a?.answer)
        .map((a) => ({
          question: String(a.question),
          answer: String(a.answer),
        }))
    : [];

  return {
    id,
    slug,
    name,
    tagline: "",
    description: (d.description as string) || "",
    logoUrl: (d.startup_logo as string) || null,
    coverUrl: null,
    category: normalizeSphere(d.startup_sphere as string),
    tags: [],
    status: normalizeStage(d.stage as string),
    funding: typeof d.investment_raised === "number" ? d.investment_raised : 0,
    websiteUrl: null,
    linkedinUrl: null,
    screenshots: [],
    techStack: [],
    founderName:
      (d.founder_name as string) ||
      `${(d.name as string) ?? ""} ${(d.surname as string) ?? ""}`.trim() ||
      "Founder",
    founderAvatar: null,
    usersCount: typeof d.users_count === "number" ? d.users_count : 0,
    revenue: typeof d.mrr === "number" ? d.mrr : 0,
    growthRate: 0,
    featured: false,
    accentColor: pickAccent(id),
    createdAt: isoDate(d.createdAt),
    updatedAt: isoDate(d.updatedAt),
    founderPhone: (d.phone as string) || null,
    founderEmail: (d.gmail as string) || null,
    founderTelegram: (d.telegram as string) || null,
    region: (d.region as string) || null,
    teamSize: typeof d.team_size === "number" ? d.team_size : null,
    commitment: (d.commitment as string) || null,
    pitchDeckUrl: (d.pitch_deck as string) || null,
    resumeUrl: (d.resume_url as string) || null,
    acceptedAt: d.acceptedAt ? isoDate(d.acceptedAt) : null,
    qa: answers,
  };
}

export const getResidents = cache(async (): Promise<Project[]> => {
  const db = await getResidencyDb();
  const docs = await db
    .collection("startups")
    .find(
      {
        status: "active",
        deletedAt: null,
        investment_raised: { $gt: 0 },
      },
      {
        projection: {
          _id: 1,
          startup_name: 1,
          description: 1,
          startup_logo: 1,
          startup_sphere: 1,
          stage: 1,
          founder_name: 1,
          name: 1,
          surname: 1,
          investment_raised: 1,
          mrr: 1,
          users_count: 1,
          createdAt: 1,
          updatedAt: 1,
          acceptedAt: 1,
          phone: 1,
          gmail: 1,
          telegram: 1,
          region: 1,
          team_size: 1,
          commitment: 1,
          pitch_deck: 1,
          resume_url: 1,
          applicationAnswers: 1,
        },
      },
    )
    .sort({ investment_raised: -1, acceptedAt: -1 })
    .toArray();

  const mapped = docs.map((d) => mapDoc(d as Record<string, unknown>));

  if (mapped.length) {
    const featuredIdx = mapped.reduce(
      (best, p, i, arr) => (p.funding > arr[best].funding ? i : best),
      0,
    );
    mapped[featuredIdx] = { ...mapped[featuredIdx], featured: true };
  }

  return mapped;
});

export const getResidentBySlug = cache(
  async (idOrSlug: string): Promise<Project | null> => {
    const all = await getResidents();
    return all.find((r) => r.slug === idOrSlug || r.id === idOrSlug) ?? null;
  },
);
