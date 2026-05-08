import { prisma } from "@/lib/db";
import { toProjectDTO } from "@/lib/serialize";
import { PortfolioStats } from "@/components/portfolio/PortfolioStats";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";
import { ProjectGrid } from "@/components/project/ProjectGrid";

export const revalidate = 60;

export default async function HomePage() {
  const rows = await prisma.project.findMany({
    where: { funding: { gt: 0 } },
    orderBy: [{ featured: "desc" }, { funding: "desc" }],
  });
  const projects = rows.map(toProjectDTO);
  const totalFunding = projects.reduce((sum, p) => sum + p.funding, 0);

  return (
    <>
      <PortfolioStats totalFunding={totalFunding} totalProjects={projects.length} />

      <section id="projects" className="container py-10 md:py-14 scroll-mt-24">
        <ProjectGrid projects={projects} />
      </section>

      <PortfolioCTA />
    </>
  );
}
