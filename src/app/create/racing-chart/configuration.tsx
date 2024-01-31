import { RacingBarChartMapping } from '@/components/chart-engine/racing-bar-chart-engine';
import {
  DataArgsProps,
  useProjectStore,
} from '@/hooks/store/use-project-store';
import { trpc } from '@/server/trpc';
import AbcIcon from '@mui/icons-material/Abc';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import NumbersIcon from '@mui/icons-material/Numbers';
import {
  Container,
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

const CustomSelect: React.FC<CustomFromSelectProps> = (props) => {
  const [value, setValue] = useState<string>(
    props.defaultValue
      ? props.items
          ?.findIndex((value) => value == props.defaultValue)
          .toString() ?? ''
      : props.items && props.items.length > 0
        ? '0'
        : '',
  );

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value.toString());
    if (props.onChange && props.items)
      props.onChange(props.label, props.items[parseInt(event.target.value)]);
  };

  return (
    <FormControl
      fullWidth
      required={props.required ?? false}
      error={props.error ?? false}
      color={'info'}
    >
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

function Configuration() {
  const theme = useTheme();
  const columnTypeMapping = useProjectStore((state) => state.columnTypeMapping);
  const dataArgs = useProjectStore(
    (state) => state.dataArgs as DataArgsProps<RacingBarChartMapping>,
  );
  const setDataArgs = useProjectStore((state) => state.setDataArgs);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const title = useProjectStore((state) => state.title);
  const des = useProjectStore((state) => state.des);
  const setTitle = useProjectStore((state) => state.setTitle);
  const setDes = useProjectStore((state) => state.setDes);
  const setChartType = useProjectStore((state) => state.setChartType);
  const rowsCountFromDataTable =
    trpc.dataObject.getRowsCountFromDataTable.useQuery(selectedDataOID);
  const oneMemberData =
    trpc.dataObject.getOneMemberData.useQuery(selectedDataOID);

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
    [dataArgs, setDataArgs],
  );

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Grid container gap={10}>
        <Grid container gap={3}>
          <Typography variant="h4">Project setting</Typography>
          <Grid container>
            <TextField
              label="Name"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid container>
            <TextField
              label="Description"
              fullWidth
              multiline
              value={des}
              onChange={(e) => setDes(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item sm={8}>
            <Typography variant="h4">Chart type</Typography>
          </Grid>
          <Grid item sm={4}>
            <CustomSelect
              label="type"
              items={['racing chart']}
              disabled
            ></CustomSelect>
          </Grid>
        </Grid>
        <Grid container>
          <Typography variant="h4">Data information</Typography>
        </Grid>
        <Grid container>
          <Grid item sm={4}>
            <Typography variant="h5">
              ID:{' '}
              <span style={{ color: theme.palette.info.light }}>
                {selectedDataOID}
              </span>
            </Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant="h5">
              Name:{' '}
              <span style={{ color: theme.palette.info.light }}>
                {oneMemberData.data && oneMemberData.data.name}
              </span>{' '}
            </Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant="h5">
              Rows:{' '}
              <span style={{ color: theme.palette.info.light }}>
                {rowsCountFromDataTable.data && rowsCountFromDataTable.data}
              </span>
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Typography variant="h4">
            Mapping data into specific format
          </Typography>
        </Grid>
        <Grid
          position={'relative'}
          top={10}
          container
          direction={'column'}
          alignItems={'center'}
          gap={5}
        >
          <Grid container>
            <Grid item sm={2}>
              <DateRangeIcon fontSize={'large'} />
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1">
                Select one column as date that is continuous x data of racing
                chart
              </Typography>
            </Grid>
            <Grid item sm={4}>
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
          <Grid container>
            <Grid item sm={2}>
              <AbcIcon fontSize={'large'} />
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1">
                Select one column as showing label
              </Typography>
            </Grid>
            <Grid item sm={4}>
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
          <Grid container>
            <Grid item sm={2}>
              <NumbersIcon fontSize={'large'} />
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1">
                Select one column as value of y
              </Typography>
            </Grid>
            <Grid item sm={4}>
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
          <Grid container>
            <Grid item sm={2}>
              <CategoryIcon fontSize={'large'} />
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1">
                Select one column as label type
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <CustomSelect
                label="category"
                items={columnTypeMapping?.string}
                onChange={onChange}
                defaultValue={dataArgs?.mapping.category}
              ></CustomSelect>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
export default Configuration;
