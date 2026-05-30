import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AppBootstrap } from '@/providers/AppBootstrap';
import { SnackbarProvider } from '@/providers/SnackbarProvider';
import { commerceDesk } from '@/theme/commerceDesk';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: commerceDesk.accent,
  },
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppBootstrap>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={paperTheme}>
          <SnackbarProvider>{children}</SnackbarProvider>
        </PaperProvider>
      </QueryClientProvider>
    </AppBootstrap>
  );
}
