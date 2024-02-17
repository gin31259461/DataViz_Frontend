'use client';

import { api } from '@/server/trpc/trpc.client';
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
    <Command.Group heading="導航">
      <CommandModalItem value="首頁" shortcut="G H" onSelect={() => selectedHandler('/')}>
        <HomeOutlinedIcon />
        首頁
      </CommandModalItem>
      <CommandModalItem value="資料" onSelect={() => selectedHandler('/management/data')}>
        <DatasetOutlinedIcon />
        資料
      </CommandModalItem>
      <CommandModalItem value="專案" onSelect={() => selectedHandler('/management/project')}>
        <ShowChartOutlinedIcon />
        專案
      </CommandModalItem>
      <CommandModalItem value="個人" onSelect={() => selectedHandler('/management/profile')}>
        <AccountBoxOutlinedIcon />
        個人
      </CommandModalItem>
      <CommandModalItem value="設定" onSelect={() => selectedHandler('/management/settings')}>
        <SettingsOutlinedIcon />
        設定
      </CommandModalItem>
    </Command.Group>
  );
};

export const ProjectGroup = () => {
  const ControlCommandModal = useContext(CommandModalContext);
  const selectedHandler = usePageItemSelected();

  return (
    <Command.Group heading="專案">
      <CommandModalItem
        value="搜尋專案"
        shortcut="S P"
        onSelect={() => ControlCommandModal.setPages([...ControlCommandModal.pages, 'project'])}
      >
        <SearchOutlinedIcon />
        搜尋專案
      </CommandModalItem>
      <CommandModalItem value="新增專案" shortcut="N P" onSelect={() => selectedHandler('/management/project')}>
        <AddOutlinedIcon />
        新增專案
      </CommandModalItem>
    </Command.Group>
  );
};

export const SearchProjectPage = () => {
  const projects = api.project.getAllProject.useQuery();
  const ControlCommandModal = useContext(CommandModalContext);
  const router = useRouter();

  return (
    <Command.Group>
      {projects.data &&
        projects.data.map((project) => {
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
