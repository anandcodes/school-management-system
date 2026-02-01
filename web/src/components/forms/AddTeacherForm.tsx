"use client";

import { useState, useEffect } from "react";
import { Teacher } from "@/lib/types";

interface AddTeacherFormProps {
    onCancel: () => void;
    onSubmit: (teacher: Omit<Teacher, "id"> | Partial<Teacher>) => void;
    initialData?: Teacher | null;
}

export function AddTeacherForm({ onCancel, onSubmit, initialData }: AddTeacherFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        classesCount: 0,
        studentsCount: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                email: initialData.email || "",
                subject: initialData.subject || "",
                classesCount: initialData.classesCount || 0,
                studentsCount: initialData.studentsCount || 0,
            });
        }
    }, [initialData]);

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

            <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <input
                    id="subject"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="classesCount" className="text-sm font-medium">Classes Count</label>
                    <input
                        id="classesCount"
                        type="number"
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        value={formData.classesCount}
                        onChange={(e) => setFormData({ ...formData, classesCount: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="studentsCount" className="text-sm font-medium">Students Count</label>
                    <input
                        id="studentsCount"
                        type="number"
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        value={formData.studentsCount}
                        onChange={(e) => setFormData({ ...formData, studentsCount: parseInt(e.target.value) || 0 })}
                    />
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
                    Save Teacher
                </button>
            </div>
        </form>
    );
}
