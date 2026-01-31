"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    Settings,
    LogOut,
    Bell,
    CreditCard as Building // Reusing, or import DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Students", href: "/students", icon: Users },
    { name: "Teachers", href: "/teachers", icon: GraduationCap },
    { name: "Classes", href: "/classes", icon: BookOpen },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Exams", href: "/exams", icon: GraduationCap },
    { name: "Fees", href: "/fees", icon: Building }, // Using Building as placeholder or dollar sign
    { name: "Alerts", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
];

import { useAuth } from "@/context/AuthContext";

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <div className={cn("flex h-full w-64 flex-col border-r border-border bg-card text-card-foreground", className)}>
            <div className="flex h-16 items-center border-b border-border px-6">
                <h1 className="text-xl font-bold text-primary">EduSystem</h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {navigation.filter(item => {
                        if (!user) return false;
                        if (user.role === 'admin') return true;

                        // Role based filtering
                        if (user.role === 'teacher') {
                            return ['Dashboard', 'Classes', 'Schedule', 'Exams', 'Settings', 'Alerts'].includes(item.name);
                        }
                        if (user.role === 'student' || user.role === 'parent') {
                            return ['Dashboard', 'Schedule', 'Exams', 'Fees', 'Alerts', 'Settings'].includes(item.name);
                        }
                        return false;
                    }).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="border-t border-border p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
