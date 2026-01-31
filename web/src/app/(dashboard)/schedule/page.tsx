"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { ScheduleEvent } from "@/lib/types";
import { api } from "@/services/api";

export default function SchedulePage() {
    const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const times = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await api.getSchedule();
                setSchedule(data);
            } catch (error) {
                console.error("Failed to load schedule", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    const getEvent = (day: string, time: string) => {
        return schedule.find((s) => s.day === day && s.time === time);
    };

    return (
        <div className="flex h-full flex-col gap-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-md border border-border shadow-sm font-medium">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>October 2023</span>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-border bg-card shadow-sm">
                <div className="min-w-[800px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-6 border-b border-border bg-muted/30">
                        <div className="p-4 border-r border-border text-center font-medium text-muted-foreground">Time</div>
                        {days.map((day) => (
                            <div key={day} className="p-4 border-r border-border text-center font-semibold text-foreground last:border-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : (
                        /* Time Rows */
                        <div className="divide-y divide-border">
                            {times.map((time) => (
                                <div key={time} className="grid grid-cols-6 min-h-[100px]">
                                    <div className="p-4 border-r border-border flex items-center justify-center text-sm font-medium text-muted-foreground bg-muted/5">
                                        <Clock className="h-3 w-3 mr-2" />
                                        {time}
                                    </div>
                                    {days.map((day) => {
                                        const event = getEvent(day, time);
                                        return (
                                            <div key={`${day}-${time}`} className="relative p-1 border-r border-border last:border-0 hover:bg-muted/10 transition-colors">
                                                {event && (
                                                    <div className={`absolute inset-1 rounded-md p-3 border ${event.color} shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all cursor-pointer`}>
                                                        <div>
                                                            <h4 className="font-bold text-sm leading-tight mb-1">{event.subject}</h4>
                                                            <p className="text-xs opacity-80">{event.teacher}</p>
                                                        </div>
                                                        <div className="text-xs font-mono opacity-70 bottom-2 right-2 absolute">
                                                            {event.room || 'Room 101'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
