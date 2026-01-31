"use client";

import { Bell, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
    return (
        <header className={cn("flex h-16 items-center justify-between border-b border-border bg-card px-6", className)}>
            <div className="flex items-center gap-4">
                <button className="md:hidden">
                    <Menu className="h-6 w-6 text-muted-foreground" />
                </button>
                <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="h-9 w-64 rounded-md border border-border bg-muted/50 pl-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
                </button>
                <div className="h-8 w-8 rounded-full bg-primary/20" />
            </div>
        </header>
    );
}
