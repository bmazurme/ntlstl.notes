import React, { type ReactNode } from 'react';
import { ThemeProvider } from '@gravity-ui/uikit';

import { useTheme } from '../../hooks/use-theme';

interface ThemeWrapperProps {
  children: ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { isDark } = useTheme();
  const theme = React.useMemo(() => isDark ? 'dark' : 'light', [isDark]);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
