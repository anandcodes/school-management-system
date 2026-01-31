"use client";

import { useEffect, useState } from "react";
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { NotificationItem } from "@/lib/types";
import { api } from "@/services/api";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await api.getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to load notifications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'error': case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'warning': return <Clock className="h-5 w-5 text-amber-500" />;
            case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const handleMarkAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        try {
            await api.markNotificationAsRead(id);
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" /></div>;

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <button className="text-sm text-primary hover:underline">Mark all as read</button>
            </div>

            <div className="space-y-4">
                {notifications.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => !item.read && handleMarkAsRead(item.id)}
                        className={`flex gap-4 p-4 rounded-xl border ${item.read ? 'bg-card border-border' : 'bg-primary/5 border-primary/20 cursor-pointer'} transition-all hover:shadow-sm`}
                    >
                        <div className={`mt-1 h-10 w-10 min-w-[2.5rem] rounded-full flex items-center justify-center bg-background border border-border shadow-sm`}>
                            {getIcon(item.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`font-semibold ${item.read ? 'text-foreground' : 'text-primary'}`}>{item.title}</h3>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{item.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.message}</p>
                        </div>
                        {!item.read && (
                            <div className="self-center">
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
