import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Wallet,
  Layers,
  MapPin,
  Users as UsersIcon,
  Briefcase,
  HelpCircle,
  CalendarCheck,
  User as UserIcon,
  Sparkles,
  Globe,
  Quote,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { toProjectDTO } from "@/lib/serialize";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency } from "@/lib/utils";
import { ProjectCardStandard } from "@/components/project/ProjectCardStandard";
import type { Project } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = await prisma.project.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }, { externalId: params.id }] },
  });
  if (!p) return {};
  return { title: p.name, description: p.description.slice(0, 160) };
}

const STAGE_LABEL: Record<string, string> = {
  MVP: "MVP",
  GROWTH: "Growth",
  SCALE: "Scale",
};

const COMMITMENT_LABEL: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const row = await prisma.project.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }, { externalId: params.id }] },
  });
  if (!row) notFound();
  const project = toProjectDTO(row);

  const others = (
    await prisma.project.findMany({
      where: { id: { not: row.id }, category: row.category, funding: { gt: 0 } },
      take: 3,
      orderBy: { funding: "desc" },
    })
  ).map(toProjectDTO);

  const accent = project.accentColor;
  const acceptedYear = project.acceptedAt ? new Date(project.acceptedAt).getFullYear() : null;

  return (
    <article className="relative pb-20">
      {/* COVER BANNER */}
      <div className="relative">
        <div
          className="relative h-[280px] md:h-[340px] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${accent} 0%, ${accent}c0 60%, ${accent}90 100%)`,
          }}
        >
          {project.coverUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-50"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${accent}cc, ${accent}80)`,
                }}
              />
            </>
          ) : null}

          {/* Layered ambient depth */}
          <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-black/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />

          {/* Back link */}
          <div className="container relative pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 px-3 py-1.5 text-[11.5px] font-bold text-white hover:bg-white/25 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Barcha loyihalar
            </Link>
          </div>

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg" />
        </div>

        {/* Identity card overlapping banner */}
        <div className="container relative -mt-20 md:-mt-24">
          <div className="rounded-[28px] border border-border bg-surface/95 backdrop-blur-xl p-6 md:p-8 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.25)]">
            <div className="grid gap-6 md:grid-cols-[auto,1fr,auto] md:items-start">
              <StartupLogo project={project} />

              <div className="min-w-0">
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
                  style={{
                    color: accent,
                    borderColor: `${accent}50`,
                    background: `${accent}12`,
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  {project.category}
                </span>
                <h1 className="mt-3 font-display text-[36px] md:text-[48px] lg:text-[58px] font-extrabold tracking-tight leading-[1.02]">
                  {project.name}
                </h1>
                {project.tagline && (
                  <p className="mt-3 max-w-2xl text-[16px] md:text-[17px] font-medium text-muted leading-snug text-balance">
                    {project.tagline}
                  </p>
                )}
              </div>

              {acceptedYear && (
                <div
                  className="hidden md:flex flex-col items-end gap-1 rounded-2xl border px-4 py-3"
                  style={{
                    borderColor: `${accent}30`,
                    background: `${accent}08`,
                  }}
                >
                  <CalendarCheck className="h-4 w-4" style={{ color: accent }} />
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-subtle">
                    Rezident
                  </div>
                  <div
                    className="text-2xl font-display font-extrabold tabular-nums"
                    style={{ color: accent }}
                  >
                    {acceptedYear}
                  </div>
                </div>
              )}
            </div>

            {/* Stat strip */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border">
              <BigStat
                label="Investitsiya"
                value={formatCurrency(project.funding, { compact: true })}
                accent={accent}
                emphasis
              />
              <BigStat label="Soha" value={project.category} accent={accent} />
              {project.region && (
                <BigStat label="Hudud" value={project.region} accent={accent} />
              )}
              {project.teamSize ? (
                <BigStat label="Jamoa" value={`${project.teamSize} kishi`} accent={accent} />
              ) : project.commitment ? (
                <BigStat
                  label="Faollik"
                  value={COMMITMENT_LABEL[project.commitment] ?? project.commitment}
                  accent={accent}
                />
              ) : null}
            </div>

            {project.websiteUrl && (
              <div className="mt-6 flex flex-wrap items-center gap-2 pt-6 border-t border-border">
                <PrimaryDocLink
                  href={project.websiteUrl}
                  icon={<Globe className="h-3.5 w-3.5" />}
                  label="Saytga o'tish"
                  accent={accent}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="container mt-12 md:mt-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-10">
            {/* About */}
            <section>
              <SectionHeader
                accent={accent}
                icon={<Layers className="h-3.5 w-3.5" />}
                eyebrow="Biz nima qilamiz"
                title="Loyiha haqida"
              />
              <div
                className="relative mt-6 rounded-2xl border bg-surface/60 backdrop-blur-sm p-7 md:p-9"
                style={{ borderColor: `${accent}25` }}
              >
                <Quote
                  className="absolute -top-3 left-7 h-7 w-7 rounded-full p-1.5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, ${accent}b0)`,
                    boxShadow: `0 10px 22px -8px ${accent}80`,
                  }}
                />
                <p className="text-[16px] md:text-[16.5px] text-fg/85 leading-[1.85] whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </section>

            {/* Investment */}
            <section>
              <SectionHeader
                accent={accent}
                icon={<Wallet className="h-3.5 w-3.5" />}
                eyebrow="Kapital"
                title="Investitsiya"
              />
              <div
                className="relative mt-6 overflow-hidden rounded-2xl p-5 md:p-7 text-white"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${accent}c8 60%, ${accent}a0)`,
                  boxShadow: `0 24px 50px -22px ${accent}a0`,
                }}
              >
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
                <div className="absolute -left-14 -bottom-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/12 to-transparent" />

                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]">
                    <Wallet className="h-3 w-3" />
                    Jalb qilingan kapital
                  </span>
                  <div className="mt-3 font-display text-[34px] md:text-[44px] font-extrabold tracking-tight tabular-nums leading-none">
                    {formatCurrency(project.funding, { compact: true })}
                  </div>
                  <div className="mt-1.5 text-[12px] font-medium text-white/85 tabular-nums">
                    {formatCurrency(project.funding, { compact: false })}
                  </div>
                </div>
              </div>
            </section>

            {/* Founder */}
            <section>
              <SectionHeader
                accent={accent}
                icon={<UserIcon className="h-3.5 w-3.5" />}
                eyebrow="Jamoa"
                title="Founder"
              />
              <div
                className="relative mt-6 overflow-hidden rounded-3xl border bg-surface/70 backdrop-blur-xl p-7 md:p-10"
                style={{ borderColor: `${accent}30` }}
              >
                <div
                  className="absolute -top-32 -right-20 h-72 w-72 rounded-full opacity-25 blur-3xl"
                  style={{ background: accent }}
                />
                <div
                  className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full opacity-15 blur-3xl"
                  style={{ background: accent }}
                />

                <div className="relative grid gap-8 md:grid-cols-[200px,1fr] md:items-start">
                  {/* Portrait */}
                  <div className="flex flex-col items-center md:items-start">
                    <div
                      className="rounded-[28px] p-[3px]"
                      style={{
                        background: `linear-gradient(135deg, ${accent}, ${accent}40)`,
                        boxShadow: `0 28px 60px -20px ${accent}90`,
                      }}
                    >
                      <div className="rounded-[26px] overflow-hidden bg-surface">
                        {project.founderAvatar ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={project.founderAvatar}
                            alt={project.founderName}
                            className="h-[180px] w-[180px] object-cover"
                          />
                        ) : (
                          <div className="h-[180px] w-[180px]">
                            <Avatar
                              name={project.founderName}
                              src={project.founderAvatar}
                              size={180}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info under image */}
                    <div className="mt-4 w-full md:w-[200px] text-center md:text-left">
                      <div className="font-display text-xl md:text-[22px] font-extrabold tracking-tight leading-tight">
                        {project.founderName}
                      </div>
                      <div
                        className="mt-1 text-[11.5px] font-bold uppercase tracking-[0.16em]"
                        style={{ color: accent }}
                      >
                        {project.founderRole || `${project.name} asoschisi`}
                      </div>
                      {project.region && (
                        <div className="mt-2 inline-flex items-center gap-1 text-[12px] text-muted">
                          <MapPin className="h-3 w-3" />
                          {project.region}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio + skills */}
                  <div className="min-w-0">
                    {project.founderBio ? (
                      <>
                        <div
                          className="text-[10.5px] font-bold uppercase tracking-[0.18em]"
                          style={{ color: accent }}
                        >
                          Tajriba
                        </div>
                        <p className="mt-3 text-[15px] text-fg/85 leading-[1.8] whitespace-pre-line">
                          {project.founderBio}
                        </p>
                      </>
                    ) : (
                      <p className="text-[15px] text-muted leading-[1.8]">
                        {project.name} loyihasini boshqaruvchi va rivojlantiruvchi.
                        {acceptedYear &&
                          ` Startup Garage rezidenti — ${acceptedYear}-yildan beri faol.`}
                      </p>
                    )}

                    {project.founderSkills && project.founderSkills.length > 0 && (
                      <div className="mt-7">
                        <div
                          className="text-[10.5px] font-bold uppercase tracking-[0.18em]"
                          style={{ color: accent }}
                        >
                          Skills
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.founderSkills.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold"
                              style={{
                                color: accent,
                                borderColor: `${accent}40`,
                                background: `${accent}10`,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {project.teamSize ? (
                        <FounderStat
                          label="Jamoa"
                          value={`${project.teamSize} kishi`}
                          icon={<UsersIcon className="h-3.5 w-3.5" />}
                          accent={accent}
                        />
                      ) : null}
                      {project.commitment && (
                        <FounderStat
                          label="Faollik"
                          value={
                            COMMITMENT_LABEL[project.commitment] ?? project.commitment
                          }
                          icon={<Briefcase className="h-3.5 w-3.5" />}
                          accent={accent}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Application Q&A */}
            {project.qa && project.qa.length > 0 && (
              <section>
                <SectionHeader
                  accent={accent}
                  icon={<HelpCircle className="h-3.5 w-3.5" />}
                  eyebrow="Hujjatlar"
                  title="Rezidentlik arizasi"
                />
                <div className="mt-6 space-y-3">
                  {project.qa.map((qa, i) => (
                    <details
                      key={i}
                      className="group rounded-2xl border bg-surface/60 backdrop-blur-sm overflow-hidden transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.18)]"
                      style={{ borderColor: `${accent}25` }}
                      open={i === 0}
                    >
                      <summary className="flex items-start justify-between gap-4 cursor-pointer p-5 md:p-6 list-none">
                        <div className="flex items-start gap-3.5">
                          <span
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[11.5px] font-bold text-white tabular-nums"
                            style={{
                              background: `linear-gradient(135deg, ${accent}, ${accent}b0)`,
                              boxShadow: `0 8px 18px -8px ${accent}80`,
                            }}
                          >
                            {i + 1}
                          </span>
                          <h4 className="font-display text-[15px] md:text-base font-extrabold tracking-tight leading-snug pr-2">
                            {qa.question}
                          </h4>
                        </div>
                        <span
                          className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-muted transition-transform group-open:rotate-45"
                          style={{ borderColor: `${accent}40` }}
                        >
                          +
                        </span>
                      </summary>
                      <div className="px-5 pb-5 md:px-6 md:pb-6 -mt-1 ml-[42px] md:ml-[44px] text-[14.5px] text-fg/80 leading-[1.8] whitespace-pre-line">
                        {qa.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Screenshots */}
            {project.screenshots.length > 0 && (
              <section>
                <SectionHeader
                  accent={accent}
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  eyebrow="Vizual"
                  title="Screenshots"
                />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.screenshots.map((s) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={s}
                      src={s}
                      alt=""
                      loading="lazy"
                      className="rounded-2xl border border-border bg-elevated transition-transform duration-500 hover:scale-[1.02]"
                      style={{ boxShadow: `0 24px 50px -22px ${accent}55` }}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div
              className="relative overflow-hidden rounded-2xl border bg-surface/70 backdrop-blur-xl p-6"
              style={{ borderColor: `${accent}30` }}
            >
              <div
                className="absolute -top-20 -right-20 h-44 w-44 rounded-full opacity-30 blur-3xl"
                style={{ background: accent }}
              />
              <div className="relative">
                <div
                  className="text-[10.5px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: accent }}
                >
                  Loyiha ma'lumotlari
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Soha" value={project.category} accent={accent} />
                  {project.region && (
                    <Row label="Hudud" value={project.region} accent={accent} />
                  )}
                  {project.teamSize ? (
                    <Row
                      label="Jamoa"
                      value={`${project.teamSize} kishi`}
                      accent={accent}
                    />
                  ) : null}
                  {project.commitment && (
                    <Row
                      label="Faollik"
                      value={
                        COMMITMENT_LABEL[project.commitment] ?? project.commitment
                      }
                      accent={accent}
                    />
                  )}
                  {acceptedYear && (
                    <Row
                      label="Rezident"
                      value={String(acceptedYear)}
                      accent={accent}
                    />
                  )}
                  <Row
                    label="Investitsiya"
                    value={formatCurrency(project.funding)}
                    accent={accent}
                    emphasis
                  />
                </dl>
              </div>
            </div>

            {others.length > 0 && (
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-muted mb-4 px-1 flex items-center justify-between">
                  <span>Yana {project.category}</span>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-fg"
                  >
                    Hammasi
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {others.map((o) => (
                    <ProjectCardStandard key={o.id} project={o} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}

function StartupLogo({ project }: { project: Project }) {
  const accent = project.accentColor;
  if (project.logoUrl) {
    return (
      <div
        className="relative h-[110px] w-[110px] md:h-[128px] md:w-[128px] shrink-0 overflow-hidden rounded-[28px] ring-4 ring-bg"
        style={{
          boxShadow: `0 30px 60px -20px ${accent}90`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.logoUrl}
          alt={project.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className="relative flex h-[110px] w-[110px] md:h-[128px] md:w-[128px] shrink-0 items-center justify-center rounded-[28px] text-[44px] md:text-5xl font-extrabold text-white ring-4 ring-bg"
      style={{
        background: `linear-gradient(135deg, ${accent}, ${accent}b0)`,
        boxShadow: `0 30px 60px -20px ${accent}90, inset 0 2px 0 0 rgba(255,255,255,0.25)`,
      }}
    >
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/20 to-transparent" />
      <span className="relative">{project.name[0]}</span>
    </div>
  );
}

function PrimaryDocLink({
  href,
  icon,
  label,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  accent: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-bold text-white transition-transform hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${accent}, ${accent}d0)`,
        boxShadow: `0 14px 30px -10px ${accent}90`,
      }}
    >
      {icon}
      {label}
      <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

