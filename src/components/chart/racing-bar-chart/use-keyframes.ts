import axios from 'axios';
import { parse as csvParse } from 'csv-parse/sync';
import { useEffect, useState } from 'react';

export interface FrameDataProps {
  category?: string;
  name: string;
  value: number;
  date: string | Date | number;
}

export interface KeyFrameProps {
  date: string | number | Date;
  data: FrameDataProps[];
}

const buildFindData = (data: FrameDataProps[]) => {
  const dataByDateAndName = new Map();
  data.forEach((dataPoint) => {
    const { date, name } = dataPoint;
    if (!dataByDateAndName.get(date)) {
      dataByDateAndName.set(date, { [name]: dataPoint });
    } else {
      const nextGroup = {
        ...dataByDateAndName.get(date),
        [name]: dataPoint,
      };
      dataByDateAndName.set(date, nextGroup);
    }
  });
  const finder = ({ date, name }: { date: string | number | Date; name: string }) => {
    try {
      return dataByDateAndName.get(date)[name];
    } catch (e) {
      return null;
    }
  };
  return finder;
};

export const makeKeyframes = (data: FrameDataProps[], numOfSlice: number) => {
  /**
   * Assume data is an array of { date: string, name: string, value: number, ...others }.
   * This function return an array of keyframe, each keyframe is { date: Date, data: { name: string, value: number, ...others }[] }.
   * At first we will collect all of the name appearing in the original data.
   * The `data` field of keyframe is descending sorted by `value` field.
   */
  const findData = buildFindData(data);
  const nameSet = new Set(data.map(({ name }) => name));
  const nameList = [...nameSet];
  const dateSet = new Set(data.map(({ date }) => date));
  const dateList = [...dateSet];

  const frames: KeyFrameProps[] = dateList.sort().map((date) => ({
    date,
    data: nameList.map((name) => {
      const dataPoint = findData({ date, name });
      return {
        ...dataPoint,
        value: dataPoint ? dataPoint.value : 0,
      };
    }),
  }));

  const keyframes = frames
    .reduce<KeyFrameProps[]>((result, frame, i) => {
      const prev = frame;
      const next = i !== frames.length - 1 ? frames[i + 1] : null;

      if (!next) {
        result.push({
          ...frame,
          date: new Date(frame.date),
        });
      } else {
        const prevTimestamp = new Date(prev.date).getTime();
        const nextTimestamp = new Date(next.date).getTime();
        const diff = nextTimestamp - prevTimestamp;
        for (let i = 0; i < numOfSlice; i++) {
          const sliceDate = new Date(prevTimestamp + (diff * i) / numOfSlice);
          const sliceData = frame.data.map(({ name, value, ...others }) => {
            const prevValue = value;
            const nextDataPoint = findData({
              date: next.date,
              name,
            });
            const nextValue = nextDataPoint ? nextDataPoint.value : 0;
            const sliceValue = prevValue + ((nextValue - prevValue) * i) / numOfSlice;
            return {
              name,
              value: sliceValue,
              ...others,
            };
          });
          result.push({
            date: sliceDate,
            data: sliceData,
          });
        }
      }
      return result;
    }, [])
    .map(({ date, data }) => {
      return {
        date,
        data: data.sort((a, b) => b.value - a.value),
      };
    });
  return keyframes;
};

function useKeyframes(input: string | FrameDataProps[], numOfSlice: number) {
  const [keyframes, setKeyframes] = useState<KeyFrameProps[]>([]);

  useEffect(() => {
    if (typeof input === 'string') {
      axios.get(input).then((resp) => {
        const { data: csvString } = resp;
        const data = csvParse(csvString)
          .slice(1)
          .map(([date, name, category, value]: [string | number | Date, string, string, number]) => ({
            date,
            name,
            category,
            value: Number(value),
          }));
        const keyframes = makeKeyframes(data, numOfSlice);
        setKeyframes(keyframes);
      });
    } else {
      const keyframes = makeKeyframes(input as FrameDataProps[], numOfSlice);
      setKeyframes(keyframes);
    }
  }, [input, numOfSlice]);

  return keyframes;
}

export default useKeyframes;
