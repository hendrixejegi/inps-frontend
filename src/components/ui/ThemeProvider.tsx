import { useEffect } from 'react';
import { usePreferences } from '@/contexts/preferences-context';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences } = usePreferences();

  useEffect(() => {
    const root = document.documentElement;
    const isDark = preferences.theme === 'dark' || 
      (preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [preferences.theme]);

  return <>{children}</>;
}
