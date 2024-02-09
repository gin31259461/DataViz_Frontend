import { useSplitLineStyle } from '@/hooks/use-styles';
import { Box, Paper, Slide, Tab, Tabs } from '@mui/material';
import { ReactNode, SyntheticEvent, useState } from 'react';

export type TabItem = {
  label: string;
  content: ReactNode;
};

interface TabProps {
  tabs: TabItem[];
}

const TabSlider = ({ tabs }: TabProps) => {
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
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Paper>
      {tabs.map((tab, i) => {
        return (
          <Box
            key={i}
            sx={{
              mt: 2,
              display: i === activeTab ? 'flex' : 'none',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 2,
              overflow: 'hidden',
            }}
          >
            <Slide direction={slideDirection} in={activeTab === i} mountOnEnter unmountOnExit timeout={500}>
              <Box
                sx={{
                  maxWidth: '100%',
                  overflowWrap: 'anywhere',
                }}
              >
                {tab.content}
              </Box>
            </Slide>
          </Box>
        );
      })}
    </Box>
  );
};

export default TabSlider;
