"use client";

import { useEffect, useState } from "react";
import { Plus, MoreVertical, Search, Edit2, Trash2, X, Clock, Users, BookOpen } from "lucide-react";
import { SchoolClass } from "@/lib/types";
import { api } from "@/services/api";
import { Modal } from "@/components/Modal";
import { AddClassForm } from "@/components/forms/AddClassForm";
import { toast } from "sonner";
import { Pagination } from "@/components/Pagination";

export default function ClassesPage() {
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchClasses();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await api.getClassesPaginated(page, limit, searchQuery);
            setClasses(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            console.error("Failed to load classes", error);
            toast.error("Failed to load classes");
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (newClassData: Omit<SchoolClass, "id"> | Partial<SchoolClass>) => {
        try {
            const res = await fetch('/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClassData),
            });

            if (res.ok) {
                toast.success("Class added successfully!");
                setIsAddOpen(false);
                fetchClasses();
            } else {
                toast.error("Failed to add class");
            }
        } catch (error) {
            console.error("Error adding class:", error);
            toast.error("Failed to add class");
        }
    };

    const handleEditClass = async (updatedData: Omit<SchoolClass, "id"> | Partial<SchoolClass>) => {
        if (!editingClass) return;
        try {
            await api.updateClass(editingClass.id, updatedData as Partial<SchoolClass>);
            toast.success("Class updated successfully!");
            setIsEditOpen(false);
            setEditingClass(null);
            fetchClasses();
        } catch (error) {
            console.error("Error updating class:", error);
            toast.error("Failed to update class");
        }
    };

    const handleDeleteClass = async (id: string) => {
        if (confirm("Are you sure you want to delete this class?")) {
            try {
                await api.deleteClass(id);
                toast.success("Class deleted successfully!");
                fetchClasses();
            } catch (error) {
                console.error("Error deleting class:", error);
                toast.error("Failed to delete class");
            }
        }
        setOpenMenuId(null);
    };

    const openEditModal = (cls: SchoolClass) => {
        setEditingClass(cls);
        setIsEditOpen(true);
        setOpenMenuId(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 text-sm font-medium shadow transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add Class
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search classes..."
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
            ) : classes.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <div className="mx-auto h-12 w-12 text-muted-foreground/50 flex items-center justify-center rounded-full bg-muted mb-4">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">No classes found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                        Try adjusting your search or add a new class to get started.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {classes.map((cls) => (
                        <div key={cls.id} className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === cls.id ? null : cls.id)}
                                    className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                                {openMenuId === cls.id && (
                                    <div className="absolute right-0 top-8 w-32 rounded-md border border-border bg-popover shadow-md z-10 animate-in fade-in zoom-in-95 duration-200">
                                        <button
                                            onClick={() => openEditModal(cls)}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                                        >
                                            <Edit2 className="h-3 w-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClass(cls.id)}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                                        >
                                            <Trash2 className="h-3 w-3" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col h-full">
                                <div className={`h-2 w-12 rounded-full mb-4 ${cls.color}`} />
                                <h3 className="font-semibold text-lg">{cls.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{cls.grade} • {cls.teacherName}</p>

                                <div className="mt-auto grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{cls.studentsCount || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{cls.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && classes.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    isLoading={loading}
                />
            )}

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Class">
                <AddClassForm onSubmit={handleAddClass} onCancel={() => setIsAddOpen(false)} />
            </Modal>

            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Class">
                <AddClassForm
                    initialData={editingClass}
                    onSubmit={handleEditClass}
                    onCancel={() => setIsEditOpen(false)}
                />
            </Modal>
        </div>
    );
}
