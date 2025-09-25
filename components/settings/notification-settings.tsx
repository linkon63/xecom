"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  notificationSettings: {
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
  onNotificationChange: (setting: 'email' | 'sms' | 'marketing') => void;
}

export function NotificationSettings({ notificationSettings, onNotificationChange }: NotificationSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage when and how we send you notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Account notifications</h4>
              <p className="text-sm text-muted-foreground">
                Important updates about your account.
              </p>
            </div>
            <Switch
              checked={notificationSettings.email}
              onCheckedChange={() => onNotificationChange('email')}
              aria-label="Toggle email notifications"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Marketing emails</h4>
              <p className="text-sm text-muted-foreground">
                Updates about new products, features, and more.
              </p>
            </div>
            <Switch
              checked={notificationSettings.marketing}
              onCheckedChange={() => onNotificationChange('marketing')}
              aria-label="Toggle marketing emails"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
          <CardDescription>
            Receive important updates via SMS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">SMS alerts</h4>
              <p className="text-sm text-muted-foreground">
                Important notifications via SMS.
              </p>
            </div>
            <Switch
              checked={notificationSettings.sms}
              onCheckedChange={() => onNotificationChange('sms')}
              aria-label="Toggle SMS notifications"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
