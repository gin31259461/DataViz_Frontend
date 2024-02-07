import { DataSchema } from '@/server/api/routers/data';
import { ProjectSchema } from '@/server/api/routers/project';
import { create } from 'zustand';

interface CacheStoreProps {
  data: DataSchema[];
  projects: ProjectSchema[];
  setData: (d: DataSchema[]) => void;
  setProjects: (d: ProjectSchema[]) => void;
}

export const useCacheStore = create<CacheStoreProps>()((set) => ({
  data: [],
  projects: [],
  setData: (d: DataSchema[]) => set({ data: d }),
  setProjects: (d: ProjectSchema[]) => set({ projects: d }),
}));
