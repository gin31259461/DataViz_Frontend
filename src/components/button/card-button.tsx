import { useSplitLineStyle } from '@/hooks/use-styles';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';

interface CardButtonProps extends ComponentProps<typeof CardActionArea> {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export default function CardButton({ title, description, icon, onClick, sx }: CardButtonProps) {
  return (
    <Card sx={{ width: '100%', border: useSplitLineStyle(), ...sx }}>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
              width: '20%',
            }}
          >
            {icon}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
