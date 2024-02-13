'use client';

import { createTheme, ThemeOptions } from '@mui/material';
import { createContext, useMemo, useState } from 'react';
import { colorTokens } from './color-tokens';

export const themeSettings = (mode: 'dark' | 'light'): ThemeOptions => {
  const colors = colorTokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            primary: {
              main: colors.primary[400],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            primary: {
              main: colors.primary[400],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: '#fcfcfc',
            },
          }),
    },
    typography: {
      fontFamily: ['Optima', 'TaipeiSans', 'sans-serif'].join(','),
      // fontSize: 12,
      h1: {
        fontFamily: ['Optima', 'TaipeiSans', 'sans-serif'].join(','),
        // fontSize: 40,
      },
      h2: {
        fontFamily: ['Optima', 'TaipeiSans', 'sans-serif'].join(','),
        // fontSize: 32,
      },
      h3: {
        fontFamily: ['Optima', 'TaipeiSans', 'sans-serif'].join(','),
        // fontSize: 24,
      },
      h4: {
        fontFamily: ['Optima', 'TaipeiSans', 'sans-serif'].join(','),
        // fontSize: 20,
      },
      h5: {
        fontFamily: ['Optima', 'TaipeiSans', 'sans-serif'].join(','),
        // fontSize: 16,
      },
      h6: {
        fontFamily: ['Optima', 'TaipeiSans', 'sans-serif'].join(','),
        // fontSize: 14,
      },
    },
  };
};

interface ColorModeContextProps {
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextProps>({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState<'dark' | 'light'>('light');
  const colorMode = useMemo<ColorModeContextProps>(() => {
    return {
      toggleColorMode: () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
      },
    };
  }, []);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return { theme, colorMode };
};
