import Dashboard from '@/components/Dashboard';
import { ProjectSchema } from '@/server/api/routers/project';
import { authOptions } from '@/server/auth/auth';
import { prismaReader } from '@/server/db';
import { Container } from '@mui/material';
import { getServerSession } from 'next-auth';
import ProjectManager from './components/ProjectManager';

async function getProject(mid: number) {
  const member = await prismaReader.member.findFirst({
    select: {
      Account: true,
    },
    where: {
      MID: mid,
    },
  });

  if (member) {
    const sqlStr = `select * from vd_project_${member.Account} order by id desc`;
    const data: ProjectSchema[] =
      await prismaReader.$queryRaw`exec sp_executesql ${sqlStr}`;
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
