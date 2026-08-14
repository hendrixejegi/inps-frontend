import { Cookie, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usePreferences } from "@/contexts/preferences-context";
import { DEFAULT_COOKIE_CONSENT } from "@/lib/types/preferences";

interface CookieManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CookieManagement({ open, onOpenChange }: CookieManagementProps) {
  const { cookieConsent, updateCookieConsent } = usePreferences();
  const [cookiePreferences, setCookiePreferences] = useState(
    cookieConsent || DEFAULT_COOKIE_CONSENT
  );

  const handleSave = () => {
    updateCookieConsent({
      ...cookiePreferences,
      consentDate: new Date().toISOString(),
    });
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    const allEnabled = {
      ...DEFAULT_COOKIE_CONSENT,
      analytics: true,
      marketing: true,
    };
    setCookiePreferences(allEnabled);
    updateCookieConsent(allEnabled);
    onOpenChange(false);
  };

  const handleDeclineAll = () => {
    const allDisabled = {
      ...DEFAULT_COOKIE_CONSENT,
      analytics: false,
      marketing: false,
    };
    setCookiePreferences(allDisabled);
    updateCookieConsent(allDisabled);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cookie Preferences</DialogTitle>
          <DialogDescription>
            Manage your cookie consent settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
            <Checkbox
              id="essential"
              checked={cookiePreferences.essential}
              disabled
              className="rounded"
            />
            <div className="flex-1">
              <Label htmlFor="essential" className="font-medium">Essential Cookies</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Required for login and session management
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Always on</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Checkbox
              id="analytics"
              checked={cookiePreferences.analytics}
              onCheckedChange={(checked) =>
                setCookiePreferences(prev => ({ ...prev, analytics: checked === true }))
              }
              className="rounded"
            />
            <div className="flex-1">
              <Label htmlFor="analytics" className="font-medium">Analytics Cookies</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Help us improve the portal by tracking usage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Checkbox
              id="marketing"
              checked={cookiePreferences.marketing}
              onCheckedChange={(checked) =>
                setCookiePreferences(prev => ({ ...prev, marketing: checked === true }))
              }
              className="rounded"
            />
            <div className="flex-1">
              <Label htmlFor="marketing" className="font-medium">Marketing Cookies</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Personalized content and advertisements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Checkbox
              id="preferences"
              checked={cookiePreferences.preferences}
              onCheckedChange={(checked) =>
                setCookiePreferences(prev => ({ ...prev, preferences: checked === true }))
              }
              className="rounded"
            />
            <div className="flex-1">
              <Label htmlFor="preferences" className="font-medium">Preference Cookies</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Remember your settings and preferences
              </p>
            </div>
          </div>

          {cookieConsent && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Cookie className="size-3" />
              Consent given on {new Date(cookieConsent.consentDate).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDeclineAll} className="flex-1 rounded-lg">
              Decline All
            </Button>
            <Button variant="outline" onClick={handleAcceptAll} className="flex-1 rounded-lg">
              Accept All
            </Button>
          </div>
          <Button onClick={handleSave} className="w-full rounded-lg">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
