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
  const allData = trpc.dataObject.getAllMemberData.useQuery(mid);

  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const setDataOID = useProjectStore((state) => state.setSelectedDataOID);
  const setColumnTypes = useProjectStore((state) => state.setColumnTypesMapping);
  const clearProjectStore = useProjectStore((state) => state.clear);

  const previewSelectedData = trpc.dataObject.getTop100FromDataTable.useQuery(selectedDataOID);
  const dataTableCount = trpc.dataObject.getCountFromDataTable.useQuery(selectedDataOID);

  useEffect(() => {
    if (previewSelectedData.data && previewSelectedData.data.length > 0) {
      const columns = Object.keys(previewSelectedData.data[0]);
      const columnTypesMapping: BasicColumnTypesMapping = { string: [], number: [], Date: [] };

      columns.forEach((col) => {
        const value = previewSelectedData.data[0][col];
        if (!isNaN(Date.parse(value)) && new Date(value).getFullYear() <= new Date().getFullYear())
          columnTypesMapping['Date'].push(col);
        else if (Number.parseInt(value).toString() == value) columnTypesMapping['number'].push(col);
        else columnTypesMapping['string'].push(col);
      });

      setColumnTypes(columnTypesMapping);
    }
  }, [previewSelectedData, setColumnTypes]);

  const handleSelectChange = (value: string) => {
    if (allData.isSuccess) {
      clearProjectStore();
      setDataOID(Number(value.split(':')[0]));
    }
  };

  const dataTableInfo = useMemo(() => {
    return (
      <Typography sx={{ padding: 2 }} variant="h6">
        Total row : <strong>{dataTableCount.data}</strong>, only show top <strong>100</strong> row
      </Typography>
    );
  }, [dataTableCount]);

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
          allData.data
            ?.sort((a, b) => {
              return b.OID - a.OID;
            })
            .map((d, i) => d.OID.toString() + ' : ' + d.CName) ?? []
        }
        initialValueIndex={allData.data?.findIndex((d) => d.OID == selectedDataOID) ?? 0}
        onChange={handleSelectChange}
        loading={allData.isLoading}
      ></AutoCompleteSelect>
      {selectedDataOID !== -1 && previewSelectedData.isLoading && <LinearProgress color="info" sx={{ top: 10 }} />}
      {previewSelectedData.data && previewSelectedData.data.length > 0 && (
        <div>
          {dataTableInfo}
          <ObjectTable headerID="selected-data-table" data={previewSelectedData.data} />
        </div>
      )}
    </Box>
  );
}
