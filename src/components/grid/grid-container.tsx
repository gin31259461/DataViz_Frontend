import { Grid, styled } from '@mui/material';
import { ComponentProps } from 'react';

type GridContainerProps = Omit<ComponentProps<typeof StyledGrid>, 'container'>;

export const GridContainer = (props: GridContainerProps) => {
  return (
    <StyledGrid {...props} container>
      {props.children}
    </StyledGrid>
  );
};

const StyledGrid = styled(Grid)({});
