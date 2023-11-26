export interface ProjectProps {
  id: number;
  title: string;
  des: string;
  path: string;
  since: Date;
  lastModifiedDT: Date;
}

export interface ArgumentProps {
  dataId: number;
  chartType: string;
  dataArgs: object;
  chartArgs: object;
}
