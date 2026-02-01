"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, Mail, X } from "lucide-react";
import { Student } from "@/lib/types";
import { api } from "@/services/api";
import { Modal } from "@/components/Modal";
import { AddStudentForm } from "@/components/forms/AddStudentForm";

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        filterStudents();
    }, [students, searchQuery, statusFilter]);

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

    const filterStudents = () => {
        let filtered = [...students];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "All") {
            filtered = filtered.filter((s) => s.status === statusFilter);
        }

        setFilteredStudents(filtered);
    };

    const handleAddStudent = async (newStudentData: Omit<Student, "id"> | Partial<Student>) => {
        try {
            await api.getStudents(); // This will trigger POST via form
            setIsAddOpen(false);
            fetchStudents(); // Refresh list
        } catch (error) {
            console.error("Failed to add student", error);
        }
    };

    const handleEditStudent = async (updatedData: Omit<Student, "id"> | Partial<Student>) => {
        if (!editingStudent) return;

        try {
            const updated = await api.updateStudent(editingStudent.id, updatedData as Partial<Student>);
            setStudents(students.map((s) => (s.id === updated.id ? updated : s)));
            setIsEditOpen(false);
            setEditingStudent(null);
        } catch (error) {
            console.error("Failed to update student", error);
            alert("Failed to update student. Please try again.");
        }
    };

    const handleDeleteStudent = async (id: string) => {
        if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;

        try {
            await api.deleteStudent(id);
            setStudents(students.filter((s) => s.id !== id));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Failed to delete student", error);
            alert("Failed to delete student. Please try again.");
        }
    };

    const openEditModal = (student: Student) => {
        setEditingStudent(student);
        setIsEditOpen(true);
        setOpenMenuId(null);
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

            {editingStudent && (
                <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student">
                    <AddStudentForm
                        onCancel={() => setIsEditOpen(false)}
                        onSubmit={handleEditStudent}
                        initialData={editingStudent}
                    />
                </Modal>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-lg bg-card p-4 border border-border shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search students..."
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
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Absent">Absent</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
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
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        {searchQuery || statusFilter !== "All"
                                            ? "No students found matching your filters."
                                            : "No students found. Add your first student!"}
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
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
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === student.id ? null : student.id)}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                            {openMenuId === student.id && (
                                                <div className="absolute right-0 mt-2 w-36 bg-popover border border-border rounded-md shadow-lg z-10">
                                                    <button
                                                        onClick={() => openEditModal(student)}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStudent(student.id)}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
