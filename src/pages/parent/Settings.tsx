import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ParentLayout } from "@/components/layout/ParentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parentApi } from "@/lib/api/parent";
import { Parent } from "@/lib/types/parent";
import { Settings, LockKeyhole, User, Mail, Phone, LogOut, Loader2, CheckCircle, Sun, Moon, Monitor, Bell, Smartphone, Eye, Type, Cookie } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { usePreferences } from "@/contexts/preferences-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { CookieManagement } from "@/components/ui/CookieManagement";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordValues = z.infer<typeof passwordSchema>;

export default function ParentSettings() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const { preferences, updateTheme, updateLanguage, updateNotifications, updateAccessibility } = usePreferences();
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false);

  const { data: parentData, isLoading } = useQuery({
    queryKey: ["parent-me"],
    queryFn: () => parentApi.getMe(),
  });

  const parent = parentData?.data as Parent;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  const passwordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      parentApi.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      setPasswordSuccess(true);
      setPasswordError("");
      reset();
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
    onError: (error: Error) => {
      setPasswordSuccess(false);
      setPasswordError(error.message || "Failed to change password");
    },
  });

  const handlePasswordChange = (values: PasswordValues) => {
    setPasswordError("");
    passwordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const handleLogout = () => {
    logout();
  };

  const getDisplayName = () => {
    if (!user) return "Parent";
    if ("primaryGuardian" in user) {
      const firstName = user.primaryGuardian?.firstName || "";
      const lastName = user.primaryGuardian?.lastName || "";
      return `${firstName} ${lastName}`;
    }
    return "Parent";
  };

  return (
    <ParentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : parent ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">
                      {parent.primaryGuardian?.firstName} {parent.primaryGuardian?.lastName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Relationship</Label>
                    <p className="font-medium">{parent.primaryGuardian?.relationship}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <p className="font-medium">{parent.accountEmail}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <p className="font-medium">{parent.accountPhone}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Account Status</Label>
                    <p className="font-medium">{parent.status}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Children Linked</Label>
                    <p className="font-medium">{parent.students?.length || 0}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Unable to load profile information</p>
            )}
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                  {...register("currentPassword")}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password (min 6 characters)"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {passwordSuccess && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Password changed successfully!
                  </AlertDescription>
                </Alert>
              )}

              {passwordError && (
                <Alert variant="destructive">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-sm text-muted-foreground">Sign out of your parent account</p>
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
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
    </ParentLayout>
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