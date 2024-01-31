'use client';

import { useUserStore } from '@/hooks/store/use-user-store';
import { ColorModeContext, useMode } from '@/utils/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import {
  CommandModalContext,
  useCommandModal,
} from '../modal/command-modal/provider';

interface ProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function Provider({ children, session }: ProviderProps) {
  const { theme, colorMode } = useMode();
  const ControlCommandModal = useCommandModal();
  const setMID = useUserStore((state) => state.setMID);

  if (session) {
    setMID(parseInt(session.user.id));
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <div>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div>
            <SessionProvider session={session} basePath="/api/auth">
              <CommandModalContext.Provider value={ControlCommandModal}>
                {children}
              </CommandModalContext.Provider>
            </SessionProvider>
          </div>
        </ThemeProvider>
      </div>
    </ColorModeContext.Provider>
  );
}
