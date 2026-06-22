import type { ReactElement, ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
  type RenderHookOptions,
  type RenderOptions,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export { act, fireEvent, render, renderHook, screen, waitFor, within };

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
      },
    },
  });
}

export function createQueryWrapper(queryClient: QueryClient) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

export interface RenderWithProvidersOptions extends Omit<
  RenderOptions,
  'wrapper'
> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  return render(ui, {
    ...renderOptions,
    wrapper: createQueryWrapper(queryClient),
  });
}

export function renderQueryHook<TResult, TProps>(
  callback: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps> & { queryClient?: QueryClient }
) {
  const queryClient = options?.queryClient ?? createTestQueryClient();

  return renderHook(callback, {
    ...options,
    wrapper: createQueryWrapper(queryClient),
  });
}

export function renderWithUser(
  ui: ReactElement,
  queryClient: QueryClient = createTestQueryClient()
) {
  return {
    user: userEvent.setup(),
    ...renderWithProviders(ui, { queryClient }),
  };
}
