import { Divider, Grid, styled } from '@mui/material';

export const GridContainerDivider = () => {
  return (
    <Grid container>
      <CustomDivider />
    </Grid>
  );
};

export const CustomDivider = styled(Divider)({
  textAlign: 'center',
  width: '100%',
});
