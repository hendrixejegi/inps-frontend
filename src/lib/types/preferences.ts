export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface AccessibilityPreferences {
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface UserPreferences {
  theme: Theme;
  language: string;
  notifications: NotificationPreferences;
  accessibility: AccessibilityPreferences;
}

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  consentDate: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
  },
};

export const DEFAULT_COOKIE_CONSENT: CookieConsent = {
  essential: true,
  analytics: false,
  marketing: false,
  preferences: true,
  consentDate: new Date().toISOString(),
};
