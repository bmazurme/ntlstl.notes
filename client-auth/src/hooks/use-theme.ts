import { useAppSelector } from '.';
import type { RootState } from '../store';

export const useTheme = (): { isDark: boolean } => {
  const isDark = useAppSelector((state: RootState) => state.theme.isDark);

  return { isDark };
};
