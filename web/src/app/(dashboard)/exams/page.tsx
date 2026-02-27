"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, BookOpen, User, Calendar, X, Plus } from "lucide-react";
import { Exam } from "@/lib/types";
import { api } from "@/services/api";
import { Pagination } from "@/components/ui/Pagination";
import { toast } from "sonner"; // Assuming sonner is available

export default function ExamsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 9; // Grid layout usually fits 3x3 nicely

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchExams();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const fetchExams = async () => {
        // Only set loading true if it's the first load or drastic change, otherwise skeletons are better
        if (exams.length === 0) setLoading(true);
        try {
            const response = await api.getExamsPaginated(page, limit, searchQuery);
            setExams(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            console.error("Failed to load exams", error);
            toast.error("Failed to load exams");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Exams & Grades</h1>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium shadow hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <Plus className="h-4 w-4" /> New Exam
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search exams..."
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
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                </div>
            ) : exams.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <div className="mx-auto h-12 w-12 text-muted-foreground/50 flex items-center justify-center rounded-full bg-muted mb-4">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">No exams found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                        Try adjusting your search or add a new exam to get started.
                    </p>
                </div>
            ) : (
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
            )}

            {!loading && exams.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    isLoading={loading}
                />
            )}
        </div>
    );
}
