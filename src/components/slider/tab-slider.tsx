import { useSplitLineStyle } from '@/hooks/use-styles';
import { Box, Paper, Slide, Tab, Tabs } from '@mui/material';
import { MutableRefObject, SyntheticEvent, useState } from 'react';

type TabProps = {
  labels: string[];
  children: React.ReactNode[] | null;
  mainContentRef?: MutableRefObject<typeof Box | null>;
};

const TabSlider = (props: TabProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'up' | 'down'>('left');
  const borderStyle = useSplitLineStyle();

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    if (activeTab > newValue) setSlideDirection('right');
    else if (activeTab < newValue) setSlideDirection('left');
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper square sx={{ border: borderStyle, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          aria-label="Tab Navigation"
          variant="scrollable"
          textColor="secondary"
          indicatorColor="secondary"
          scrollButtons="auto"
        >
          {props.labels.map((label, i) => (
            <Tab key={`${label}-${i}`} label={label} />
          ))}
        </Tabs>
      </Paper>
      {props.children &&
        props.children.map((node, i) => {
          return (
            <Box
              key={i}
              ref={props.mainContentRef}
              sx={{
                display: i === activeTab ? 'flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
                overflow: 'hidden',
              }}
            >
              <Slide direction={slideDirection} in={activeTab === i} mountOnEnter unmountOnExit timeout={500}>
                <Box>{node}</Box>
              </Slide>
            </Box>
          );
        })}
    </Box>
  );
};

export default TabSlider;