function SectionHeader({
  accent,
  icon,
  eyebrow,
  title,
}: {
  accent: string;
  icon: React.ReactNode;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-white"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}b0)`,
          boxShadow: `0 12px 28px -10px ${accent}80`,
        }}
      >
        {icon}
      </span>
      <div>
        {eyebrow && (
          <div
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-2xl md:text-[30px] font-extrabold tracking-tight leading-none mt-0.5">
          {title}
        </h2>
      </div>
    </div>
  );
}

function BigStat({
  label,
  value,
  accent,
  emphasis,
}: {
  label: string;
  value: string;
  accent: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <div
        className="text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div
        className={`mt-1 font-display font-extrabold tracking-tight tabular-nums truncate ${
          emphasis ? "text-2xl md:text-[28px]" : "text-lg md:text-xl"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function FounderStat({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{
        background: `linear-gradient(135deg, ${accent}10, ${accent}03)`,
        borderColor: `${accent}30`,
      }}
    >
      <div
        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{ color: accent }}
      >
        {icon}
        {label}
      </div>
      <div className="mt-1 text-[13.5px] font-extrabold truncate">{value}</div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  emphasis,
}: {
  label: string;
  value: string;
  accent: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
      style={{ borderColor: `${accent}18` }}
    >
      <dt className="text-[12px] font-medium uppercase tracking-[0.12em] text-subtle shrink-0">
        {label}
      </dt>
      <dd
        className={`tabular-nums font-bold text-right truncate ${
          emphasis ? "text-base" : "text-sm"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
