"use client";

import { useEffect, useState } from "react";
import { Plus, MoreVertical, Users, Clock, ArrowRight, Search, Edit2, Trash2, X } from "lucide-react";
import { SchoolClass } from "@/lib/types";
import { api } from "@/services/api";
import { Modal } from "@/components/Modal";
import { AddClassForm } from "@/components/forms/AddClassForm";
import Link from "next/link";

export default function ClassesPage() {
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const data = await api.getClasses();
            setClasses(data);
        } catch (error) {
            console.error("Failed to load classes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (newClassData: Omit<SchoolClass, "id"> | Partial<SchoolClass>) => {
        try {
            await api.getClasses(); // Trigger server refresh
            setIsAddOpen(false);
            fetchClasses();
        } catch (error) {
            console.error("Failed to add class", error);
        }
    };

    const handleEditClass = async (updatedData: Omit<SchoolClass, "id"> | Partial<SchoolClass>) => {
        if (!editingClass) return;

        try {
            const updated = await api.updateClass(editingClass.id.toString(), updatedData as Partial<SchoolClass>);
            setClasses(classes.map((c) => (c.id === updated.id ? updated : c)));
            setIsEditOpen(false);
            setEditingClass(null);
        } catch (error) {
            console.error("Failed to update class", error);
            alert("Failed to update class. Please try again.");
        }
    };

    const handleDeleteClass = async (id: string | number) => {
        if (!confirm("Are you sure you want to delete this class? Students will be unlinked.")) return;

        try {
            await api.deleteClass(id.toString());
            setClasses(classes.filter((c) => c.id !== id));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Failed to delete class", error);
            alert("Failed to delete class. Please try again.");
        }
    };

    const openEditModal = (cls: SchoolClass) => {
        setEditingClass(cls);
        setIsEditOpen(true);
        setOpenMenuId(null);
    };

    const filteredClasses = classes.filter(
        (cls) =>
            cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Active Classes</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Class
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-card p-4 border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search classes by name, teacher or grade..."
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

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Class">
                <AddClassForm onCancel={() => setIsAddOpen(false)} onSubmit={handleAddClass} />
            </Modal>

            {editingClass && (
                <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Class">
                    <AddClassForm
                        onCancel={() => setIsEditOpen(false)}
                        onSubmit={handleEditClass}
                        initialData={editingClass}
                    />
                </Modal>
            )}

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <p className="text-muted-foreground">
                        {searchQuery ? "No classes found matching your search." : "No classes found. Add your first class!"}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredClasses.map((cls) => (
                        <div key={cls.id} className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md cursor-pointer">
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${cls.color}`}></div>
                            <div className="p-6 pl-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                                        {cls.grade}
                                    </span>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === cls.id ? null : cls.id)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                        {openMenuId === cls.id && (
                                            <div className="absolute right-0 mt-2 w-36 bg-popover border border-border rounded-md shadow-lg z-10">
                                                <button
                                                    onClick={() => openEditModal(cls)}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClass(cls.id)}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1">{cls.name}</h3>
                                <p className="text-sm text-muted-foreground mb-6">by {cls.teacherName}</p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>{cls.studentsCount} Students</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>{cls.time}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="font-medium">Progress</span>
                                            <span className="text-muted-foreground">{cls.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${cls.color}`}
                                                style={{ width: `${cls.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                        <Link href={`/classes/${cls.id}/attendance`} className="flex items-center hover:underline">
                                            Take Attendance <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
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
