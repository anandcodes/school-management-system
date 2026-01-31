"use client";

import { useEffect, useState } from "react";
import { Plus, Mail, MoreVertical, Search } from "lucide-react";
import { Teacher } from "@/lib/types";
import { api } from "@/services/api";
import { Modal } from "@/components/Modal";
import { AddTeacherForm } from "@/components/forms/AddTeacherForm";

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const data = await api.getTeachers();
                setTeachers(data);
            } catch (error) {
                console.error("Failed to load teachers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    const handleAddTeacher = (newTeacherData: Omit<Teacher, "id">) => {
        const newTeacher: Teacher = {
            ...newTeacherData,
            id: Math.floor(Math.random() * 10000)
        };
        setTeachers([...teachers, newTeacher]);
        setIsAddOpen(false);
    };

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Teacher
                </button>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-card p-4 border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search teachers by name or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Teacher">
                <AddTeacherForm onCancel={() => setIsAddOpen(false)} onSubmit={handleAddTeacher} />
            </Modal>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTeachers.map((teacher) => (
                        <div key={teacher.id} className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                                <button className="text-muted-foreground hover:text-foreground">
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-xl font-bold text-primary">
                                    {teacher.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg leading-none">{teacher.name}</h3>
                                    <span className="text-sm text-primary font-medium">{teacher.subject}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                                    <Mail className="h-4 w-4" />
                                    {teacher.email}
                                </div>

                                <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Classes</span>
                                        <span className="font-semibold text-lg">{teacher.classesCount}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Students</span>
                                        <span className="font-semibold text-lg">{teacher.studentsCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
