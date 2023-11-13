import Loader from '@/components/Loading/Loader';
import { type InfoProjectProps } from '@/types/InfoProject';
import { lazy, Suspense } from 'react';
import ProjectManager from './components/ProjectManager';

const Dashboard = lazy(() => import('@/components/Dashboard'));

export default function InfographicPage() {
  const projects: InfoProjectProps[] = [
    {
      id: '0',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '1',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '2',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '3',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '4',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '5',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '6',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '7',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '8',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '9',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '10',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '11',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '12',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '13',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '14',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '15',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '16',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '17',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '18',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '19',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
    {
      id: '20',
      name: 'name',
      description: 'description',
      lastModified: 'latest',
    },
  ];
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Dashboard>
          <div style={{ width: '100%' }}>
            <Suspense fallback={<Loader />}>
              <ProjectManager projects={projects} />
            </Suspense>
          </div>
        </Dashboard>
      </Suspense>
    </div>
  );
}
