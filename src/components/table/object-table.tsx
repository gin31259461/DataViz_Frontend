import { colorTokens } from '@/utils/color-tokens';
import { Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useTable } from 'react-table';

interface ObjectTableProps {
  headerID?: string;
  data: object[];
}

export default function ObjectTable({ data, headerID }: ObjectTableProps) {
  const theme = useTheme();
  const color = colorTokens(theme.palette.mode);

  const columns = useMemo(
    () =>
      Object.keys(data[0]).map((key) => ({
        Header: key,
        accessor: (row: { [key: string]: any }) => row[key],
      })),
    [data]
  );

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <Table {...getTableProps()}>
      <TableHead id={headerID}>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.getHeaderGroupProps().key}>
            {headerGroup.headers.map((column) => (
              <TableCell
                sx={{
                  whiteSpace: 'nowrap',
                  position: 'sticky',
                  color: color.greenAccent[500],
                  top: 0,
                  backgroundColor: theme.palette.background.paper,
                }}
                key={column.getHeaderProps().key}
              >
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow key={row.getRowProps().key}>
              {row.cells.map((cell) => (
                <TableCell
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                  key={cell.getCellProps().key}
                >
                  {cell.render('Cell')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
