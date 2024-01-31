import Dashboard from '@/components/dashboard';
import { ProjectSchema } from '@/server/api/routers/project';
import { authOptions } from '@/server/auth/auth';
import { prismaReader } from '@/server/db';
import { getServerSession } from 'next-auth';
import ProjectManager from './project-manager';

async function getProjects() {
  'use server';

  const session = await getServerSession(authOptions);

  if (!session) return [];

  const member = await prismaReader.member.findFirst({
    select: {
      Account: true,
    },
    where: {
      MID: parseInt(session.user.id),
    },
  });

  if (member) {
    const sqlStr = `select * from vd_project_${member.Account} order by id desc`;
    const projects: ProjectSchema[] =
      await prismaReader.$queryRaw`exec sp_executesql ${sqlStr}`;
    return projects;
  }

  return [];
}

export default async function ProjectPage() {
  return (
    <Dashboard>
      <ProjectManager getProjects={getProjects} />
    </Dashboard>
  );
}
