import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

async function ensureAdmin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return null;
  if (email !== adminEmail || password !== adminPassword) return null;

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const created = await prisma.user.create({
    data: { email: adminEmail, passwordHash, role: "ADMIN" },
  });
  return created;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  let user = await prisma.user.findUnique({ where: { email } });

  // Bootstrap: if no user yet, auto-create from ADMIN_EMAIL/ADMIN_PASSWORD env
  if (!user) {
    user = await ensureAdmin(email, password);
  }

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createSession({
    sub: user.id,
    email: user.email,
    role: user.role as "ADMIN" | "USER",
  });

  return NextResponse.json({ ok: true });
}
