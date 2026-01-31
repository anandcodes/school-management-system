"use client";

import { useState } from "react";
import { Student } from "@/lib/types";

interface AddStudentFormProps {
    onCancel: () => void;
    onSubmit: (student: Omit<Student, "id">) => void;
}

export function AddStudentForm({ onCancel, onSubmit }: AddStudentFormProps) {
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        grade: string;
        classMatch: string;
        status: "Active" | "Absent" | "Suspended";
    }>({
        name: "",
        email: "",
        grade: "",
        classMatch: "",
        status: "Active",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <input
                    id="name"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input
                    id="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="grade" className="text-sm font-medium">Grade</label>
                    <select
                        id="grade"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    >
                        <option value="">Select Grade</option>
                        <option value="9th">9th</option>
                        <option value="10th">10th</option>
                        <option value="11th">11th</option>
                        <option value="12th">12th</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="classMatch" className="text-sm font-medium">Class</label>
                    <select
                        id="classMatch"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        value={formData.classMatch}
                        onChange={(e) => setFormData({ ...formData, classMatch: e.target.value })}
                    >
                        <option value="">Select Class</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="status"
                            value="Active"
                            checked={formData.status === "Active"}
                            onChange={() => setFormData({ ...formData, status: "Active" })}
                            className="text-primary focus:ring-primary"
                        />
                        Active
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="status"
                            value="Absent"
                            checked={formData.status === "Absent"}
                            onChange={() => setFormData({ ...formData, status: "Absent" })}
                            className="text-primary focus:ring-primary"
                        />
                        Absent
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-muted transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    Save Student
                </button>
            </div>
        </form>
    );
}
