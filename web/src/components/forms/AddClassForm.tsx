"use client";

import { useState, useEffect } from "react";
import { SchoolClass } from "@/lib/types";

interface AddClassFormProps {
    onCancel: () => void;
    onSubmit: (cls: Omit<SchoolClass, "id"> | Partial<SchoolClass>) => void;
    initialData?: SchoolClass | null;
}

export function AddClassForm({ onCancel, onSubmit, initialData }: AddClassFormProps) {
    const [formData, setFormData] = useState<Omit<SchoolClass, "id">>({
        name: "",
        grade: "",
        teacherName: "",
        studentsCount: 0,
        time: "",
        progress: 0,
        color: "bg-blue-500",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                grade: initialData.grade || "",
                teacherName: initialData.teacherName || "",
                studentsCount: initialData.studentsCount || 0,
                time: initialData.time || "",
                progress: initialData.progress || 0,
                color: initialData.color || "bg-blue-500",
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
                <label htmlFor="name" className="text-sm font-medium">Class Name</label>
                <input
                    id="name"
                    required
                    placeholder="e.g. Mathematics 101"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="time" className="text-sm font-medium">Time</label>
                    <input
                        id="time"
                        required
                        type="time"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="teacherName" className="text-sm font-medium">Teacher Name</label>
                <input
                    id="teacherName"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="studentsCount" className="text-sm font-medium">Students Enrolled</label>
                <input
                    id="studentsCount"
                    type="number"
                    min="0"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: parseInt(e.target.value) || 0 })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Class Color</label>
                <div className="flex gap-2">
                    {["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-yellow-500", "bg-red-500"].map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setFormData({ ...formData, color })}
                            className={`w-6 h-6 rounded-full ${color} ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                        />
                    ))}
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
                    Save Class
                </button>
            </div>
        </form>
    );
}
