'use client';

import { ProjectZodSchema } from '@/server/api/routers/project';
import { tokens } from '@/utils/theme';
import { Card, CardActionArea, CardContent, Typography, useTheme } from '@mui/material';
import { z } from 'zod';

interface ProjectCardProps {
  project: z.infer<typeof ProjectZodSchema>;
  active: boolean;
}

export default function ProjectCard({ project, active }: ProjectCardProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card
      sx={{
        maxWidth: 345,
        border: active ? '2px solid ' + theme.palette.info.main : theme.palette.background.paper,
      }}
    >
      <CardActionArea>
        {/* <CardMedia component="img" height="140" image={project.image} alt={project.name} /> */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {project.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {project.des}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
