import { DataInfoSchema } from '@/server/api/routers/analysis';
import { create } from 'zustand';

export interface BasicColumnTypeMapping {
  string: string[];
  number: string[];
  date: string[];
}

export type ProjectTypes = 'racing-chart' | 'path-analysis' | 'process-analysis';

export interface DataArgsProps<T> {
  mapping: T;
}
export type ChartArgsProps = object;
export type ColumnTypeMappingProps = BasicColumnTypeMapping;

export type ConceptHierarchyObject = {
  [k: string]: {
    hierarchy: Record<string, string[]>;
    order: string[];
  };
};
export type SkipValuesObject = {
  [k: string]: string[];
};
export type ProcessInstance = [string, string[]];
export type PathAnalysisData = {
  [k: string]: {
    class: string;
    entropy: number;
    features: { [k: string]: string[] };
    labels: string[];
    process: ProcessInstance[];
    samples: number[];
    target: string;
  }[];
};

export interface ProjectStoreProps {
  // Project properties
  title: string;
  des: string;

  setTitle: (title: string) => void;
  setDes: (des: string) => void;

  // Analysis-1 explore data
  selectedDataId: number | undefined;
  selectedData: object | undefined;
  dataInfo: DataInfoSchema | undefined;

  setSelectedDataId: (oid: number | undefined) => void;
  setSelectedData: (data: object) => void;
  setDataInfo: (dataInfo: DataInfoSchema | undefined) => void;

  // Analysis-2 path analysis
  target: string | undefined;
  conceptHierarchy: ConceptHierarchyObject;
  skipValues: SkipValuesObject;
  paths: object;

  setTarget: (target: string | undefined) => void;
  setConceptHierarchy: (concept: ConceptHierarchyObject) => void;
  setSkipValues: (skipValue: SkipValuesObject) => void;
  setPaths: (paths: object) => void;

  // Analysis-3 process analysis

  // Infographic properties
  chartType: ProjectTypes | undefined;
  chartArgs: ChartArgsProps | undefined;
  dataArgs: DataArgsProps<object> | undefined;
  columnTypeMapping: ColumnTypeMappingProps | undefined;

  setChartType: (chartType: ProjectTypes) => void;
  setChartArgs: (chartArgs: object) => void;
  setDataArgs: (dataArgs: DataArgsProps<object>) => void;
  setColumnTypeMapping: (columnTypeMapping: ColumnTypeMappingProps) => void;

  // Shared
  clear: () => void;
}

export const useProjectStore = create<ProjectStoreProps>()((set) => ({
  // Project properties
  title: 'unnamed',
  des: '',

  setTitle(title: string) {
    set({ title: title });
  },
  setDes: (des: string) => set({ des: des }),

  // Analysis-1 explore data
  selectedDataId: undefined,
  selectedData: [],
  dataInfo: undefined,

  setDataInfo(dataInfo) {
    set({ dataInfo });
  },
  setSelectedDataId(oid) {
    set({
      selectedDataId: oid,
    });
  },
  setSelectedData(data) {
    set({
      selectedData: data,
    });
  },

  // Analysis-2 path analysis
  target: undefined,
  conceptHierarchy: {},
  skipValues: {},
  paths: {},

  setTarget(target: string | undefined) {
    set({ target: target });
  },
  setConceptHierarchy(conceptHierarchy) {
    set({ conceptHierarchy });
  },
  setSkipValues(skipValues) {
    set({ skipValues });
  },
  setPaths(paths) {
    set({ paths });
  },

  // Analysis-3 process analysis

  // Infographic properties
  chartType: undefined,
  chartArgs: undefined,
  dataArgs: undefined,
  columnTypeMapping: undefined,

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

  // Shared
  clear() {
    set({
      target: undefined,
      conceptHierarchy: {},
      skipValues: {},
      selectedDataId: undefined,
      selectedData: [],
      chartType: undefined,
      chartArgs: undefined,
      dataArgs: undefined,
      columnTypeMapping: undefined,
    });
  },
}));
