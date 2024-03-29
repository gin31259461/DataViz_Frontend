import { Box, Button, Slide, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';

type SliderProps = {
  children: ReactNode[];
};

const Slider = ({ children }: SliderProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'up' | 'down'>('left');

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage < children.length - 1 ? prevPage + 1 : prevPage));
    setSlideDirection('left');
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
    setSlideDirection('right');
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
        gap: 2,
      }}
    >
      {children.map((component, index) => (
        <Slide
          key={index}
          direction={slideDirection}
          in={index === currentPage}
          mountOnEnter
          unmountOnExit
          timeout={500}
          hidden={index !== currentPage}
        >
          <Box
            sx={{
              display: index === currentPage ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1,
            }}
          >
            {component}
          </Box>
        </Slide>
      ))}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Button variant="outlined" onClick={handlePrevious} color="info" disabled={currentPage === 0}>
          上一個
        </Button>
        <Typography variant="body1">
          第 {currentPage + 1} 頁 / 共 {children.length} 頁
        </Typography>
        <Button variant="outlined" onClick={handleNext} color="info" disabled={currentPage === children.length - 1}>
          下一個
        </Button>
      </Box>
    </Box>
  );
};

export default Slider;
