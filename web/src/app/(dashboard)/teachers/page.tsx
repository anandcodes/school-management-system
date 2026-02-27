"use client";

import { useEffect, useState } from "react";
import { Plus, Mail, MoreVertical, Search, Edit2, Trash2, X } from "lucide-react";
import { Teacher } from "@/lib/types";
import { api } from "@/services/api";
import { Modal } from "@/components/ui/Modal";
import { AddTeacherForm } from "@/components/forms/AddTeacherForm";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTeachers();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await api.getTeachersPaginated(page, limit, searchQuery);
            setTeachers(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            console.error("Failed to load teachers", error);
            toast.error("Failed to load teachers");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTeacher = async (newTeacherData: Omit<Teacher, "id"> | Partial<Teacher>) => {
        try {
            const res = await fetch('/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTeacherData),
            });

            if (res.ok) {
                toast.success("Teacher added successfully!");
                setIsAddOpen(false);
                fetchTeachers();
            } else {
                toast.error("Failed to add teacher");
            }
        } catch (error) {
            console.error("Error adding teacher:", error);
            toast.error("Failed to add teacher");
        }
    };

    const handleEditTeacher = async (updatedData: Omit<Teacher, "id"> | Partial<Teacher>) => {
        if (!editingTeacher) return;
        try {
            await api.updateTeacher(String(editingTeacher.id), updatedData as Partial<Teacher>);
            toast.success("Teacher updated successfully!");
            setIsEditOpen(false);
            setEditingTeacher(null);
            fetchTeachers();
        } catch (error) {
            console.error("Error updating teacher:", error);
            toast.error("Failed to update teacher");
        }
    };

    const handleDeleteTeacher = async (id: string) => {
        if (confirm("Are you sure you want to delete this teacher?")) {
            try {
                await api.deleteTeacher(id);
                toast.success("Teacher deleted successfully!");
                fetchTeachers();
            } catch (error) {
                console.error("Error deleting teacher:", error);
                toast.error("Failed to delete teacher");
            }
        }
        setOpenMenuId(null);
    };

    const openEditModal = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setIsEditOpen(true);
        setOpenMenuId(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 text-sm font-medium shadow transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add Teacher
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search teachers..."
                    className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : teachers.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <div className="mx-auto h-12 w-12 text-muted-foreground/50 flex items-center justify-center rounded-full bg-muted mb-4">
                        <UserIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">No teachers found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                        Try adjusting your search or add a new teacher to get started.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {teachers.map((teacher) => (
                        <div key={teacher.id} className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === String(teacher.id) ? null : String(teacher.id))}
                                    className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                                {openMenuId === String(teacher.id) && (
                                    <div className="absolute right-0 top-8 w-32 rounded-md border border-border bg-popover shadow-md z-10 animate-in fade-in zoom-in-95 duration-200">
                                        <button
                                            onClick={() => openEditModal(teacher)}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                                        >
                                            <Edit2 className="h-3 w-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTeacher(String(teacher.id))}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                                        >
                                            <Trash2 className="h-3 w-3" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-4">
                                    {teacher.name.charAt(0)}
                                </div>
                                <h3 className="font-semibold text-lg">{teacher.name}</h3>
                                <p className="text-sm text-primary font-medium mb-1">{teacher.subject}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <Mail className="h-3 w-3" />
                                    {teacher.email}
                                </div>

                                <div className="mt-6 w-full flex justify-between gap-2 text-sm">
                                    <div className="flex flex-col items-center flex-1 p-2 rounded-lg bg-muted/50">
                                        <span className="text-muted-foreground text-xs">Classes</span>
                                        <span className="font-medium">{teacher.classesCount || 0}</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1 p-2 rounded-lg bg-muted/50">
                                        <span className="text-muted-foreground text-xs">Students</span>
                                        <span className="font-medium">{teacher.studentsCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && teachers.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    isLoading={loading}
                />
            )}

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Teacher">
                <AddTeacherForm onSubmit={handleAddTeacher} onCancel={() => setIsAddOpen(false)} />
            </Modal>

            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Teacher">
                <AddTeacherForm
                    initialData={editingTeacher}
                    onSubmit={handleEditTeacher}
                    onCancel={() => setIsEditOpen(false)}
                />
            </Modal>
        </div>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
