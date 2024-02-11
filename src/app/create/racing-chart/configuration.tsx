import { RacingBarChartMapping } from '@/components/chart-engine/racing-bar-chart-engine';
import { DataArgsProps, useProjectStore } from '@/hooks/store/use-project-store';
import { trpc } from '@/server/trpc';
import AbcIcon from '@mui/icons-material/Abc';
import DateRangeIcon from '@mui/icons-material/DateRange';
import NumbersIcon from '@mui/icons-material/Numbers';
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

interface CustomFromSelectProps {
  label: string;
  items: string[] | undefined;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (label: string, value: string) => void;
}

const CustomSelect = (props: CustomFromSelectProps) => {
  const [value, setValue] = useState<string>(
    props.defaultValue
      ? props.items?.findIndex((value) => value === props.defaultValue).toString() ?? ''
      : props.items && props.items.length > 0
        ? '0'
        : ''
  );

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value.toString());
    if (props.onChange && props.items) props.onChange(props.label, props.items[parseInt(event.target.value)]);
  };

  return (
    <FormControl fullWidth required={props.required ?? false} error={props.error ?? false} color={'info'}>
      <InputLabel id={`select-label-${props.label}`}>{props.label}</InputLabel>
      <Select
        labelId={`select-label-${props.label}`}
        id={`select-${props.label}`}
        value={value}
        label={props.label}
        onChange={handleChange}
        placeholder={props.items ? undefined : 'No columns in selected data'}
        disabled={props.disabled}
      >
        {props.items &&
          props.items.map((v, i) => {
            return (
              <MenuItem value={i} key={i}>
                {v}
              </MenuItem>
            );
          })}
      </Select>
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  );
};

export default function Configuration() {
  const theme = useTheme();
  const columnTypeMapping = useProjectStore((state) => state.columnTypeMapping);
  const dataArgs = useProjectStore((state) => state.dataArgs as DataArgsProps<RacingBarChartMapping>);
  const setDataArgs = useProjectStore((state) => state.setDataArgs);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const title = useProjectStore((state) => state.title);
  const des = useProjectStore((state) => state.des);
  const setTitle = useProjectStore((state) => state.setTitle);
  const setDes = useProjectStore((state) => state.setDes);
  const setChartType = useProjectStore((state) => state.setChartType);

  const dataTableCount = trpc.data.getCountFromDataTable.useQuery(selectedDataOID);
  const firstMemberData = trpc.data.getFirstMemberData.useQuery(selectedDataOID);

  useEffect(() => {
    if (!dataArgs) {
      setDataArgs({
        mapping: {
          date: columnTypeMapping?.date[0] ?? '',
          name: columnTypeMapping?.string[0] ?? '',
          value: columnTypeMapping?.number[0] ?? '',
          category: columnTypeMapping?.string[0] ?? '',
        },
      });
    }
  }, [dataArgs, columnTypeMapping, setDataArgs]);

  useEffect(() => {
    setChartType('racing-bar-chart');
  }, [setChartType]);

  const onChange = useCallback(
    (label: string, value: string) => {
      const newMapping = { ...dataArgs };
      if (newMapping.mapping) {
        newMapping.mapping[label] = value;
        setDataArgs(newMapping as DataArgsProps<RacingBarChartMapping>);
      }
    },
    [dataArgs, setDataArgs]
  );

  return (
    <Grid container gap={3}>
      <Grid container>
        <Typography variant="h5">Data information</Typography>
      </Grid>
      <Grid container gap={2}>
        <Grid container>
          <Typography variant="body1">
            Id: <span style={{ color: theme.palette.info.light }}>{selectedDataOID}</span>
          </Typography>
        </Grid>
        <Grid container>
          <Typography variant="body1">
            Name:{' '}
            <span style={{ color: theme.palette.info.light }}>{firstMemberData.data && firstMemberData.data.name}</span>{' '}
          </Typography>
        </Grid>
        <Grid container>
          <Typography variant="body1">
            Rows: <span style={{ color: theme.palette.info.light }}>{dataTableCount.data && dataTableCount.data}</span>
          </Typography>
        </Grid>
      </Grid>
      <Grid container gap={3}>
        <Typography variant="h5">Project setting</Typography>
        <Grid container>
          <TextField label="Name" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
        </Grid>
        <Grid container>
          <TextField label="Description" fullWidth multiline value={des} onChange={(e) => setDes(e.target.value)} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="h5">Type</Typography>
        </Grid>
        <Grid item xs={6}>
          <CustomSelect label="type" items={['racing chart']} disabled></CustomSelect>
        </Grid>
      </Grid>
      <Grid container>
        <Typography variant="h5">Mapping</Typography>
      </Grid>
      <Grid position={'relative'} top={10} container direction={'column'} alignItems={'center'} gap={5}>
        <Grid container gap={2}>
          <Grid container alignItems={'center'}>
            <DateRangeIcon color="info" sx={{ fontSize: 24 }} />
            <Typography variant="body1">Datetime column</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              required
              label="date"
              items={columnTypeMapping?.date}
              helperText="this is required filed"
              onChange={onChange}
              defaultValue={dataArgs?.mapping.date}
            ></CustomSelect>
          </Grid>
        </Grid>
        <Grid container gap={2}>
          <Grid container alignItems={'center'}>
            <AbcIcon color="info" sx={{ fontSize: 24 }} />
            <Typography variant="body1">Label column</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              required
              label="name"
              items={columnTypeMapping?.string}
              helperText="this is required filed"
              onChange={onChange}
              defaultValue={dataArgs?.mapping.name}
            ></CustomSelect>
          </Grid>
        </Grid>
        <Grid container gap={2}>
          <Grid container alignItems={'center'}>
            <NumbersIcon color="info" sx={{ fontSize: 24 }} />
            <Typography variant="body1">Value column</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              required
              label="value"
              items={columnTypeMapping?.number.concat(columnTypeMapping.date)}
              helperText="this is required filed"
              onChange={onChange}
              defaultValue={dataArgs?.mapping.value}
            ></CustomSelect>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
