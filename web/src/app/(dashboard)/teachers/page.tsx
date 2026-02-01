"use client";

import { useEffect, useState } from "react";
import { Plus, Mail, MoreVertical, Search, Edit2, Trash2, X } from "lucide-react";
import { Teacher } from "@/lib/types";
import { api } from "@/services/api";
import { Modal } from "@/components/Modal";
import { AddTeacherForm } from "@/components/forms/AddTeacherForm";
import { toast } from "sonner";

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

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

    const handleAddTeacher = async (newTeacherData: Omit<Teacher, "id"> | Partial<Teacher>) => {
        try {
            await api.getTeachers(); // Trigger server refresh
            setIsAddOpen(false);
            fetchTeachers();
        } catch (error) {
            console.error("Failed to add teacher", error);
        }
    };

    const handleEditTeacher = async (updatedData: Omit<Teacher, "id"> | Partial<Teacher>) => {
        if (!editingTeacher) return;

        try {
            const updated = await api.updateTeacher(editingTeacher.id.toString(), updatedData as Partial<Teacher>);
            setTeachers(teachers.map((t) => (t.id === updated.id ? updated : t)));
            setIsEditOpen(false);
            setEditingTeacher(null);
        } catch (error) {
            console.error("Error updating teacher:", error);
            toast.error("Failed to update teacher. Please try again.");
        }
    };

    const handleDeleteTeacher = async (id: string | number) => {
        if (!confirm("Are you sure you want to delete this teacher? Classes will be unlinked.")) return;

        try {
            await api.deleteTeacher(id.toString());
            setTeachers(teachers.filter((t) => t.id !== id));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Error deleting teacher:", error);
            toast.error("Failed to delete teacher. Please try again.");
        }
    };

    const openEditModal = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setIsEditOpen(true);
        setOpenMenuId(null);
    };

    const filteredTeachers = teachers.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                        placeholder="Search teachers by name, email or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Teacher">
                <AddTeacherForm onCancel={() => setIsAddOpen(false)} onSubmit={handleAddTeacher} />
            </Modal>

            {editingTeacher && (
                <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Teacher">
                    <AddTeacherForm
                        onCancel={() => setIsEditOpen(false)}
                        onSubmit={handleEditTeacher}
                        initialData={editingTeacher}
                    />
                </Modal>
            )}

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <p className="text-muted-foreground">
                        {searchQuery ? "No teachers found matching your search." : "No teachers found. Add your first teacher!"}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTeachers.map((teacher) => (
                        <div key={teacher.id} className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                            <div className="absolute right-4 top-4">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === teacher.id ? null : teacher.id)}
                                    className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                                {openMenuId === teacher.id && (
                                    <div className="absolute right-0 mt-2 w-36 bg-popover border border-border rounded-md shadow-lg z-10">
                                        <button
                                            onClick={() => openEditModal(teacher)}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTeacher(teacher.id)}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-xl font-bold text-primary">
                                    {teacher.name.split(" ").map((n) => n[0]).join("")}
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
