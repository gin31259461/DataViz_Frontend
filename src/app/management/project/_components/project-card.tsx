'use client';

import { ProjectSchema } from '@/server/api/routers/project';
import { Card, CardActionArea, CardContent, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface ProjectCardProps {
  project?: ProjectSchema;
  active?: boolean;
  children?: ReactNode;
}

export default function ProjectCard({ project, active = false, children }: ProjectCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        border: active ? '2px solid ' + theme.palette.info.main : theme.palette.background.paper,
      }}
    >
      <CardActionArea sx={{ height: 145 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {project ? project.title : children}
          </Typography>
          <Typography sx={{ height: 100, textOverflow: 'ellipsis' }} variant="body2" color="text.secondary">
            {project ? project.des : children}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
