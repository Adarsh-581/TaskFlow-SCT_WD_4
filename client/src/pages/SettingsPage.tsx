import { useState } from 'react';
import { Bell, User, Palette, Shield, Download, Trash2, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Profile
    name: 'Adarsh',
    email: 'adarsheavenly3to1@gmail.com',
    avatar: '',
    timezone: 'Asia/Kolkata',
    language: 'en',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    dueDateAlerts: true,
    weeklyDigest: false,
    
    // Appearance
    theme: 'system',
    compactMode: false,
    showSubtasks: true,
    showDescription: false,
    
    // Privacy
    profileVisibility: 'private',
    shareAnalytics: false,
    trackProductivity: true,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data export will be sent to your email within 24 hours.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "Please check your email to confirm account deletion.",
      variant: "destructive",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={settings.avatar} />
                  <AvatarFallback className="text-lg">
                    {settings.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => updateSetting('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded about upcoming tasks
                    </p>
                  </div>
                  <Switch
                    checked={settings.taskReminders}
                    onCheckedChange={(checked) => updateSetting('taskReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Due Date Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get alerted when tasks are due soon
                    </p>
                  </div>
                  <Switch
                    checked={settings.dueDateAlerts}
                    onCheckedChange={(checked) => updateSetting('dueDateAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of your productivity
                    </p>
                  </div>
                  <Switch
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => updateSetting('weeklyDigest', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base">Theme</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose your preferred color scheme
                </p>
                <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact layout to fit more content
                    </p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Show Subtasks</Label>
                    <p className="text-sm text-muted-foreground">
                      Display subtasks in task lists
                    </p>
                  </div>
                  <Switch
                    checked={settings.showSubtasks}
                    onCheckedChange={(checked) => updateSetting('showSubtasks', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Show Descriptions</Label>
                    <p className="text-sm text-muted-foreground">
                      Display task descriptions in lists
                    </p>
                  </div>
                  <Switch
                    checked={settings.showDescription}
                    onCheckedChange={(checked) => updateSetting('showDescription', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base">Profile Visibility</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Who can see your profile information
                </p>
                <Select value={settings.profileVisibility} onValueChange={(value) => updateSetting('profileVisibility', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Share Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the app by sharing anonymous usage data
                    </p>
                  </div>
                  <Switch
                    checked={settings.shareAnalytics}
                    onCheckedChange={(checked) => updateSetting('shareAnalytics', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Track Productivity</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow the app to track your productivity metrics
                    </p>
                  </div>
                  <Switch
                    checked={settings.trackProductivity}
                    onCheckedChange={(checked) => updateSetting('trackProductivity', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Your current account information and subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Account Type</p>
                    <p className="text-sm text-muted-foreground">Free Plan</p>
                  </div>
                  <Badge variant="secondary">Free</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">January 2024</p>
                  </div>
                </div>

                <Button variant="outline">Upgrade to Pro</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>
                  Download a copy of your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleDeleteAccount} className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} className="bg-gradient-primary text-white hover:opacity-90">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;