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
  des: string;
  target: string | undefined;
  selectedDataOID: number | undefined;
  selectedData: object | undefined;
  chartType: ChartTypes | undefined;
  chartArgs: ChartArgsProps | undefined;
  dataArgs: DataArgsProps<object> | undefined;
  columnTypeMapping: ColumnTypeMappingProps | undefined;
  setTitle: (title: string) => void;
  setDes: (des: string) => void;
  setTarget: (target: string) => void;
  setSelectedDataOID: (oid: number | undefined) => void;
  setSelectedData: (data: object) => void;
  setChartType: (chartType: ChartTypes) => void;
  setChartArgs: (chartArgs: object) => void;
  setDataArgs: (dataArgs: DataArgsProps<object>) => void;
  setColumnTypeMapping: (columnTypeMapping: ColumnTypeMappingProps) => void;
  clear: () => void;
}

export const useProjectStore = create<ProjectStoreProps>()((set) => ({
  title: 'unnamed',
  des: '',
  target: undefined,
  selectedDataOID: undefined,
  selectedData: [],
  chartType: undefined,
  chartArgs: undefined,
  dataArgs: undefined,
  columnTypeMapping: undefined,
  setTitle: (title: string) => set({ title: title }),
  setDes: (des: string) => set({ des: des }),
  setTarget: (target: string) => set({ target: target }),
  setSelectedDataOID: (oid) =>
    set({
      selectedDataOID: oid,
    }),
  setSelectedData: (data) =>
    set({
      selectedData: data,
    }),
  setChartType: (chartType) =>
    set({
      chartType: chartType,
    }),
  setChartArgs: (chartArgs) =>
    set({
      chartArgs: chartArgs,
    }),
  setDataArgs: (dataArgs) =>
    set({
      dataArgs: dataArgs,
    }),
  setColumnTypeMapping: (columnTypeMapping) =>
    set({
      columnTypeMapping: columnTypeMapping,
    }),
  clear: () =>
    set({
      selectedDataOID: undefined,
      selectedData: [],
      chartType: undefined,
      chartArgs: undefined,
      dataArgs: undefined,
    }),
}));
