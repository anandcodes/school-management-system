"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertTriangle, DollarSign } from "lucide-react";
import { FeeRecord } from "@/lib/types";
import { api } from "@/services/api";

export default function FeesPage() {
    const [fees, setFees] = useState<FeeRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const data = await api.getFeeRecords();
                setFees(data);
            } catch (error) {
                console.error("Failed to load fees", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'text-green-600 bg-green-50 border-green-200';
            case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Overdue': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const handlePay = async (id: string) => {
        if (!confirm("Are you sure you want to mark this fee as paid?")) return;

        // Optimistic UI update
        setFees(prev => prev.map(f => f.id === id ? { ...f, status: 'Paid' } : f));

        try {
            await api.payFee(id);
        } catch (error) {
            console.error("Payment failed", error);
            // Revert changes if needed, for now we assume success
        }
    };

    const filteredFees = fees.filter(f => filter === 'All' || f.status === filter);

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" /></div>;

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

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
                {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === status
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-muted'
                            }`}
                    >
                        {status}
                    </button>
                ))}
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
                            {filteredFees.length > 0 ? (
                                filteredFees.map((record) => (
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
                                                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded text-xs font-medium"
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
        </div>
    );
}
