"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap, BookOpen, UserCheck, TrendingUp, Plus } from "lucide-react";
import { api } from "@/services/api";
import { DashboardStats, ActivityItem } from "@/lib/types";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          api.getDashboardStats(),
          api.getActivities()
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="p-6 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 text-sm font-medium shadow transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Item
          </button>
          <button className="bg-card hover:bg-muted text-foreground border border-border rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Students", value: stats?.totalStudents ?? 0, icon: Users, change: "+12%", trend: "up" },
          { title: "Total Teachers", value: stats?.totalTeachers ?? 0, icon: GraduationCap, change: "+4%", trend: "up" },
          { title: "Active Classes", value: stats?.totalClasses ?? 0, icon: BookOpen, change: "0%", trend: "neutral" },
          { title: "Attendance Rate", value: `${stats?.attendanceRate ?? 0}%`, icon: UserCheck, change: "+1.2%", trend: "up" },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <span className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                stat.trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                }`}>
                {stat.change}
                <TrendingUp className={`ml-1 h-3 w-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <AnalyticsDashboard />

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-0">
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-sm italic py-4">No recent activities.</p>
          ) : (
            activities.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b last:border-0 border-border py-4 last:pb-0 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                    {item.user.charAt(0)}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{item.user}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.action} <span className="text-primary">{item.target}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
