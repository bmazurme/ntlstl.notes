import { Button, Icon } from '@gravity-ui/uikit';
import { Moon, Sun } from '@gravity-ui/icons';

import { useAppDispatch } from '../hooks';
import { useTheme } from '../hooks/use-theme';
import { setTheme } from '../store';

export default function ThemeButton() {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const toggleTheme = (value: boolean) => dispatch(setTheme({ isDark: value }));

  return (
    <div>
      <Button
        view="normal"
        size="m"
        pin="round-clear"
        selected={!isDark}
        aria-label="Светлая тема"
        onClick={() => toggleTheme(false)}
      >
        <Icon data={Sun} size={16} />
      </Button>
      <Button
        view="normal"
        size="m"
        pin="clear-round"
        selected={isDark}
        aria-label="Темная тема"
        onClick={() => toggleTheme(true)}
      >
        <Icon data={Moon} size={16} />
      </Button>
    </div>
  );
}
