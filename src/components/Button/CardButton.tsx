import { useSplitLineStyle } from '@/hooks/useStyles';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

interface CardButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function CardButton({ title, description, icon, onClick }: CardButtonProps) {
  return (
    <Card sx={{ width: '100%', border: useSplitLineStyle() }}>
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ display: 'flex' }}>
          <div style={{ width: '80%' }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', width: '20%' }}>{icon}</div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
