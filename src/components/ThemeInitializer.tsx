import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export const ThemeInitializer = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Ensure the theme class is applied on mount
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return null;
};
