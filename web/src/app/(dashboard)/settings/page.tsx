"use client";

import { useState } from "react";
import { User, Bell, Shield, Key, Save, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";

export default function SettingsPage() {
    const [profileData, setProfileData] = useState({
        name: "Administrator",
        email: "admin@school.edu",
        bio: "School administrator with 10+ years of experience.",
    });

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        weeklyReports: false,
        studentAlerts: false,
    });

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [saving, setSaving] = useState(false);

    const handleProfileChange = (field: string, value: string) => {
        setProfileData({ ...profileData, [field]: value });
    };

    const handleNotificationToggle = (field: string) => {
        setNotifications({ ...notifications, [field]: !notifications[field as keyof typeof notifications] });
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            // Save profile
            const profileResponse = await fetch('/api/settings/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'current-user-id', // TODO: Get from auth context
                    ...profileData,
                }),
            });

            // Save notifications
            const notificationsResponse = await fetch('/api/settings/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'current-user-id', // TODO: Get from auth context
                    notifications,
                }),
            });

            if (profileResponse.ok && notificationsResponse.ok) {
                toast.success('Settings saved successfully!');
            } else {
                toast.warning('Failed to save some settings. Please try again.');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match!');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long!');
            return;
        }

        try {
            const response = await fetch('/api/settings/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'current-user-id', // TODO: Get from auth context
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password changed successfully!');
                setIsPasswordModalOpen(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(data.error || 'Failed to change password');
            }
        } catch (error) {
            console.error('Password change error:', error);
            toast.error('Failed to change password. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in relative pb-12">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </div>

            <div className="grid gap-8">
                {/* Profile Section */}
                <section className="scroll-mt-16 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4 border-b border-border pb-6 mb-6">
                        <div className="rounded-full bg-primary/10 p-3 text-primary">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Profile Settings</h2>
                            <p className="text-sm text-muted-foreground">Manage your public profile and personal details.</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={profileData.name}
                                onChange={(e) => handleProfileChange('name', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={profileData.email}
                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                            <textarea
                                id="bio"
                                rows={4}
                                value={profileData.bio}
                                onChange={(e) => handleProfileChange('bio', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Notifications Section */}
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4 border-b border-border pb-6 mb-6">
                        <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 text-orange-600 dark:text-orange-400">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Notifications</h2>
                            <p className="text-sm text-muted-foreground">Configure how you receive alerts and updates.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { id: 'email', label: 'Email Notifications', description: 'Receive updates via email.' },
                            { id: 'push', label: 'Push Notifications', description: 'Receive push notifications on your device.' },
                            { id: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly summary reports.' },
                            { id: 'studentAlerts', label: 'Student Alerts', description: 'Receive alerts about student activity.' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2">
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{item.label}</span>
                                    <span className="text-xs text-muted-foreground">{item.description}</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={notifications[item.id as keyof typeof notifications]}
                                        onChange={() => handleNotificationToggle(item.id)}
                                    />
                                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Security Section */}
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4 border-b border-border pb-6 mb-6">
                        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 text-red-600 dark:text-red-400">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Security</h2>
                            <p className="text-sm text-muted-foreground">Manage your password and session settings.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="flex items-center justify-between w-full p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <Key className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Change Password</span>
                            </div>
                            <span className="text-xs text-primary font-medium">Update</span>
                        </button>
                    </div>
                </section>
            </div>

            {/* Password Change Modal */}
            <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Change Password">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={() => setIsPasswordModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePasswordChange}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Floating Save Button */}
            <div className="fixed bottom-6 right-6 z-10">
                <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
