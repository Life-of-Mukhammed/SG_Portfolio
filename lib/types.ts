export type ProjectStatus = "MVP" | "GROWTH" | "SCALE";

export type Project = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  coverUrl: string | null;
  category: string;
  tags: string[];
  status: ProjectStatus;
  funding: number;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  screenshots: string[];
  techStack: string[];
  founderName: string;
  founderAvatar: string | null;
  usersCount: number;
  revenue: number;
  growthRate: number;
  featured: boolean;
  accentColor: string;
  createdAt: string;
  updatedAt: string;
  // Optional rich fields from MongoDB residents
  founderPhone?: string | null;
  founderEmail?: string | null;
  founderTelegram?: string | null;
  founderRole?: string | null;
  founderBio?: string | null;
  founderSkills?: string[];
  region?: string | null;
  teamSize?: number | null;
  commitment?: string | null;
  pitchDeckUrl?: string | null;
  resumeUrl?: string | null;
  acceptedAt?: string | null;
  qa?: Array<{ question: string; answer: string }>;
};

export const STATUS_META: Record<
  ProjectStatus,
  { label: string; tone: string; ring: string }
> = {
  MVP: {
    label: "MVP",
    tone: "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20",
    ring: "ring-amber-400/40",
  },
  GROWTH: {
    label: "Growth",
    tone: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    ring: "ring-emerald-400/40",
  },
  SCALE: {
    label: "Scale",
    tone: "text-sky-700 dark:text-sky-300 bg-sky-500/10 border-sky-500/20",
    ring: "ring-sky-400/40",
  },
};

export const CATEGORIES = [
  "All",
  "Edtech",
  "Fintech",
  "AI",
  "Ecommerce",
  "MedTech",
  "Service",
  "Social",
] as const;
