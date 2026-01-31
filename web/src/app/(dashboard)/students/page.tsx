"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Filter, MoreHorizontal, Mail } from "lucide-react";
import { Student } from "@/lib/types";
import { api } from "@/services/api";
import { Modal } from "@/components/Modal";
import { AddStudentForm } from "@/components/forms/AddStudentForm";

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await api.getStudents();
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch students", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleAddStudent = (newStudentData: Omit<Student, "id">) => {
        const newStudent: Student = {
            ...newStudentData,
            id: `ST-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        // Optimistic update
        setStudents([...students, newStudent]);
        setIsAddOpen(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Student
                </button>
            </div>

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Student">
                <AddStudentForm onCancel={() => setIsAddOpen(false)} onSubmit={handleAddStudent} />
            </Modal>


            <div className="flex items-center gap-4 rounded-lg bg-card p-4 border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
                <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted hover:text-foreground">
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden min-h-[300px]">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Student Info</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell">Contact</th>
                                <th className="px-6 py-4 font-medium">Grade</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {students.map((student) => (
                                <tr key={student.id} className="group hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{student.name}</div>
                                                <div className="text-xs text-muted-foreground font-mono">{student.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3" /> {student.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20">
                                            {student.grade} - {student.classMatch}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${student.status === "Active"
                                                ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20"
                                                : student.status === "Absent"
                                                    ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20"
                                                    : "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20"
                                                }`}
                                        >
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-muted-foreground hover:text-foreground">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
