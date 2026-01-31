"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Save, ArrowLeft } from "lucide-react";
import { Student, SchoolClass, AttendanceStatus, AttendanceRecord } from "@/lib/types";
import { api } from "@/services/api";

type Props = {
    params: Promise<{ id: string }>;
}

export default function AttendancePage({ params }: Props) {
    const [classId, setClassId] = useState<string>("");
    const [classDetails, setClassDetails] = useState<SchoolClass | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const date = new Date();

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setClassId(resolvedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!classId) return;

        const fetchData = async () => {
            try {
                // Fetch class details (mocking getting single class by ID)
                const classes = await api.getClasses();
                const cls = classes.find(c => c.id.toString() === classId);
                setClassDetails(cls || null);

                // Fetch students
                const studentsList = await api.getStudentsByClass(classId);
                setStudents(studentsList);

                // Initialize all as "Present" by default
                const initialStatus: Record<string, AttendanceStatus> = {};
                studentsList.forEach(s => initialStatus[s.id] = "Present");
                setAttendance(initialStatus);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [classId]);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = async () => {
        setSaving(true);
        const records: AttendanceRecord[] = Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            status,
        }));

        try {
            await api.saveAttendance(classId, date, records);
            setTimeout(() => {
                router.push("/classes");
            }, 500);
        } catch (error) {
            console.error("Failed to save attendance", error);
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>;
    }

    if (!classDetails) {
        return <div className="p-8 text-center">Class not found.</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{classDetails.name} : Attendance</h1>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" /> {date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
                <div className="bg-muted/40 p-4 grid grid-cols-12 gap-4 border-b border-border text-sm font-medium text-muted-foreground">
                    <div className="col-span-4 pl-2">Student Name</div>
                    <div className="col-span-2 text-center">ID</div>
                    <div className="col-span-6 text-center">Status</div>
                </div>

                <div className="divide-y divide-border">
                    {students.map((student) => (
                        <div key={student.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-muted/20 transition-colors">
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    {student.name.charAt(0)}
                                </div>
                                <span className="font-medium">{student.name}</span>
                            </div>
                            <div className="col-span-2 text-center text-sm text-muted-foreground">{student.id}</div>
                            <div className="col-span-6 flex justify-center gap-2">
                                <StatusButton
                                    status="Present"
                                    current={attendance[student.id]}
                                    onClick={() => handleStatusChange(student.id, "Present")}
                                    icon={CheckCircle}
                                    color="text-green-600 bg-green-50 hover:bg-green-100 border-green-200"
                                    activeColor="bg-green-100 border-green-500 ring-1 ring-green-500"
                                />
                                <StatusButton
                                    status="Absent"
                                    current={attendance[student.id]}
                                    onClick={() => handleStatusChange(student.id, "Absent")}
                                    icon={XCircle}
                                    color="text-red-600 bg-red-50 hover:bg-red-100 border-red-200"
                                    activeColor="bg-red-100 border-red-500 ring-1 ring-red-500"
                                />
                                <StatusButton
                                    status="Late"
                                    current={attendance[student.id]}
                                    onClick={() => handleStatusChange(student.id, "Late")}
                                    icon={Clock}
                                    color="text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200"
                                    activeColor="bg-amber-100 border-amber-500 ring-1 ring-amber-500"
                                />
                                <StatusButton
                                    status="Excused"
                                    current={attendance[student.id]}
                                    onClick={() => handleStatusChange(student.id, "Excused")}
                                    icon={AlertCircle}
                                    color="text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200"
                                    activeColor="bg-blue-100 border-blue-500 ring-1 ring-blue-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all font-semibold disabled:opacity-70"
                >
                    {saving ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            Save Attendance
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function StatusButton({ status, current, onClick, icon: Icon, color, activeColor }: any) {
    const isActive = current === status;
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all text-sm font-medium ${isActive ? activeColor : `border-transparent ${color} opacity-70 hover:opacity-100`}`}
        >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{status}</span>
        </button>
    );
}
