import { X, Cookie, ChevronDown, ChevronUp } from "lucide-react";
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

export function CookieConsent() {
  const { hasConsented, updateCookieConsent } = usePreferences();
  const [showCustomize, setShowCustomize] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState(DEFAULT_COOKIE_CONSENT);

  if (hasConsented) {
    return null;
  }

  const handleAcceptAll = () => {
    updateCookieConsent({
      ...DEFAULT_COOKIE_CONSENT,
      analytics: true,
      marketing: true,
    });
  };

  const handleDecline = () => {
    updateCookieConsent({
      ...DEFAULT_COOKIE_CONSENT,
      analytics: false,
      marketing: false,
    });
  };

  const handleCustomize = () => {
    setShowCustomize(true);
  };

  const handleSaveCustom = () => {
    updateCookieConsent({
      ...cookiePreferences,
      consentDate: new Date().toISOString(),
    });
    setShowCustomize(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Cookie className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Cookie Preferences</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We use cookies to enhance your experience. You can choose which cookies to allow.
                </p>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-2 flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="size-4" />
                      Hide details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-4" />
                      View details
                    </>
                  )}
                </button>
                {showDetails && (
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p><strong>Essential:</strong> Required for login and session management</p>
                    <p><strong>Analytics:</strong> Help us improve the portal</p>
                    <p><strong>Marketing:</strong> Personalized content and ads</p>
                    <p><strong>Preferences:</strong> Remember your settings</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={handleDecline} className="rounded-lg">
                Decline
              </Button>
              <Button variant="outline" onClick={handleCustomize} className="rounded-lg">
                Customize
              </Button>
              <Button onClick={handleAcceptAll} className="rounded-lg">
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Cookie Preferences</DialogTitle>
            <DialogDescription>
              Choose which types of cookies you want to allow
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
          </div>

          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowCustomize(false)} className="flex-1 rounded-lg">
              Cancel
            </Button>
            <Button onClick={handleSaveCustom} className="flex-1 rounded-lg">
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
