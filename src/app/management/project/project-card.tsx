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
        border: active
          ? '2px solid ' + theme.palette.info.main
          : theme.palette.background.paper,
      }}
    >
      <CardActionArea sx={{ height: 145 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {project.title}
          </Typography>
          <Typography
            sx={{ height: 100, textOverflow: 'ellipsis' }}
            variant="body2"
            color="text.secondary"
          >
            {project.des}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
