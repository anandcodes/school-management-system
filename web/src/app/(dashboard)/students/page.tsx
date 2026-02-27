"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, X } from "lucide-react";
import { Student } from "@/lib/types";
import { api } from "@/services/api";
import { Modal } from "@/components/ui/Modal";
import { AddStudentForm } from "@/components/forms/AddStudentForm";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudents();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, searchQuery, statusFilter]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [searchQuery, statusFilter]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await api.getStudentsPaginated(page, limit, searchQuery, statusFilter);
            setStudents(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            console.error("Failed to fetch students", error);
            toast.error("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSuccess = () => {
        toast.success("Student added successfully!");
        setIsAddOpen(false);
        fetchStudents();
    };

    const handleEditSubmit = async (updatedData: any) => {
        if (!editingStudent) return;

        try {
            await api.updateStudent(editingStudent.id, updatedData as Partial<Student>);
            toast.success("Student updated successfully!");
            setIsEditOpen(false);
            setEditingStudent(null);
            fetchStudents();
        } catch (error) {
            console.error("Error updating student:", error);
            toast.error("Failed to update student. Please try again.");
        }
    };

    const handleDelete = async (id: string) => {
        const studentToDelete = students.find(s => s.id === id);
        if (!studentToDelete) return;

        if (window.confirm(`Are you sure you want to delete ${studentToDelete.name}? This action cannot be undone.`)) {
            try {
                await api.deleteStudent(id);
                toast.success(`${studentToDelete.name} deleted successfully!`);
                fetchStudents();
            } catch (error) {
                console.error("Error deleting student:", error);
                toast.error("Failed to delete student. Please try again.");
            }
        }
        setOpenMenuId(null);
    };

    const openEditModal = (student: Student) => {
        setEditingStudent(student);
        setIsEditOpen(true);
        setOpenMenuId(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 text-sm font-medium shadow transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add Student
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search students..."
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
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    {["All", "Active", "Absent", "Suspended"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${statusFilter === status
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : students.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <div className="mx-auto h-12 w-12 text-muted-foreground/50 flex items-center justify-center rounded-full bg-muted mb-4">
                        <UserIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">No students found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                        {searchQuery || statusFilter !== "All"
                            ? "Try adjusting your search or filters to find what you're looking for."
                            : "Get started by adding your first student to the system."}
                    </p>
                    {(searchQuery || statusFilter !== "All") && (
                        <button
                            onClick={() => { setSearchQuery(""); setStatusFilter("All"); }}
                            className="mt-4 text-primary text-sm font-medium hover:underline"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {students.map((student) => (
                        <div key={student.id} className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === student.id ? null : student.id)}
                                    className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                                {openMenuId === student.id && (
                                    <div className="absolute right-0 top-8 w-32 rounded-md border border-border bg-popover shadow-md z-10 animate-in fade-in zoom-in-95 duration-200">
                                        <button
                                            onClick={() => openEditModal(student)}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                                        >
                                            <Edit2 className="h-3 w-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student.id)}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                                        >
                                            <Trash2 className="h-3 w-3" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-4">
                                    {student.name.charAt(0)}
                                </div>
                                <h3 className="font-semibold text-lg">{student.name}</h3>
                                <p className="text-sm text-muted-foreground mb-1">{student.id}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                        student.status === "Absent" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    }`}>
                                    {student.status}
                                </span>

                                <div className="mt-6 w-full grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                                        <span className="text-muted-foreground text-xs">Grade</span>
                                        <span className="font-medium">{student.grade}</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                                        <span className="text-muted-foreground text-xs">Class</span>
                                        <span className="font-medium">{student.classMatch || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && students.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    isLoading={loading}
                />
            )}

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Student">
                <AddStudentForm onSubmit={handleAddSuccess} onCancel={() => setIsAddOpen(false)} />
            </Modal>

            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student">
                <AddStudentForm
                    initialData={editingStudent}
                    onSubmit={handleEditSubmit}
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
