export interface ProjectProps {
  id: string;
  title: string;
  des: string;
  path: string;
  since: Date;
  lastModifiedDT: Date;
}

export interface ArgumentProps {
  type: string;
  chartArg: object;
  dataArg: object;
  dataId: number;
}
