"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, BookOpen, User, Calendar } from "lucide-react";
import { Exam } from "@/lib/types";
import { api } from "@/services/api";

export default function ExamsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const data = await api.getExams();
                setExams(data);
            } catch (error) {
                console.error("Failed to load exams", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Exams & Grades</h1>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium shadow hover:bg-primary/90 transition-colors">
                    + New Exam
                </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {exams.map((exam) => (
                    <div key={exam.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{exam.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <BookOpen className="h-4 w-4" />
                                    {exam.subject}
                                </div>
                            </div>
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                                {exam.totalMarks} Marks
                            </span>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4 text-purple-500" />
                                <span>Class ID: {exam.classId}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 text-green-500" />
                                <span>{new Date(exam.date).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border flex justify-end">
                            <Link href={`/exams/${exam.id}`} className="text-sm font-medium text-primary cursor-pointer hover:underline flex items-center gap-1">
                                View Results &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
