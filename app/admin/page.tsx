import { prisma } from "@/lib/db";
import { toProjectDTO } from "@/lib/serialize";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const rows = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  const projects = rows.map(toProjectDTO);

  return <AdminDashboard projects={projects} />;
}
