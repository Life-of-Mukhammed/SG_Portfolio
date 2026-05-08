import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { toProjectDTO } from "@/lib/serialize";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const row = await prisma.project.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
  });
  if (!row) notFound();
  const project = toProjectDTO(row);

  return <ProjectForm mode={{ kind: "edit", project }} />;
}
