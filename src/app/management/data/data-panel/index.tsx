'use client';

import LinearProgressPending from '@/components/loading/linear-progress-pending';
import { useUserStore } from '@/hooks/store/use-user-store';
import { trpc } from '@/server/trpc';
import { colorTokens } from '@/utils/color-tokens';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  useTheme,
} from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useCallback, useMemo, useState } from 'react';
import CardButton from '../../../../components/button/card-button';

const ObjectTable = dynamic(
  () => import('../../../../components/table/object-table'),
);
const ShowDataDialog = dynamic(() => import('./show-data-modal'));
const DataFormDialog = dynamic(() => import('./data-form-dialog'));
const MessageSnackbar = dynamic(
  () => import('../../../../components/message-snackbar'),
);
const ConfirmDeleteButton = dynamic(
  () => import('../../../../components/button/confirm-delete-button'),
);

interface DataSchema {
  id: number;
  name: string | null;
  description: string | null;
  since: string | null;
  lastModified: string | null;
  frequency: number;
  md5: {
    type: 'Buffer';
    data: number[];
  };
}

interface DataPanelProps {
  flaskServer: string;
}

export const DataPanel: React.FC<DataPanelProps> = ({ flaskServer }) => {
  /** constants  */
  const mid = useUserStore((state) => state.mid);
  const counts = 10;
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);

  /** data state */
  const [selectDataOID, setSelectDataOID] = useState<number | undefined>(
    undefined,
  );
  const [deleteDataOID, setDeleteDataOID] = useState<number[]>([]);

  /** page state */
  const [page, setPage] = useState(0);

  /** order state */
  const [orderBy, setOrderBy] = useState('id');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');

  /** dialog state */
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewDataDialog, setOpenNewDataDialog] = useState(false);

  /** post state */
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const start = page * counts;
  const memberDataCount = trpc.dataObject.getMemberDataCount.useQuery(mid);
  const someDataObject = trpc.dataObject.getSomeMemberData.useQuery({
    order: orderDirection,
    start: start + 1,
    counts: counts,
    mid: mid,
  });
  const dataTable =
    trpc.dataObject.getTop100FromDataTable.useQuery(selectDataOID);
  const currentObjectId = trpc.dataObject.getCurrentObjectId.useQuery();
  const postData = trpc.dataObject.postData.useMutation();
  const deleteData = trpc.dataObject.deleteData.useMutation({
    onError: (error) => {
      setOpenNewDataDialog(false);
      setMessage(error.message);
      setSubmitError(true);
    },
  });

  const handleSort = useCallback(
    (property: keyof DataSchema) => {
      setOrderDirection((prev) => {
        return property !== orderBy ? prev : prev === 'asc' ? 'desc' : 'asc';
      });
      setOrderBy(property);
    },
    [orderBy],
  );

  const submitForm = async (formData: FormData) => {
    try {
      await postData.mutateAsync({
        mid: mid,
        name: formData.get('name')?.toString() ?? '',
        des: formData.get('des')?.toString() ?? '',
      });

      await currentObjectId.refetch();

      if (currentObjectId.data) {
        formData.append(
          'dataId',
          (Number(currentObjectId.data) + 1).toString(),
        );
        await fetch(`${flaskServer}/api/file_upload`, {
          method: 'POST',
          body: formData,
        }).then(async (res) => {
          const data: { message: string } = await res.json();
          setMessage(data.message);
          setSubmitSuccess(true);
        });
      }
    } catch (error) {
      setSubmitError(true);
      setMessage('upload error, please try again later');
    }

    await someDataObject.refetch();
    await memberDataCount.refetch();
  };

  const handleDelete = async (deleteIDs: number[]) => {
    try {
      await deleteData.mutateAsync({
        mid: mid,
        oidS: deleteIDs,
      });
      setDeleteSuccess(true);
      setMessage('delete data done');
      setSelectDataOID(undefined);
      setDeleteDataOID([]);
    } catch (err) {}

    await someDataObject.refetch();
    await memberDataCount.refetch();
  };

  const DataTable = useMemo(() => {
    if (dataTable.data)
      return <ObjectTable data={dataTable.data}></ObjectTable>;
    return null;
  }, [dataTable]);

  return (
    <Grid>
      <Grid container padding={2}>
        <CardButton
          title="New data"
          description="Add new dataset into your space"
          icon={<AddIcon />}
          onClick={() => setOpenNewDataDialog(true)}
        ></CardButton>
        <Grid container marginTop={2} height={2}>
          <Box sx={{ width: '100%' }}>
            <LinearProgressPending
              isPending={someDataObject.isFetching || someDataObject.isLoading}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container padding={2}>
        <Table>
          <TableHead
            sx={{
              position: 'sticky',
              top: 60,
              zIndex: 5,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <TableRow
              sx={{
                color: colors.greenAccent[500],
              }}
            >
              <TableCell align="left" sx={{ color: 'inherit' }}>
                <div style={{ display: 'flex' }}>
                  ID
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderDirection}
                    onClick={() => handleSort('id')}
                  ></TableSortLabel>
                </div>
              </TableCell>
              <TableCell sx={{ color: 'inherit' }}>
                <div style={{ display: 'flex' }}>
                  Name
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderDirection}
                    onClick={() => handleSort('name')}
                  ></TableSortLabel>
                </div>
              </TableCell>
              <TableCell sx={{ color: 'inherit' }}>
                <div style={{ display: 'flex' }}>
                  Last Updated
                  <TableSortLabel
                    active={orderBy === 'lastModified'}
                    direction={orderDirection}
                    onClick={() => handleSort('lastModified')}
                  ></TableSortLabel>
                </div>
              </TableCell>
              <TableCell align="right" sx={{ color: 'inherit' }}>
                {deleteDataOID.length > 0 && (
                  <ConfirmDeleteButton
                    onConfirm={handleDelete}
                    deleteIDs={deleteDataOID}
                  ></ConfirmDeleteButton>
                )}
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {someDataObject.data?.map((dataSet) => (
              <TableRow
                key={dataSet.id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell>{dataSet.id}</TableCell>
                <TableCell>{dataSet.name}</TableCell>
                <TableCell>{dataSet.lastModified}</TableCell>
                <TableCell align="right">
                  <Checkbox
                    checked={
                      deleteDataOID.findIndex((value) => value == dataSet.id) >=
                      0
                    }
                    color="info"
                    onChange={(e, checked) => {
                      if (checked) {
                        setDeleteDataOID([...deleteDataOID, dataSet.id]);
                      } else {
                        setDeleteDataOID(
                          deleteDataOID.filter(
                            (v, i) =>
                              i !=
                              deleteDataOID.findIndex(
                                (value) => value == dataSet.id,
                              ),
                          ),
                        );
                      }
                    }}
                  ></Checkbox>
                  <Tooltip title={'Edit data'}>
                    <IconButton onClick={() => {}}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={'View data'}>
                    <IconButton
                      onClick={() => {
                        setSelectDataOID(dataSet.id);
                        setOpenDialog(true);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                onPageChange={(
                  event: React.MouseEvent<HTMLButtonElement> | null,
                  page: number,
                ) => {
                  setPage(page);
                }}
                rowsPerPageOptions={[]}
                count={memberDataCount.data ?? 0}
                rowsPerPage={counts}
                page={page}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Grid>

      <ShowDataDialog
        title={someDataObject.data?.find((d) => d.id === selectDataOID)?.name}
        description={
          someDataObject.data?.find((d) => d.id === selectDataOID)?.description
        }
        dataInfo={'Preview top 100 rows'}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        {dataTable.isLoading ? (
          <LinearProgress color="info" sx={{ marginTop: 2 }} />
        ) : (
          DataTable
        )}
      </ShowDataDialog>

      <DataFormDialog
        open={openNewDataDialog}
        onClose={() => {
          setOpenNewDataDialog(false);
        }}
        onSubmit={submitForm}
      />

      <MessageSnackbar
        open={submitSuccess}
        onClose={() => setSubmitSuccess(false)}
        message={message}
        status="success"
      />
      <MessageSnackbar
        open={submitError}
        onClose={() => setSubmitError(false)}
        message={message}
        status="error"
      />
      <MessageSnackbar
        open={deleteSuccess}
        onClose={() => setDeleteSuccess(false)}
        message={message}
        status="info"
      />
    </Grid>
  );
};
