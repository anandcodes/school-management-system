"use client";

import { User, Bell, Shield, Key, Save } from "lucide-react";

export default function SettingsPage() {
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
                            <input type="text" id="name" defaultValue="Administrator" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                            <input type="email" id="email" defaultValue="admin@school.edu" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                            <textarea id="bio" rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" defaultValue="School administrator with 10+ years of experience." />
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
                        {["Email Notifications", "Push Notifications", "Weekly Reports", "Student Alerts"].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{item}</span>
                                    <span className="text-xs text-muted-foreground">Receive updates about system activity.</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
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
                        <button className="flex items-center justify-between w-full p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <Key className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Change Password</span>
                            </div>
                            <span className="text-xs text-primary font-medium">Update</span>
                        </button>
                    </div>
                </section>
            </div>

            <div className="fixed bottom-6 right-6 z-10">
                <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all transform hover:-translate-y-1">
                    <Save className="h-5 w-5" />
                    Save Changes
                </button>
            </div>
        </div>
    );
}
