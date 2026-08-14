import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CookieConsent, Theme, FontSize, NotificationPreferences, AccessibilityPreferences, UserPreferences } from '@/lib/types/preferences';
import { DEFAULT_PREFERENCES, DEFAULT_COOKIE_CONSENT } from '@/lib/types/preferences';

interface PreferencesContextValue {
  preferences: UserPreferences;
  cookieConsent: CookieConsent | null;
  hasConsented: boolean;
  updateTheme: (theme: Theme) => void;
  updateLanguage: (language: string) => void;
  updateNotifications: (notifications: NotificationPreferences) => void;
  updateAccessibility: (accessibility: AccessibilityPreferences) => void;
  updateCookieConsent: (consent: CookieConsent) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

const PREFERENCES_STORAGE_KEY = 'user_preferences';
const COOKIE_CONSENT_STORAGE_KEY = 'cookie_consent';

function loadPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}

function savePreferences(preferences: UserPreferences) {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

function loadCookieConsent(): CookieConsent | null {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cookie consent:', error);
  }
  return null;
}

function saveCookieConsent(consent: CookieConsent) {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch (error) {
    console.error('Failed to save cookie consent:', error);
  }
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [cookieConsent, setCookieConsentState] = useState<CookieConsent | null>(null);

  // Load preferences on mount
  useEffect(() => {
    setPreferences(loadPreferences());
    setCookieConsentState(loadCookieConsent());
  }, []);

  // Apply theme to document
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

  // Apply accessibility options
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = getFontSizeValue(preferences.accessibility.fontSize);
    
    // High contrast
    if (preferences.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (preferences.accessibility.reducedMotion) {
      root.style.setProperty('--transition-duration', '0ms');
    } else {
      root.style.removeProperty('--transition-duration');
    }
  }, [preferences.accessibility]);

  const updateTheme = useCallback((theme: Theme) => {
    setPreferences(prev => {
      const updated = { ...prev, theme };
      savePreferences(updated);
      return updated;
    });
  }, []);

  const updateLanguage = useCallback((language: string) => {
    setPreferences(prev => {
      const updated = { ...prev, language };
      savePreferences(updated);
      return updated;
    });
  }, []);

  const updateNotifications = useCallback((notifications: NotificationPreferences) => {
    setPreferences(prev => {
      const updated = { ...prev, notifications };
      savePreferences(updated);
      return updated;
    });
  }, []);

  const updateAccessibility = useCallback((accessibility: AccessibilityPreferences) => {
    setPreferences(prev => {
      const updated = { ...prev, accessibility };
      savePreferences(updated);
      return updated;
    });
  }, []);

  const updateCookieConsent = useCallback((consent: CookieConsent) => {
    setCookieConsentState(consent);
    saveCookieConsent(consent);
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    savePreferences(DEFAULT_PREFERENCES);
  }, []);

  const value = useMemo<PreferencesContextValue>(() => ({
    preferences,
    cookieConsent,
    hasConsented: cookieConsent !== null,
    updateTheme,
    updateLanguage,
    updateNotifications,
    updateAccessibility,
    updateCookieConsent,
    resetPreferences,
  }), [preferences, cookieConsent, updateTheme, updateLanguage, updateNotifications, updateAccessibility, updateCookieConsent, resetPreferences]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within a PreferencesProvider.');
  return context;
}

function getFontSizeValue(size: FontSize): string {
  switch (size) {
    case 'small':
      return '14px';
    case 'medium':
      return '16px';
    case 'large':
      return '18px';
    case 'extra-large':
      return '20px';
    default:
      return '16px';
  }
}
