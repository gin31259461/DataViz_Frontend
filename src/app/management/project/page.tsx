import Dashboard from '@/components/Dashboard';
import { authOptions } from '@/server/auth/auth';
import { prisma } from '@/server/db';
import { ProjectProps } from '@/types/Project';
import { Container } from '@mui/material';
import { getServerSession } from 'next-auth';
import ProjectManager from './components/ProjectManager';

async function getProject(mid: number) {
  const member = await prisma.member.findFirst({
    select: {
      Account: true,
    },
    where: {
      MID: mid,
    },
  });

  if (member) {
    const sqlStr = `select * from vd_project_${member.Account}`;
    const data: ProjectProps[] = await prisma.$queryRaw`exec sp_executesql ${sqlStr}`;
    return data;
  }

  return [];
}

export default async function ProjectPage() {
  const session = await getServerSession(authOptions);
  const projects = await getProject(session ? parseInt(session.user.id) : 0);

  return (
    <Dashboard>
      <Container>
        <ProjectManager projects={projects} />
      </Container>
    </Dashboard>
  );
}
