import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const projects = [
  {
    slug: "zingo",
    name: "Zingo",
    tagline: "Real-time conversation matching for the curious.",
    description:
      "Zingo connects people with shared interests for spontaneous, location-aware conversations. Match by topic, voice, or proximity — no profiles, no friction. Built for moments, not feeds.",
    category: "Social",
    tags: ["Conversation", "Geo-matching", "Realtime"],
    status: "GROWTH",
    funding: 850000,
    websiteUrl: "https://zingo.app",
    linkedinUrl: "https://linkedin.com/company/zingo",
    techStack: ["Next.js", "WebRTC", "Postgres", "Redis", "Cloudflare Workers"],
    founderName: "Aziza Karimova",
    usersCount: 42000,
    revenue: 18000,
    growthRate: 28.4,
    featured: true,
    accentColor: "#6E56CF",
  },
  {
    slug: "edu-tizim",
    name: "Edu Tizim",
    tagline: "The operating system for modern learning centers.",
    description:
      "All-in-one CRM and LMS for educational centers. Lessons, billing, attendance, parent communication, and analytics — unified into a single workflow that schools actually want to use.",
    category: "Edtech",
    tags: ["CRM", "LMS", "B2B SaaS"],
    status: "SCALE",
    funding: 1200000,
    websiteUrl: "https://edutizim.uz",
    techStack: ["Django", "PostgreSQL", "React", "Twilio"],
    founderName: "Bekzod Tursunov",
    usersCount: 86000,
    revenue: 64000,
    growthRate: 14.2,
    featured: false,
    accentColor: "#0EA5E9",
  },
  {
    slug: "magicbot",
    name: "Magicbot",
    tagline: "AI customer support that sounds like your best agent.",
    description:
      "Magicbot trains on your tickets, voice, and brand to handle support across chat, email, and voice. Resolves 70%+ of inbound volume; escalates the rest with full context.",
    category: "AI",
    tags: ["Customer Support", "LLM", "Multilingual"],
    status: "GROWTH",
    funding: 2300000,
    techStack: ["Python", "FastAPI", "OpenAI", "Pinecone", "Next.js"],
    founderName: "Diyora Ismoilova",
    usersCount: 12000,
    revenue: 92000,
    growthRate: 41.7,
    featured: true,
    accentColor: "#22D3EE",
  },
  {
    slug: "karmon",
    name: "Karmon",
    tagline: "Creator economy infrastructure for Central Asia.",
    description:
      "Payments, payouts, and storefronts for independent creators. Multi-currency, with built-in tax handling, fan subscriptions, and one-tap product drops.",
    category: "Fintech",
    tags: ["Creator Economy", "Payments", "Subscriptions"],
    status: "MVP",
    funding: 320000,
    techStack: ["Node.js", "Stripe", "Postgres", "Next.js"],
    founderName: "Sardor Mirzayev",
    usersCount: 3400,
    revenue: 4200,
    growthRate: 62.0,
    featured: false,
    accentColor: "#10B981",
  },
  {
    slug: "repli-uz",
    name: "Repli Uz",
    tagline: "Personal AI agents for non-technical builders.",
    description:
      "Describe what you want — Repli builds, deploys, and maintains it. Pre-trained agents for sales, ops, recruiting, and content. Works in Uzbek, Russian, and English.",
    category: "AI",
    tags: ["Agents", "No-code", "Multilingual"],
    status: "MVP",
    funding: 180000,
    techStack: ["TypeScript", "Anthropic", "Supabase"],
    founderName: "Jasur Rahmonov",
    usersCount: 1900,
    revenue: 2100,
    growthRate: 88.5,
    featured: false,
    accentColor: "#F59E0B",
  },
  {
    slug: "kary",
    name: "Kary",
    tagline: "Roadside services, on demand.",
    description:
      "Kary aggregates auto-services — fuel delivery, towing, jump-start, mobile mechanic — into a single map. Pay per use, with transparent pricing and verified providers.",
    category: "Service",
    tags: ["Marketplace", "Auto", "On-demand"],
    status: "GROWTH",
    funding: 540000,
    techStack: ["Flutter", "Node.js", "Postgres", "Mapbox"],
    founderName: "Otabek Yuldashev",
    usersCount: 24000,
    revenue: 21000,
    growthRate: 19.8,
    featured: false,
    accentColor: "#EF4444",
  },
  {
    slug: "femmy",
    name: "Femmy",
    tagline: "Reproductive health, on women's terms.",
    description:
      "Femmy is a private companion for tracking, learning, and consulting on reproductive and gynecological health. Local doctors, secure records, judgment-free.",
    category: "MedTech",
    tags: ["Women's Health", "Telemedicine", "Privacy"],
    status: "MVP",
    funding: 410000,
    techStack: ["React Native", "Node.js", "MongoDB"],
    founderName: "Madina Saidova",
    usersCount: 8700,
    revenue: 3800,
    growthRate: 54.1,
    featured: false,
    accentColor: "#EC4899",
  },
  {
    slug: "stoki",
    name: "Stoki",
    tagline: "Inventory intelligence for SME retail.",
    description:
      "Forecast demand, reorder automatically, and surface dead stock. Stoki plugs into 1C and major POS systems and replaces gut-feel inventory with weekly insights.",
    category: "Ecommerce",
    tags: ["Retail", "Forecasting", "B2B"],
    status: "GROWTH",
    funding: 720000,
    techStack: ["Python", "TimescaleDB", "Next.js"],
    founderName: "Rustam Kamilov",
    usersCount: 5400,
    revenue: 38000,
    growthRate: 23.6,
    featured: false,
    accentColor: "#8B5CF6",
  },
  {
    slug: "lessonly-ai",
    name: "Lessonly AI",
    tagline: "Personalized tutoring for every student.",
    description:
      "An AI tutor that adapts to each student's pace, language, and learning style. Used by 200+ schools to close gaps in math and language outcomes.",
    category: "Edtech",
    tags: ["Tutoring", "Adaptive Learning", "K-12"],
    status: "GROWTH",
    funding: 980000,
    techStack: ["Next.js", "OpenAI", "Postgres"],
    founderName: "Kamila Nazarova",
    usersCount: 31000,
    revenue: 47000,
    growthRate: 33.2,
    featured: false,
    accentColor: "#3B82F6",
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@startupgarage.io";
  const adminPassword = process.env.ADMIN_PASSWORD || "garage2026";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN" },
    create: { email: adminEmail, passwordHash, role: "ADMIN" },
  });
  console.log(`✓ Admin user: ${adminEmail}`);

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        category: p.category,
        tags: JSON.stringify(p.tags),
        status: p.status,
        funding: p.funding,
        websiteUrl: p.websiteUrl ?? null,
        linkedinUrl: p.linkedinUrl ?? null,
        screenshots: JSON.stringify([]),
        techStack: JSON.stringify(p.techStack),
        founderName: p.founderName,
        founderAvatar: null,
        usersCount: p.usersCount,
        revenue: p.revenue,
        growthRate: p.growthRate,
        featured: p.featured,
        accentColor: p.accentColor,
      },
    });
    console.log(`  ↳ seeded ${p.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
