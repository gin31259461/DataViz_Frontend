'use client';

import { ProjectSchema } from '@/server/api/routers/project';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';

interface ProjectCardProps {
  project: ProjectSchema;
  active: boolean;
}

export default function ProjectCard({ project, active }: ProjectCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        maxWidth: 345,
        border: active
          ? '2px solid ' + theme.palette.info.main
          : theme.palette.background.paper,
      }}
    >
      <CardActionArea>
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
