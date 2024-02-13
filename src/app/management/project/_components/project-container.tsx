'use client';

import CardButton from '@/components/button/card-button';
import IconCardButton from '@/components/button/icon-card-button';
import { useSplitLineStyle } from '@/hooks/use-styles';
import { EditProjectRequestSchema } from '@/server/api/routers/project';
import { api } from '@/server/trpc/trpc.client';
import { convertOpacityNumberToHexString } from '@/utils/color';
import AddIcon from '@mui/icons-material/AddOutlined';
import GridViewIcon from '@mui/icons-material/GridViewOutlined';
import ListIcon from '@mui/icons-material/ListOutlined';
import TimelineIcon from '@mui/icons-material/TimelineOutlined';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  TableCell,
  TableRow,
  useTheme,
} from '@mui/material';
import { redirect, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ProjectCard from './project-card';
import ContextMenu from './project-context-menu';
import ProjectList from './project-list';

type ViewMode = 'grid' | 'list';
type SortTarget = 'name' | 'dateCreated' | 'lastViewed';

export default function ProjectContainer() {
  const theme = useTheme();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeID, setActiveID] = useState<number | null>(null);
  const [sortTarget, setSortTarget] = useState<SortTarget>('name');
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  const editProject = api.project.editProject.useMutation();
  const deleteProject = api.project.deleteProject.useMutation();
  const projects = api.project.getAllProject.useQuery();

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortTarget(event.target.value as SortTarget);
  };

  const onEditConfirm = async (input: EditProjectRequestSchema) => {
    await editProject.mutateAsync(input);
    await projects.refetch();
  };

  const onDelete = useCallback(
    async (cid: number) => {
      await deleteProject.mutateAsync(cid);
      await projects.refetch();
    },
    [deleteProject, projects]
  );

  useEffect(() => {
    if (projects.isError && projects.error.data) {
      const code = projects.error.data.code;

      if (code === 'UNAUTHORIZED') {
        redirect('/login');
      }
    }
  }, [projects.isError, projects.error]);

  return (
    <Box padding={2}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default,
          borderBottom: `${useSplitLineStyle()}`,
          paddingBottom: 2,
          gap: 2,
        }}
      >
        <Grid container gap={2}>
          <Grid container>
            <CardButton
              title="New project"
              description="Create various projects"
              icon={<AddIcon color="secondary" fontSize="large" />}
              onClick={() => setNewProjectDialogOpen(true)}
            ></CardButton>
          </Grid>

          <Dialog open={newProjectDialogOpen} onClose={() => setNewProjectDialogOpen(false)}>
            <DialogTitle>Create new project</DialogTitle>
            <DialogContent
              sx={{
                width: 400,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <CardButton
                title="New racing chart project"
                icon={<TimelineIcon color="info" />}
                description=""
                onClick={() => router.push('/create/racing-chart')}
              ></CardButton>

              <CardButton
                title="New live analysis project"
                icon={<TimelineIcon color="info" />}
                description=""
                onClick={() => router.push('/create/live-analysis')}
              ></CardButton>
            </DialogContent>
          </Dialog>
        </Grid>

        <Grid container height={50} justifyContent="flex-end" alignItems={'flex-end'}>
          <div style={{ marginRight: 10 }}>
            <FormControl variant="standard">
              <InputLabel>Sort by: </InputLabel>
              <Select sx={{ border: 'none' }} value={sortTarget} onChange={handleSortChange}>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="dateCreated">Date created</MenuItem>
                <MenuItem value="lastViewed">Last viewed</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ marginRight: 5 }}>
            <IconCardButton title="Grid view" onClick={() => setViewMode('grid')}>
              {viewMode === 'list' ? <GridViewIcon /> : <GridViewIcon color="secondary" />}
            </IconCardButton>
          </div>
          <div>
            <IconCardButton title="List view" onClick={() => setViewMode('list')}>
              {viewMode === 'grid' ? <ListIcon /> : <ListIcon color="secondary" />}
            </IconCardButton>
          </div>
        </Grid>
      </Box>

      <div>
        {viewMode === 'grid' ? (
          <Grid container spacing={2} mt={2}>
            {projects.isLoading || !projects.data
              ? new Array(12).fill(0).map((_, i) => {
                  return (
                    <Grid key={i} item xs={12} sm={6} md={4}>
                      <ProjectCard>
                        <Skeleton />
                      </ProjectCard>
                    </Grid>
                  );
                })
              : projects.data.map((project) => {
                  return (
                    <Grid key={project.id} item xs={12} sm={6} md={4}>
                      <ContextMenu project={project} onDelete={onDelete} onEditConfirm={onEditConfirm}>
                        <div onMouseDown={() => setActiveID(project.id)}>
                          <ProjectCard active={activeID === project.id ? true : false} project={project} />
                        </div>
                      </ContextMenu>
                    </Grid>
                  );
                })}
          </Grid>
        ) : (
          <ProjectList>
            {projects.data &&
              projects.data.map((project) => {
                return (
                  <TableRow
                    key={project.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: activeID === project.id ? 'none' : theme.palette.action.hover,
                      },
                      backgroundColor:
                        activeID === project.id
                          ? theme.palette.info.main + convertOpacityNumberToHexString(15)
                          : 'none',
                    }}
                  >
                    <TableCell padding="none">
                      <ContextMenu project={project} onDelete={onDelete} onEditConfirm={onEditConfirm}>
                        <div style={{ height: 50, padding: 16 }} onMouseDown={() => setActiveID(project.id)}>
                          {project.title}
                        </div>
                      </ContextMenu>
                    </TableCell>
                    <TableCell padding="none">
                      <ContextMenu project={project} onDelete={onDelete} onEditConfirm={onEditConfirm}>
                        <div style={{ height: 50, padding: 16 }} onMouseDown={() => setActiveID(project.id)}>
                          {new Date(project.lastModifiedDT).toDateString()}
                        </div>
                      </ContextMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </ProjectList>
        )}
      </div>
    </Box>
  );
}
