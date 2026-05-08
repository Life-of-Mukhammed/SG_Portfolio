"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Save, Trash2 } from "lucide-react";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageDropzone } from "./ImageDropzone";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";

const STATUS = ["MVP", "GROWTH", "SCALE"] as const;
const CATEGORIES = [
  "Edtech",
  "Fintech",
  "AI",
  "Ecommerce",
  "MedTech",
  "Service",
  "Social",
  "EdTech",
  "FinTech",
  "E-commerce",
  "RetailTech",
  "PropTech",
  "TravelTech",
  "HR Tech",
  "SaaS",
  "AgriTech",
  "CleanTech",
  "GameDev",
  "AdTech",
  "LogiTech",
  "GovTech",
  "Marketplace",
  "Other",
] as const;

const COMMITMENTS = ["full-time", "part-time"] as const;

type Mode = { kind: "create" } | { kind: "edit"; project: Project };

export function ProjectForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const qc = useQueryClient();

  const initial: Partial<Project> =
    mode.kind === "edit"
      ? mode.project
      : {
          name: "",
          slug: "",
          tagline: "",
          description: "",
          logoUrl: null,
          coverUrl: null,
          category: "AI",
          tags: [],
          status: "MVP",
          funding: 0,
          websiteUrl: null,
          linkedinUrl: null,
          screenshots: [],
          techStack: [],
          founderName: "",
          founderAvatar: null,
          usersCount: 0,
          revenue: 0,
          growthRate: 0,
          featured: false,
          accentColor: "#6E56CF",
          founderPhone: null,
          founderEmail: null,
          founderTelegram: null,
          region: null,
          teamSize: null,
          commitment: null,
          pitchDeckUrl: null,
          resumeUrl: null,
        };

  const [form, setForm] = React.useState<Partial<Project>>(initial);
  const [tagsRaw, setTagsRaw] = React.useState<string>((initial.tags ?? []).join(", "));
  const [techRaw, setTechRaw] = React.useState<string>((initial.techStack ?? []).join(", "));
  const [skillsRaw, setSkillsRaw] = React.useState<string>(
    (initial.founderSkills ?? []).join(", "),
  );
  const [error, setError] = React.useState<string | null>(null);

  const update = <K extends keyof Project>(k: K, v: Project[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = useMutation({
    mutationFn: async () => {
      const payload: Partial<Project> = {
        ...form,
        tags: tagsRaw.split(",").map((s) => s.trim()).filter(Boolean),
        techStack: techRaw.split(",").map((s) => s.trim()).filter(Boolean),
        founderSkills: skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
      };
      // Empty strings → null for optional fields
      const stringFields: Array<keyof Project> = [
        "websiteUrl",
        "linkedinUrl",
        "logoUrl",
        "coverUrl",
        "founderAvatar",
        "founderPhone",
        "founderEmail",
        "founderTelegram",
        "region",
        "commitment",
        "pitchDeckUrl",
        "resumeUrl",
      ];
      stringFields.forEach((k) => {
        if (payload[k] === "") (payload as Record<string, unknown>)[k] = null;
      });

      if (mode.kind === "create") {
        return api.createProject(payload);
      }
      return api.updateProject(mode.project.id, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      router.push("/admin/projects");
      router.refresh();
    },
    onError: (e) => setError((e as Error).message || "Save failed"),
  });

  const remove = useMutation({
    mutationFn: () =>
      mode.kind === "edit"
        ? api.deleteProject(mode.project.id)
        : Promise.resolve({ ok: true } as const),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      router.push("/admin/projects");
      router.refresh();
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    save.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">
            {mode.kind === "create" ? "Yangi loyiha" : `Edit · ${mode.project.name}`}
          </h1>
          <p className="text-sm text-muted mt-1">
            {mode.kind === "create"
              ? "Portfolio'ga yangi rezident qo'shing."
              : "Loyiha ma'lumotlari, rasmlar va asoschi haqida."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {mode.kind === "edit" && (
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                if (confirm(`Delete ${mode.project.name}? This cannot be undone.`)) remove.mutate();
              }}
              loading={remove.isPending}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <Button type="submit" loading={save.isPending}>
            <Save className="h-4 w-4" />
            Saqlash
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Asosiy ma'lumotlar">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Nom *</Label>
                <Input
                  value={form.name ?? ""}
                  onChange={(e) => update("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug ?? ""}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder="nomdan avto"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Tagline</Label>
                <Input
                  value={form.tagline ?? ""}
                  onChange={(e) => update("tagline", e.target.value)}
                  placeholder="Qisqa, bir qatorli ifoda (ixtiyoriy)"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Tavsif *</Label>
                <Textarea
                  value={form.description ?? ""}
                  onChange={(e) => update("description", e.target.value)}
                  rows={6}
                  required
                />
              </div>
              <div>
                <Label>Soha</Label>
                <Select
                  value={form.category ?? "AI"}
                  onChange={(e) => update("category", e.target.value)}
                >
                  {Array.from(new Set(CATEGORIES)).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Bosqich</Label>
                <Select
                  value={form.status ?? "MVP"}
                  onChange={(e) => update("status", e.target.value as Project["status"])}
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Hudud</Label>
                <Input
                  value={form.region ?? ""}
                  onChange={(e) => update("region", e.target.value)}
                  placeholder="Toshkent shahri"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Tags (vergul bilan ajrating)</Label>
                <Input
                  value={tagsRaw}
                  onChange={(e) => setTagsRaw(e.target.value)}
                  placeholder="masalan: AI, Agents, Multilingual"
                />
              </div>
            </div>
          </Section>

          <Section title="Investitsiya & jamoa">
            <div className="grid sm:grid-cols-3 gap-4">
              <NumberField
                label="Investitsiya ($)"
                value={form.funding}
                onChange={(v) => update("funding", v)}
              />
              <NumberField
                label="Jamoa hajmi"
                value={form.teamSize ?? 0}
                onChange={(v) => update("teamSize", v)}
              />
              <div>
                <Label>Faollik</Label>
                <Select
                  value={form.commitment ?? ""}
                  onChange={(e) => update("commitment", e.target.value || null)}
                >
                  <option value="">—</option>
                  {COMMITMENTS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Section>

          <Section title="Founder ma'lumotlari">
            <div className="grid sm:grid-cols-[140px,1fr] gap-5 items-start">
              <div>
                <Label>Founder rasmi</Label>
                <ImageDropzone
                  value={form.founderAvatar ?? null}
                  onChange={(v) => update("founderAvatar", (v as string) ?? null)}
                  hint="Portret rasm — kvadrat yaxshi"
                />
              </div>
              <div className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Founder ismi *</Label>
                    <Input
                      value={form.founderName ?? ""}
                      onChange={(e) => update("founderName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Lavozim / Roli</Label>
                    <Input
                      value={form.founderRole ?? ""}
                      onChange={(e) => update("founderRole", e.target.value)}
                      placeholder="CEO & Founder"
                    />
                  </div>
                </div>
                <div>
                  <Label>Tajriba va o'zi haqida</Label>
                  <Textarea
                    value={form.founderBio ?? ""}
                    onChange={(e) => update("founderBio", e.target.value)}
                    rows={5}
                    placeholder="Founder'ning bio'si: tajribasi, oldingi loyihalari, ta'limi..."
                  />
                </div>
                <div>
                  <Label>Skills (vergul bilan ajrating)</Label>
                  <Input
                    value={skillsRaw}
                    onChange={(e) => setSkillsRaw(e.target.value)}
                    placeholder="Product Strategy, Growth Marketing, AI/ML"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid sm:grid-cols-3 gap-4 pt-5 border-t border-border">
              <div>
                <Label>Telefon</Label>
                <Input
                  value={form.founderPhone ?? ""}
                  onChange={(e) => update("founderPhone", e.target.value)}
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.founderEmail ?? ""}
                  onChange={(e) => update("founderEmail", e.target.value)}
                  placeholder="founder@example.com"
                />
              </div>
              <div>
                <Label>Telegram</Label>
                <Input
                  value={form.founderTelegram ?? ""}
                  onChange={(e) => update("founderTelegram", e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>
          </Section>

          <Section title="Web va hujjatlar">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Sayt</Label>
                <Input
                  value={form.websiteUrl ?? ""}
                  onChange={(e) => update("websiteUrl", e.target.value)}
                  placeholder="https://"
                />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input
                  value={form.linkedinUrl ?? ""}
                  onChange={(e) => update("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/company/…"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Tech stack (vergul bilan ajrating)</Label>
                <Input
                  value={techRaw}
                  onChange={(e) => setTechRaw(e.target.value)}
                  placeholder="Next.js, Postgres, Redis"
                />
              </div>
            </div>
          </Section>

          <Section title="Screenshots">
            <ImageDropzone
              multiple
              value={form.screenshots ?? []}
              onChange={(v) => update("screenshots", (v as string[]) ?? [])}
              hint="Mahsulot screenshot'lari — loyiha sahifasida ko'rsatiladi"
            />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Logo">
            <ImageDropzone
              value={form.logoUrl ?? null}
              onChange={(v) => update("logoUrl", (v as string) ?? null)}
              hint="Kvadrat logo, transparent PNG yaxshi natija beradi"
            />
          </Section>

          <Section title="Cover image">
            <ImageDropzone
              value={form.coverUrl ?? null}
              onChange={(v) => update("coverUrl", (v as string) ?? null)}
              hint="Keng hero rasm (16:9) — ixtiyoriy"
            />
          </Section>

          <Section title="Vizual sozlamalar">
            <div className="space-y-4">
              <div>
                <Label>Accent rang</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.accentColor ?? "#6E56CF"}
                    onChange={(e) => update("accentColor", e.target.value)}
                    className="h-10 w-12 rounded-lg border border-border bg-transparent cursor-pointer"
                  />
                  <Input
                    value={form.accentColor ?? "#6E56CF"}
                    onChange={(e) => update("accentColor", e.target.value)}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-elevated/40 p-3">
                <input
                  id="featured"
                  type="checkbox"
                  checked={!!form.featured}
                  onChange={(e) => update("featured", e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Bosh sahifada birinchi qilib ko'rsatish
                </label>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="font-display text-base font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number | null | undefined;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type="number"
        value={value ?? 0}
        step={step}
        onChange={(e) => onChange(Number(e.target.value || 0))}
      />
    </div>
  );
}
