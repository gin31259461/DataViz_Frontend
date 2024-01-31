'use client';

import { useUserStore } from '@/hooks/store/use-user-store';
import { trpc } from '@/server/trpc';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DatasetOutlinedIcon from '@mui/icons-material/DatasetOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { CommandModalItem } from './cmd-modal-item';
import { CommandModalContext } from './provider';

const usePageItemSelected = () => {
  const router = useRouter();
  const ControlCommandModal = useContext(CommandModalContext);

  return (path: string) => {
    router.push(path);
    ControlCommandModal.setOpen(false);
  };
};

export const NavigationGroup = () => {
  const selectedHandler = usePageItemSelected();
  return (
    <Command.Group heading="Navigation">
      <CommandModalItem
        value="home"
        shortcut="G H"
        onSelect={() => selectedHandler('/')}
      >
        <HomeOutlinedIcon />
        Home
      </CommandModalItem>
      <CommandModalItem
        value="data"
        onSelect={() => selectedHandler('/management/data')}
      >
        <DatasetOutlinedIcon />
        Data
      </CommandModalItem>
      <CommandModalItem
        value="project"
        onSelect={() => selectedHandler('/management/project')}
      >
        <ShowChartOutlinedIcon />
        Project
      </CommandModalItem>
      <CommandModalItem
        value="profile"
        onSelect={() => selectedHandler('/management/profile')}
      >
        <AccountBoxOutlinedIcon />
        Profile
      </CommandModalItem>
      <CommandModalItem
        value="settings"
        onSelect={() => selectedHandler('/management/settings')}
      >
        <SettingsOutlinedIcon />
        Settings
      </CommandModalItem>
    </Command.Group>
  );
};

export const ProjectGroup = () => {
  const ControlCommandModal = useContext(CommandModalContext);
  const selectedHandler = usePageItemSelected();

  return (
    <Command.Group heading="Project">
      <CommandModalItem
        value="search project"
        shortcut="S P"
        onSelect={() =>
          ControlCommandModal.setPages([
            ...ControlCommandModal.pages,
            'project',
          ])
        }
      >
        <SearchOutlinedIcon />
        Search Project
      </CommandModalItem>
      <CommandModalItem
        value="new project"
        shortcut="N P"
        onSelect={() => selectedHandler('/management/project')}
      >
        <AddOutlinedIcon />
        New Project
      </CommandModalItem>
    </Command.Group>
  );
};

export const SearchProjectPage = () => {
  const mid = useUserStore((state) => state.mid);
  const allProjects = trpc.project.getAllProjects.useQuery(mid);
  const ControlCommandModal = useContext(CommandModalContext);
  const router = useRouter();

  return (
    <Command.Group>
      {allProjects.data &&
        allProjects.data.map((project) => {
          return (
            <CommandModalItem
              key={project.id}
              value={project.title}
              onSelect={() => {
                ControlCommandModal.setOpen(false);
                router.push(`/management/project/${project.id}`);
              }}
            >
              {project.title}
            </CommandModalItem>
          );
        })}
    </Command.Group>
  );
};
