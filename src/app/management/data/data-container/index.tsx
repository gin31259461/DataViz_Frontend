'use client';

import { DataSchema } from '@/server/api/routers/data';
import { api } from '@/server/trpc/trpc.client';
import { colorTokens } from '@/utils/color-tokens';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Checkbox,
  Grid,
  IconButton,
  LinearProgress,
  Skeleton,
  styled,
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
import { redirect } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CardButton from '../../../../components/button/card-button';
import { uploadFile } from '../action';
import ShowDataDialog from './show-data-dialog';

const ObjectTable = dynamic(() => import('@/components/table/object-table'));
const DataFormDialog = dynamic(() => import('./data-form-dialog'));
const MessageSnackbar = dynamic(() => import('@/components/snackbar/message-snackbar'));
const ConfirmDeleteButton = dynamic(() => import('@/components/button/confirm-delete-button'));

const counts = 10;

export const DataContainer = () => {
  /** constants  */
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);

  const [selectDataOID, setSelectDataOID] = useState<number | undefined>(undefined);
  const [deleteDataOID, setDeleteDataOID] = useState<number[]>([]);

  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('id');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewDataDialog, setOpenNewDataDialog] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const start = page * counts;

  const memberDataCount = api.data.getMemberDataCount.useQuery();
  const manyMemberData = api.data.getManyMemberData.useQuery({
    order: orderDirection,
    start: start + 1,
    counts: counts,
  });
  const dataTable = api.data.getTop100ContentFromDataTable.useQuery(selectDataOID);
  const postData = api.data.postData.useMutation();
  const deleteData = api.data.deleteData.useMutation({
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
    [orderBy]
  );

  const submitForm = async (formData: FormData) => {
    try {
      const postDataRes = await postData.mutateAsync({
        name: formData.get('name')?.toString() ?? '',
        des: formData.get('des')?.toString() ?? '',
      });

      if (postDataRes) {
        formData.append('dataId', postDataRes.dataId.toString());
        const result = await uploadFile(formData);
        setMessage(result.message);
        setSubmitSuccess(true);
      }
    } catch (error) {
      setSubmitError(true);
      setMessage('upload error, please try again later');
    }

    await manyMemberData.refetch();
    await memberDataCount.refetch();
  };

  const handleDelete = async (deleteIDs: number[]) => {
    await deleteData
      .mutateAsync({
        oidS: deleteIDs,
      })
      .then(async (res) => {
        setDeleteSuccess(true);
        setSelectDataOID(undefined);
        setDeleteDataOID([]);
        setMessage(res.message);
      });

    await manyMemberData.refetch();
    await memberDataCount.refetch();
  };

  const DataTable = useMemo(() => {
    if (dataTable.data) return <ObjectTable data={dataTable.data}></ObjectTable>;
    return null;
  }, [dataTable]);

  useEffect(() => {
    if (manyMemberData.isError && manyMemberData.error.data) {
      const code = manyMemberData.error.data.code;

      if (code === 'UNAUTHORIZED') {
        redirect('/login');
      }
    }
  }, [manyMemberData.isError, manyMemberData.error]);

  return (
    <Grid>
      <Grid container padding={2}>
        <CardButton title="新增資料" icon={<AddIcon />} onClick={() => setOpenNewDataDialog(true)}></CardButton>
      </Grid>

      <Grid container padding={2} sx={{ overflow: 'auto' }}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <TableRow
              sx={{
                color: colors.greenAccent[500],
              }}
            >
              <CustomTableCell align="left" sx={{ color: 'inherit', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex' }}>
                  ID
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderDirection}
                    onClick={() => handleSort('id')}
                  ></TableSortLabel>
                </div>
              </CustomTableCell>
              <CustomTableCell sx={{ color: 'inherit', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex' }}>
                  名稱
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderDirection}
                    onClick={() => handleSort('name')}
                  ></TableSortLabel>
                </div>
              </CustomTableCell>
              <CustomTableCell sx={{ color: 'inherit', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex' }}>
                  上次更新
                  <TableSortLabel
                    active={orderBy === 'lastModified'}
                    direction={orderDirection}
                    onClick={() => handleSort('lastModified')}
                  ></TableSortLabel>
                </div>
              </CustomTableCell>
              <CustomTableCell align="right" sx={{ color: 'inherit', whiteSpace: 'nowrap' }}>
                {deleteDataOID.length > 0 && (
                  <ConfirmDeleteButton onConfirm={handleDelete} deleteIDs={deleteDataOID}></ConfirmDeleteButton>
                )}
                操作
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manyMemberData.isLoading || !manyMemberData.data
              ? new Array(counts).fill(0).map((_, i) => {
                  return (
                    <TableRow key={i}>
                      <CustomTableCell>
                        <Skeleton />
                      </CustomTableCell>
                      <CustomTableCell>
                        <Skeleton />
                      </CustomTableCell>
                      <CustomTableCell>
                        <Skeleton />
                      </CustomTableCell>
                      <CustomTableCell>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
                          <Skeleton width={'40%'} />
                        </div>
                      </CustomTableCell>
                    </TableRow>
                  );
                })
              : manyMemberData.data.map((dataSet) => (
                  <TableRow
                    key={dataSet.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <CustomTableCell sx={{ whiteSpace: 'nowrap' }}>{dataSet.id}</CustomTableCell>
                    <CustomTableCell sx={{ whiteSpace: 'nowrap' }}>{dataSet.name}</CustomTableCell>
                    <CustomTableCell sx={{ whiteSpace: 'nowrap' }}>{dataSet.lastModified}</CustomTableCell>
                    <CustomTableCell sx={{ whiteSpace: 'nowrap' }} align="right">
                      <Checkbox
                        checked={deleteDataOID.findIndex((value) => value === dataSet.id) >= 0}
                        color="info"
                        onChange={(e, checked) => {
                          if (checked) {
                            setDeleteDataOID([...deleteDataOID, dataSet.id]);
                          } else {
                            setDeleteDataOID(
                              deleteDataOID.filter(
                                (v, i) => i !== deleteDataOID.findIndex((value) => value === dataSet.id)
                              )
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
                    </CustomTableCell>
                  </TableRow>
                ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                onPageChange={(event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
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
        title={manyMemberData.data?.find((d) => d.id === selectDataOID)?.name}
        description={manyMemberData.data?.find((d) => d.id === selectDataOID)?.description}
        dataInfo={'預覽前 100 筆資料'}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        {dataTable.isLoading ? <LinearProgress color="info" sx={{ marginTop: 2 }} /> : DataTable}
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
      <MessageSnackbar open={submitError} onClose={() => setSubmitError(false)} message={message} status="error" />
      <MessageSnackbar open={deleteSuccess} onClose={() => setDeleteSuccess(false)} message={message} status="info" />
    </Grid>
  );
};

const CustomTableCell = styled(TableCell)({
  height: 60,
  padding: 4,
});
