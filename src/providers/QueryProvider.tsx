/**
 * Global TanStack Query provider.
 *
 * This provider wraps the entire application, making the QueryClient
 * available to all components. It also includes the React Query Devtools
 * for a better development experience.
 */

'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/hooks/queryClient';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // We can also create the client here, but for consistency and to allow
  // importing the client elsewhere (e.g., for prefetching in server actions),
  // we create it in a separate module.
  const [client] = React.useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* The devtools are only included in development builds */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
