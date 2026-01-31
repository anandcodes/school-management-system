"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Calculator } from "lucide-react";
import { Exam, ExamResult } from "@/lib/types";
import { api } from "@/services/api";

export default function ExamDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [exam, setExam] = useState<Exam | null>(null);
    const [results, setResults] = useState<ExamResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const examId = params.id as string;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examData, resultsData] = await Promise.all([
                    api.getExamById(examId),
                    api.getExamResults(examId)
                ]);
                setExam(examData || null);
                setResults(resultsData);
            } catch (error) {
                console.error("Failed to load exam details", error);
                setMessage({ type: 'error', text: "Failed to load exam details" });
            } finally {
                setLoading(false);
            }
        };

        if (examId) {
            fetchData();
        }
    }, [examId]);

    const calculateGrade = (marks: number, total: number) => {
        const percentage = (marks / total) * 100;
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        return "F";
    };

    const handleMarkChange = (studentId: string, newMarks: string) => {
        // Allow empty string to clear input
        if (newMarks === "") {
            setResults(prev => prev.map(r => r.studentId === studentId ? { ...r, marksObtained: 0, grade: "F" } : r));
            return;
        }

        const marks = parseFloat(newMarks);
        if (isNaN(marks) || !exam) return;

        // Validation: Prevent marks > totalMarks or < 0
        if (marks < 0 || marks > exam.totalMarks) return;

        setResults(prev => prev.map(r => {
            if (r.studentId === studentId) {
                return {
                    ...r,
                    marksObtained: marks,
                    grade: calculateGrade(marks, exam.totalMarks)
                };
            }
            return r;
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await api.saveExamResults(examId, results);
            setMessage({ type: 'success', text: "Results saved successfully!" });
        } catch (error) {
            console.error("Failed to save results", error);
            setMessage({ type: 'error', text: "Failed to save results. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    if (!exam) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-destructive">Exam not found</h2>
                <button onClick={() => router.back()} className="text-primary hover:underline mt-4">Go Back</button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-accent rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{exam.title}</h1>
                    <p className="text-muted-foreground">{exam.subject} • {new Date(exam.date).toLocaleDateString()}</p>
                </div>
                <div className="ml-auto flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg border border-primary/10">
                    <span className="font-semibold text-primary">Total Marks: {exam.totalMarks}</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['A', 'B', 'C', 'D', 'F'].map((grade) => {
                    const count = results.filter(r => r.grade.startsWith(grade)).length;
                    const percentage = Math.round((count / results.length) * 100) || 0;
                    let color = "bg-gray-100 text-gray-700";
                    if (grade === 'A') color = "bg-green-100 text-green-700 border-green-200";
                    if (grade === 'B') color = "bg-blue-100 text-blue-700 border-blue-200";
                    if (grade === 'C') color = "bg-yellow-100 text-yellow-700 border-yellow-200";
                    if (grade === 'D') color = "bg-orange-100 text-orange-700 border-orange-200";
                    if (grade === 'F') color = "bg-red-100 text-red-700 border-red-200";

                    return (
                        <div key={grade} className={`p-4 rounded-xl border ${color} flex flex-col items-center justify-center`}>
                            <span className="text-2xl font-bold">{count}</span>
                            <span className="text-xs font-medium opacity-80">Grade {grade} ({percentage}%)</span>
                        </div>
                    );
                })}
            </div>

            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-purple-500" />
                        Enter Marks
                    </h2>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium shadow hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Results
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr className="text-left">
                                <th className="p-4 font-medium text-muted-foreground w-1/3">Student Name</th>
                                <th className="p-4 font-medium text-muted-foreground w-1/4">Student ID</th>
                                <th className="p-4 font-medium text-muted-foreground w-1/4">Marks Obtained</th>
                                <th className="p-4 font-medium text-muted-foreground w-1/6">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {results.map((result) => (
                                <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium">{result.studentName}</td>
                                    <td className="p-4 text-muted-foreground text-sm">{result.studentId}</td>
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            min="0"
                                            max={exam.totalMarks}
                                            value={result.marksObtained}
                                            onChange={(e) => handleMarkChange(result.studentId, e.target.value)}
                                            className="w-24 p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-right font-mono"
                                        />
                                        <span className="text-muted-foreground ml-2">/ {exam.totalMarks}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${result.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                                            result.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                                result.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                    result.grade === 'D' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}>
                                            {result.grade}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {results.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No students enrolled or results available.
                    </div>
                )}
            </div>
        </div>
    );
}
