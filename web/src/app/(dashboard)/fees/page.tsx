"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertTriangle, DollarSign, Search, X } from "lucide-react";
import { FeeRecord } from "@/lib/types";
import { api } from "@/services/api";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";

export default function FeesPage() {
    const [fees, setFees] = useState<FeeRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchFees();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, searchQuery, filter]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, filter]);

    const fetchFees = async () => {
        setLoading(true);
        try {
            const response = await api.getFeesPaginated(page, limit, searchQuery, filter);
            setFees(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            console.error("Failed to load fees", error);
            toast.error("Failed to load fees");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400';
            case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400';
            case 'Overdue': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
        }
    };

    const handlePay = async (id: string) => {
        if (!confirm("Are you sure you want to mark this fee as paid?")) return;

        // Optimistic UI update
        const originalFees = [...fees];
        setFees(prev => prev.map(f => f.id === id ? { ...f, status: 'Paid' } : f));

        try {
            await api.payFee(id);
            toast.success("Fee marked as paid");
            fetchFees();
        } catch (error) {
            console.error("Payment failed", error);
            toast.error("Payment failed");
            setFees(originalFees);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
                <div className="flex gap-2">
                    <div className="bg-card px-4 py-2 border border-border rounded-md shadow-sm">
                        <span className="text-xs text-muted-foreground block">Total Collected</span>
                        <span className="font-bold text-lg text-green-600">$45,200</span>
                    </div>
                    <div className="bg-card px-4 py-2 border border-border rounded-md shadow-sm">
                        <span className="text-xs text-muted-foreground block">Pending</span>
                        <span className="font-bold text-lg text-amber-600">$12,800</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
                {/* Filter Tabs */}
                <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto w-full sm:w-auto">
                    {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status as any)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === status
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search student..."
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
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Fee Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" /></div>
                                    </td>
                                </tr>
                            ) : fees.length > 0 ? (
                                fees.map((record) => (
                                    <tr key={record.id} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{record.studentName}</div>
                                            <div className="text-xs text-muted-foreground">ID: {record.studentId}</div>
                                        </td>
                                        <td className="px-6 py-4">{record.type}</td>
                                        <td className="px-6 py-4 font-semibold">${record.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">{new Date(record.dueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {record.status !== 'Paid' ? (
                                                <button
                                                    onClick={() => handlePay(record.id)}
                                                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded text-xs font-medium transition-colors"
                                                >
                                                    Pay Now
                                                </button>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        No fee records found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!loading && fees.length > 0 && (
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
