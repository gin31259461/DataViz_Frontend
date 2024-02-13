import { create } from 'zustand';

export interface BasicColumnTypeMapping {
  string: string[];
  number: string[];
  date: string[];
}

export type ProjectTypes = 'racing-chart' | 'path-analysis';

export interface DataArgsProps<T> {
  mapping: T;
}

export type ChartArgsProps = object;
export type ColumnTypeMappingProps = BasicColumnTypeMapping;
export type ConceptHierarchyObject = {
  column: string;
  hierarchy: { [k: string]: string[] };
  order: string[];
};

export interface ProjectStoreProps {
  title: string;
  des: string;
  target: string | undefined;
  conceptHierarchy: ConceptHierarchyObject[];
  selectedDataOID: number | undefined;
  selectedData: object | undefined;
  chartType: ProjectTypes | undefined;
  chartArgs: ChartArgsProps | undefined;
  dataArgs: DataArgsProps<object> | undefined;
  columnTypeMapping: ColumnTypeMappingProps | undefined;
  setTitle: (title: string) => void;
  setDes: (des: string) => void;
  setTarget: (target: string) => void;
  setConceptHierarchy: (concept: ConceptHierarchyObject[]) => void;
  setSelectedDataOID: (oid: number | undefined) => void;
  setSelectedData: (data: object) => void;
  setChartType: (chartType: ProjectTypes) => void;
  setChartArgs: (chartArgs: object) => void;
  setDataArgs: (dataArgs: DataArgsProps<object>) => void;
  setColumnTypeMapping: (columnTypeMapping: ColumnTypeMappingProps) => void;
  clear: () => void;
}

export const useProjectStore = create<ProjectStoreProps>()((set) => ({
  title: 'unnamed',
  des: '',
  target: undefined,
  conceptHierarchy: [],
  selectedDataOID: undefined,
  selectedData: [],
  chartType: undefined,
  chartArgs: undefined,
  dataArgs: undefined,
  columnTypeMapping: undefined,
  setTitle(title: string) {
    set({ title: title });
  },
  setDes: (des: string) => set({ des: des }),
  setTarget(target: string) {
    set({ target: target });
  },
  setConceptHierarchy(concept) {
    set({ conceptHierarchy: concept });
  },
  setSelectedDataOID(oid) {
    set({
      selectedDataOID: oid,
    });
  },
  setSelectedData(data) {
    set({
      selectedData: data,
    });
  },
  setChartType(chartType) {
    set({
      chartType: chartType,
    });
  },
  setChartArgs(chartArgs) {
    set({
      chartArgs: chartArgs,
    });
  },
  setDataArgs(dataArgs) {
    set({
      dataArgs: dataArgs,
    });
  },
  setColumnTypeMapping(columnTypeMapping) {
    set({
      columnTypeMapping: columnTypeMapping,
    });
  },
  clear() {
    set({
      target: undefined,
      conceptHierarchy: [],
      selectedDataOID: undefined,
      selectedData: [],
      chartType: undefined,
      chartArgs: undefined,
      dataArgs: undefined,
      columnTypeMapping: undefined,
    });
  },
}));
