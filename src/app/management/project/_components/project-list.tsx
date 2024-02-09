import { styled, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';

interface ProjectListProps {
  children: React.ReactNode;
}

export default function ProjectList({ children }: ProjectListProps) {
  const theme = useTheme();

  return (
    <Table sx={{ position: 'relative' }}>
      <TableHead>
        <TableRow>
          <CustomTableCell
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            Name
          </CustomTableCell>
          <CustomTableCell
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            Last viewed
          </CustomTableCell>
        </TableRow>
      </TableHead>
      <TableBody>{children}</TableBody>
    </Table>
  );
}

const CustomTableCell = styled(TableCell)({});
