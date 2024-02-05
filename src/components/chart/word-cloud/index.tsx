import { useTheme } from '@mui/material';
import { scaleLog } from '@visx/scale';
import { Text } from '@visx/text';
import VisxWordCloud from '@visx/wordcloud/lib/Wordcloud';
import { schemeBlues } from 'd3-scale-chromatic';

type SpiralType = 'archimedean' | 'rectangular';

interface WordCloudProps {
  data: string;
  width?: number;
  height?: number;
  spiralType?: SpiralType;
  rotation?: boolean;
  colors?: string[];
  showControls?: boolean;
  margin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export type WordDataInstance = {
  text: string;
  value: number;
};

const defaultMargin = { top: 0, right: 0, bottom: 0, left: 0 };

function wordFreq(text: string): WordDataInstance[] {
  const words: string[] = text.replace(/\./g, '').split(/\s/);
  const freqMap: Record<string, number> = {};

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w] += 1;
  }
  return Object.keys(freqMap).map((word) => ({
    text: word,
    value: freqMap[word],
  }));
}
function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

export default function WordCloud({
  data,
  width,
  height,
  spiralType = 'archimedean',
  rotation = false,
  colors,
  margin = defaultMargin,
  showControls,
}: WordCloudProps) {
  const theme = useTheme();

  if (!colors) {
    colors =
      theme.palette.mode === 'dark'
        ? [...schemeBlues[3]].reverse()
        : ['#143059', '#2F6B9A', '#82a6c2'];
  }

  if (!width || !height) return null;
  if (!margin.left) margin.left = defaultMargin.left;
  if (!margin.right) margin.right = defaultMargin.right;
  if (!margin.top) margin.top = defaultMargin.top;
  if (!margin.bottom) margin.bottom = defaultMargin.bottom;

  const words = wordFreq(data);

  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, 100],
  });
  const fontSizeSetter = (datum: WordDataInstance) => fontScale(datum.value);

  const fixedValueGenerator = () => 0.5;

  return (
    <div className="word-cloud">
      <VisxWordCloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        padding={2}
        spiral={spiralType}
        rotate={rotation ? getRotationDegree : 0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors && colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </VisxWordCloud>
      <style jsx>{`
        .word-cloud {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        .word-loud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .word-loud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .word-loud textarea {
          min-height: 100px;
        }
      `}</style>
    </div>
  );
}
