'use client';
import 'client-only';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function QueryContextProvider({
  children,
}: React.PropsWithChildren) {
  // Clearing server cache avoiding outdated data
  if (!process.browser) {
    queryClient.clear();
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
