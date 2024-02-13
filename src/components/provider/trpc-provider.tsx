'use client';

import { getTrpcUrl, transformer } from '@/server/trpc/shared';
import { api } from '@/server/trpc/trpc.client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { ReactNode, useState } from 'react';

interface TrpcProviderProps {
  children: ReactNode;
}

export const TrpcProvider = (props: TrpcProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' || (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchLink({
          url: getTrpcUrl(),
        }),
      ],
    })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
};
