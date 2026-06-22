'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from '../context/ThemeContext';
import { createQueryClient } from '../query/queryClient';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
