"use client";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";

const attendanceData = [
    { name: "Mon", present: 85, absent: 15 },
    { name: "Tue", present: 88, absent: 12 },
    { name: "Wed", present: 82, absent: 18 },
    { name: "Thu", present: 90, absent: 10 },
    { name: "Fri", present: 87, absent: 13 },
];

const genderData = [
    { name: "Boys", value: 320 },
    { name: "Girls", value: 280 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const financeData = [
    { name: "Jan", income: 4000, expense: 2400 },
    { name: "Feb", income: 3000, expense: 1398 },
    { name: "Mar", income: 2000, expense: 9800 },
    { name: "Apr", income: 2780, expense: 3908 },
    { name: "May", income: 1890, expense: 4800 },
    { name: "Jun", income: 2390, expense: 3800 },
];

const performanceData = [
    { subject: "Math", Avg: 75 },
    { subject: "Science", Avg: 82 },
    { subject: "English", Avg: 88 },
    { subject: "History", Avg: 70 },
    { subject: "Art", Avg: 90 },
];

export function AnalyticsDashboard() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Attendance Trend */}
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Weekly Attendance Trend</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={attendanceData}>
                            <defs>
                                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', opacity: 0.7 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', opacity: 0.7 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--popover)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--popover-foreground)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Area type="monotone" dataKey="present" stroke="#8884d8" fillOpacity={1} fill="url(#colorPresent)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Finance Overview */}
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Finance Overview</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', opacity: 0.7 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', opacity: 0.7 }} />
                            <Tooltip
                                cursor={{ fill: 'var(--muted)' }}
                                contentStyle={{
                                    backgroundColor: 'var(--popover)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--popover-foreground)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="income" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="#ff8042" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Student Demographics */}
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Students Ratio</h3>
                <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={genderData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--popover)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--popover-foreground)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Subject Performance */}
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Average Subject Performance</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                            <XAxis type="number" axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: 'var(--foreground)', opacity: 0.7 }} />
                            <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} width={60} tick={{ fill: 'var(--foreground)', opacity: 0.7 }} />
                            <Tooltip
                                cursor={{ fill: 'var(--muted)' }}
                                contentStyle={{
                                    backgroundColor: 'var(--popover)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--popover-foreground)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Bar dataKey="Avg" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
