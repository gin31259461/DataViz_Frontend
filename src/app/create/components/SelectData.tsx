'use client';

import { BasicColumnTypesMapping, useProjectStore } from '@/hooks/store/useProjectStore';
import { useUserStore } from '@/hooks/store/useUserStore';
import { trpc } from '@/server/trpc';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import AutoCompleteSelect from '../../../components/Select/AutoCompleteSelect';
import ObjectTable from '../../../components/Table/ObjectTable';

export default function SelectData() {
  const mid = useUserStore((state) => state.mid);
  const allMemberData = trpc.dataObject.getAllMemberData.useQuery(mid);

  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const setSelectedDataOID = useProjectStore((state) => state.setSelectedDataOID);
  const setColumnTypesMapping = useProjectStore((state) => state.setColumnTypesMapping);
  const clearProjectStore = useProjectStore((state) => state.clear);

  const top100FromDataTable = trpc.dataObject.getTop100FromDataTable.useQuery(selectedDataOID);
  const rowsCountFromDataTable = trpc.dataObject.getRowsCountFromDataTable.useQuery(selectedDataOID);

  useEffect(() => {
    if (top100FromDataTable.data && top100FromDataTable.data.length > 0) {
      const columns = Object.keys(top100FromDataTable.data[0]);
      const columnTypesMapping: BasicColumnTypesMapping = { string: [], number: [], Date: [] };

      columns.forEach((col) => {
        const value = top100FromDataTable.data[0][col];
        if (!isNaN(Date.parse(value)) && new Date(value).getFullYear() <= new Date().getFullYear())
          columnTypesMapping['Date'].push(col);
        else if (Number.parseInt(value).toString() == value) columnTypesMapping['number'].push(col);
        else columnTypesMapping['string'].push(col);
      });

      setColumnTypesMapping(columnTypesMapping);
    }
  }, [top100FromDataTable, setColumnTypesMapping]);

  const handleSelectChange = (value: string) => {
    if (allMemberData.isSuccess) {
      clearProjectStore();
      setSelectedDataOID(Number(value.split(':')[0]));
    }
  };

  const dataTableInfo = useMemo(() => {
    return (
      <Typography sx={{ padding: 2 }} variant="h6">
        Total row : <strong>{rowsCountFromDataTable.data}</strong>, only show top <strong>100</strong> row
      </Typography>
    );
  }, [rowsCountFromDataTable]);

  return (
    <Box
      sx={{
        overflowY: 'auto',
        padding: 2,
        width: '100%',
        position: 'relative',
      }}
    >
      <AutoCompleteSelect
        options={
          allMemberData.data
            ?.sort((a, b) => {
              return b.id - a.id;
            })
            .map((d, i) => d.id.toString() + ' : ' + d.name) ?? []
        }
        initialValueIndex={allMemberData.data?.findIndex((d) => d.id == selectedDataOID) ?? 0}
        onChange={handleSelectChange}
        loading={allMemberData.isLoading}
      ></AutoCompleteSelect>
      {selectedDataOID !== -1 && top100FromDataTable.isLoading && <LinearProgress color="info" sx={{ top: 10 }} />}
      {top100FromDataTable.data && top100FromDataTable.data.length > 0 && (
        <div>
          {dataTableInfo}
          <ObjectTable headerID="selected-data-table" data={top100FromDataTable.data} />
        </div>
      )}
    </Box>
  );
}
