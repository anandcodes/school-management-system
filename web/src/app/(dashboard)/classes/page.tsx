"use client";

import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Users, Clock, ArrowRight, Search } from "lucide-react";
import { SchoolClass } from "@/lib/types";
import { api } from "@/services/api";
import { Modal } from "@/components/Modal";
import { AddClassForm } from "@/components/forms/AddClassForm";
import Link from "next/link";

export default function ClassesPage() {
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
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
        fetchClasses();
    }, []);

    const handleAddClass = (newClassData: Omit<SchoolClass, "id">) => {
        const newClass: SchoolClass = {
            ...newClassData,
            id: Math.floor(Math.random() * 10000)
        };
        setClasses([...classes, newClass]);
        setIsAddOpen(false);
    };

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <div className="hidden sm:flex bg-muted/50 p-1 rounded-lg">
                        <button className="px-4 py-1.5 rounded-md bg-background shadow-sm text-sm font-medium text-foreground">All</button>
                        <button className="px-4 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground">My Classes</button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-card p-4 border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search classes by name or teacher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Class">
                <AddClassForm onCancel={() => setIsAddOpen(false)} onSubmit={handleAddClass} />
            </Modal>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
                                    <button className="text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
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
