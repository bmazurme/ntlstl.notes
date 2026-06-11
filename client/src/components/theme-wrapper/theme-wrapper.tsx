import { ThemeProvider } from '@gravity-ui/uikit';
import React, { type ReactNode } from 'react';

import { useTheme } from '../../hooks/use-theme';

interface ThemeWrapperProps {
  children: ReactNode;
}

function getInitialTheme(): 'dark' | 'light' {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'light' ? 'light' : 'dark';
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { isDark } = useTheme();
  const theme = React.useMemo(() => isDark ? 'dark' : 'light', [isDark]);

  return (
    <ThemeProvider
      theme={theme}
      rootClassName={`theme-${getInitialTheme()}`}
    >
      {children}
    </ThemeProvider>
  );
}
