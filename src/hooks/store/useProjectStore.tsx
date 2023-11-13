import { create } from 'zustand';

export type BasicColumnTypesMapping = {
  string: string[];
  number: string[];
  Date: string[];
};

export type RacingBarChartDataColumnMapping = {
  date: string;
  name: string;
  value: string;
  category: string;
};

export type RacingBarChartColumns = 'date' | 'name' | 'value' | 'category';

interface ProjectStoreProps {
  selectedDataOID: number | undefined;
  selectedData: object | null;
  target: string | undefined;
  features: string[] | undefined;
  columns: string[] | undefined;
  columnTypesMapping: BasicColumnTypesMapping | undefined;
  racingBarChartDataColumnMapping: RacingBarChartDataColumnMapping;
  setColumns: (columns: string[]) => void;
  setColumnTypesMapping: (mapping: BasicColumnTypesMapping) => void;
  setRacingChartDataColumnMapping: (mapping: RacingBarChartDataColumnMapping) => void;
  setTarget: (target: string | undefined) => void;
  setFeatures: (features: string[] | undefined) => void;
  setSelectedDataOID: (oid: number) => void;
  setSelectedData: (data: object) => void;
  clear: () => void;
}

export const useProjectStore = create<ProjectStoreProps>()((set, get) => ({
  selectedDataOID: undefined,
  target: undefined,
  features: undefined,
  selectedData: null,
  columnTypesMapping: undefined,
  racingBarChartDataColumnMapping: { date: '', name: '', value: '', category: '' },
  columns: undefined,
  setColumns: (columns: string[]) => set({ columns: columns }),
  setColumnTypesMapping: (mapping: BasicColumnTypesMapping) => set({ columnTypesMapping: mapping }),
  setRacingChartDataColumnMapping: (mapping: RacingBarChartDataColumnMapping) =>
    set({ racingBarChartDataColumnMapping: mapping }),
  setTarget: (target: string | undefined) => set({ target: target }),
  setFeatures: (features: string[] | undefined) => set({ features: features }),
  setSelectedDataOID: (oid: number) => set({ selectedDataOID: oid }),
  setSelectedData: (data: object) => set({ selectedData: data }),
  clear: () =>
    set({
      selectedDataOID: undefined,
      target: undefined,
      features: undefined,
      selectedData: null,
      columnTypesMapping: undefined,
    }),
}));
