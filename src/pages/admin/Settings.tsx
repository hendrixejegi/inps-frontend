import { Moon, Sun, Monitor, Bell, Mail, Smartphone, Eye, Zap, Type, Cookie } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { usePreferences } from "@/contexts/preferences-context";
import { CookieManagement } from "@/components/ui/CookieManagement";
import { useState } from "react";

export default function AdminSettings() {
  const { preferences, updateTheme, updateLanguage, updateNotifications, updateAccessibility } = usePreferences();
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="size-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-2">
                <Button
                  variant={preferences.theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateTheme('light')}
                  className="flex-1"
                >
                  <Sun className="mr-2 size-4" />
                  Light
                </Button>
                <Button
                  variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateTheme('dark')}
                  className="flex-1"
                >
                  <Moon className="mr-2 size-4" />
                  Dark
                </Button>
                <Button
                  variant={preferences.theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateTheme('system')}
                  className="flex-1"
                >
                  <Monitor className="mr-2 size-4" />
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="size-5" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Interface Language</Label>
              <Select value={preferences.language} onValueChange={updateLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es" disabled>Español (Coming Soon)</SelectItem>
                  <SelectItem value="fr" disabled>Français (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.notifications.email}
                onCheckedChange={(checked) =>
                  updateNotifications({ ...preferences.notifications, email: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive updates via SMS
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={preferences.notifications.sms}
                onCheckedChange={(checked) =>
                  updateNotifications({ ...preferences.notifications, sms: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive browser push notifications
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={preferences.notifications.push}
                onCheckedChange={(checked) =>
                  updateNotifications({ ...preferences.notifications, push: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-5" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Font Size</Label>
              <Slider
                value={[getFontSizeIndex(preferences.accessibility.fontSize)]}
                onValueChange={([value]) => {
                  const sizes: Array<'small' | 'medium' | 'large' | 'extra-large'> = ['small', 'medium', 'large', 'extra-large'];
                  updateAccessibility({ ...preferences.accessibility, fontSize: sizes[value] });
                }}
                max={3}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Small</span>
                <span>Medium</span>
                <span>Large</span>
                <span>Extra Large</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">High Contrast</Label>
                <p className="text-xs text-muted-foreground">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={preferences.accessibility.highContrast}
                onCheckedChange={(checked) =>
                  updateAccessibility({ ...preferences.accessibility, highContrast: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
                <p className="text-xs text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={preferences.accessibility.reducedMotion}
                onCheckedChange={(checked) =>
                  updateAccessibility({ ...preferences.accessibility, reducedMotion: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Cookie Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="size-5" />
              Cookie Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage your cookie consent and tracking preferences
            </p>
            <Button
              variant="outline"
              onClick={() => setCookieDialogOpen(true)}
              className="w-full"
            >
              <Cookie className="mr-2 size-4" />
              Manage Cookie Preferences
            </Button>
          </CardContent>
        </Card>
      </div>

      <CookieManagement open={cookieDialogOpen} onOpenChange={setCookieDialogOpen} />
    </AdminLayout>
  );
}

function getFontSizeIndex(size: 'small' | 'medium' | 'large' | 'extra-large'): number {
  switch (size) {
    case 'small': return 0;
    case 'medium': return 1;
    case 'large': return 2;
    case 'extra-large': return 3;
    default: return 1;
  }
}
