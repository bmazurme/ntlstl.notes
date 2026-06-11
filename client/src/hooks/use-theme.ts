import type { RootState } from '../store';

import { useAppSelector } from '.';

export const useTheme = (): { isDark: boolean } => {
  const isDark = useAppSelector((state: RootState) => state.theme.isDark);

  return { isDark };
};
