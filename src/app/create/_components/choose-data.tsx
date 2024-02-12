'use client';

import AutoCompleteSelect from '@/components/select/auto-complete-select';
import ObjectTable from '@/components/table/object-table';
import { BasicColumnTypeMapping, useProjectStore } from '@/hooks/store/use-project-store';
import { useUserStore } from '@/hooks/store/use-user-store';
import { api } from '@/server/trpc/client';
import { LinearProgress, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function ChooseData() {
  const mid = useUserStore((state) => state.mid);
  const allMemberData = api.data.getAllMemberData.useQuery(mid);

  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const setSelectedDataOID = useProjectStore((state) => state.setSelectedDataOID);
  const setSelectedData = useProjectStore((state) => state.setSelectedData);
  const setColumnTypesMapping = useProjectStore((state) => state.setColumnTypeMapping);
  const clearProjectStore = useProjectStore((state) => state.clear);

  const top100ContentFromDataTable = api.data.getTop100ContentFromDataTable.useQuery(selectedDataOID);
  const countFromDataTable = api.data.getCountFromDataTable.useQuery(selectedDataOID);

  useEffect(() => {
    if (top100ContentFromDataTable.data && top100ContentFromDataTable.data.length > 0) {
      const columns = Object.keys(top100ContentFromDataTable.data[0]);
      const columnTypesMapping: BasicColumnTypeMapping = {
        string: [],
        number: [],
        date: [],
      };

      columns.forEach((col) => {
        const value = top100ContentFromDataTable.data[0][col];
        if (!isNaN(Date.parse(value)) && new Date(value).getFullYear() <= new Date().getFullYear())
          columnTypesMapping['date'].push(col);
        else if (Number.parseInt(value).toString() === value) columnTypesMapping['number'].push(col);
        else columnTypesMapping['string'].push(col);
      });

      setColumnTypesMapping(columnTypesMapping);
    }
  }, [top100ContentFromDataTable, setColumnTypesMapping]);

  const handleSelectChange = (value: string) => {
    if (allMemberData.isSuccess) {
      clearProjectStore();
      setSelectedDataOID(parseInt(value.split(':')[0]));
    }
  };

  return (
    <>
      <AutoCompleteSelect
        options={
          allMemberData.data
            ?.sort((a, b) => {
              return b.id - a.id;
            })
            .map((d) => d.id.toString() + ' : ' + d.name) ?? []
        }
        initialValueIndex={allMemberData.data?.findIndex((d) => d.id === selectedDataOID) ?? 0}
        onChange={handleSelectChange}
        onClear={() => {
          setSelectedDataOID(undefined);
          setSelectedData([]);
        }}
        loading={allMemberData.isLoading}
      />
      {selectedDataOID !== -1 && top100ContentFromDataTable.isLoading && (
        <LinearProgress color="info" sx={{ top: 10 }} />
      )}
      {top100ContentFromDataTable.data && top100ContentFromDataTable.data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ padding: 2, whiteSpace: 'nowrap' }} variant="body1">
            Total rows count : <strong>{countFromDataTable.data}</strong>, showing top <strong>100</strong> rows
          </Typography>
          <div
            style={{
              height: 'calc(100vh - 60px - 200px - 60px)',
              overflowX: 'auto',
            }}
          >
            <ObjectTable headerID="selected-data-table" data={top100ContentFromDataTable.data} />
          </div>
        </div>
      )}
    </>
  );
}
