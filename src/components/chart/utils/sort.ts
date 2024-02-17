import { BarGraphDataInstance } from '../bar-graph';
import { CircleGraphDataInstance } from '../circle-graph';

const localeCompareLanguage = ['en', 'zh-tw'];

export const sortBarGraphData = (data: BarGraphDataInstance[]) => {
  return data.sort((a, b) => {
    if (!Number.isNaN(Number(b.x)) && !Number.isNaN(Number(a.x))) return parseInt(b.x) - parseInt(a.x);
    else return b.x.localeCompare(a.x, localeCompareLanguage);
  });
};

export const sortCircleGraphData = (data: CircleGraphDataInstance[]) => {
  return data.sort((a, b) => {
    if (!Number.isNaN(Number(b.label)) && !Number.isNaN(Number(a.label))) return parseInt(a.label) - parseInt(b.label);
    else return a.label.localeCompare(b.label, localeCompareLanguage);
  });
};
