import { create } from 'zustand';

export interface BasicColumnTypeMapping {
  string: string[];
  number: string[];
  date: string[];
}

export type ChartTypes = 'racing-bar-chart';

export interface DataArgsProps<T> {
  mapping: T;
}

export type ChartArgsProps = object;
export type ColumnTypeMappingProps = BasicColumnTypeMapping;

export interface ProjectStoreProps {
  title: string;
  setTitle: (title: string) => void;
  des: string;
  setDes: (des: string) => void;
  selectedDataOID: number | null;
  setSelectedDataOID: (oid: number) => void;
  selectedData: object | null;
  setSelectedData: (data: object) => void;
  chartType: ChartTypes | undefined;
  setChartType: (chartType: ChartTypes) => void;
  chartArgs: ChartArgsProps | undefined;
  setChartArgs: (chartArgs: object) => void;
  dataArgs: DataArgsProps<{}> | undefined;
  setDataArgs: (dataArgs: DataArgsProps<{}>) => void;
  columnTypeMapping: ColumnTypeMappingProps | undefined;
  setColumnTypeMapping: (columnTypeMapping: ColumnTypeMappingProps) => void;
  clear: () => void;
}

export const useProjectStore = create<ProjectStoreProps>()((set, get) => ({
  title: 'unnamed title',
  setTitle: (title: string) => set({ title: title }),
  des: 'description',
  setDes: (des: string) => set({ des: des }),
  selectedDataOID: null,
  setSelectedDataOID: (oid) =>
    set({
      selectedDataOID: oid,
    }),
  selectedData: null,
  setSelectedData: (data) =>
    set({
      selectedData: data,
    }),
  chartType: undefined,
  setChartType: (chartType) =>
    set({
      chartType: chartType,
    }),
  chartArgs: undefined,
  setChartArgs: (chartArgs) =>
    set({
      chartArgs: chartArgs,
    }),
  dataArgs: undefined,
  setDataArgs: (dataArgs) =>
    set({
      dataArgs: dataArgs,
    }),
  columnTypeMapping: undefined,
  setColumnTypeMapping: (columnTypeMapping) =>
    set({
      columnTypeMapping: columnTypeMapping,
    }),
  clear: () =>
    set({
      selectedDataOID: null,
      selectedData: null,
      chartType: undefined,
      chartArgs: undefined,
      dataArgs: undefined,
    }),
}));
