import React from 'react';
import { Bill } from '@/types';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface BillTableProps {
    bills: Bill[];
    onEdit: (bill: Bill) => void;
    onDelete: (id: string) => void;
}

export const BillTable: React.FC<BillTableProps> = ({ bills, onEdit, onDelete }) => {
    if (bills.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200/60">
                <div className="inline-flex bg-slate-100 p-4 rounded-2xl mb-4 text-slate-400">
                    <AlertCircle size={32} strokeWidth={2} />
                </div>
                <p className="text-slate-900 font-semibold text-sm">No bills found</p>
                <p className="text-slate-500 text-xs mt-1">Try adjusting your filters or add a new bill.</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <>
            {/* Desktop Table View - Hidden on Mobile */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200/60">
                            <tr>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider sticky top-0 bg-slate-50 z-10">Company</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider sticky top-0 bg-slate-50 z-10">Bill #</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider sticky top-0 bg-slate-50 z-10">Bill Date</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-right sticky top-0 bg-slate-50 z-10">Amount</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider sticky top-0 bg-slate-50 z-10">Status</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider sticky top-0 bg-slate-50 z-10">Dates</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-right sticky top-0 bg-slate-50 z-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bills.map((bill) => (
                                <tr key={bill.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                                    <td className="px-4 py-3.5 text-sm font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">{bill.companyName}</td>
                                    <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">{bill.billNumber}</td>
                                    <td className="px-4 py-3.5 text-xs text-slate-600">{formatDate(bill.date)}</td>
                                    <td className="px-4 py-3.5 text-sm font-bold text-slate-900 text-right tracking-tight">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(Number(bill.amount))}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            {
                                                'bg-emerald-100 text-emerald-700': bill.status === 'Payment Received',
                                                'bg-amber-100 text-amber-700': bill.status === 'Pending',
                                                'bg-blue-100 text-blue-700': bill.status === 'Submitted',
                                            }
                                        )}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="text-[10px] text-slate-500 space-y-0.5">
                                            <div className="flex items-center gap-1">
                                                <span className="text-slate-400 font-semibold">Created:</span>
                                                <span className="font-medium">{formatDate(bill.createdDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-slate-400 font-semibold">Updated:</span>
                                                <span className="font-medium">{formatDate(bill.updatedDate)}</span>
                                            </div>
                                            {bill.paymentReceivedDate && (
                                                <div className="flex items-center gap-1 text-emerald-600">
                                                    <span className="font-semibold">Paid:</span>
                                                    <span className="font-medium">{formatDate(bill.paymentReceivedDate)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-right space-x-1">
                                        <button
                                            onClick={() => onEdit(bill)}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} strokeWidth={2.5} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(bill.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} strokeWidth={2.5} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >

            {/* Mobile Card View - Visible only on Mobile */}
            < div className="md:hidden space-y-3" >
                {
                    bills.map((bill) => (
                        <div
                            key={bill.id}
                            className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 hover:shadow-md transition-all duration-200"
                        >
                            {/* Header with Company and Amount */}
                            <div className="flex items-start justify-between mb-3 pb-3 border-b border-slate-100">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-slate-900 truncate">{bill.companyName}</h3>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">{bill.billNumber}</p>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="text-lg font-bold text-slate-900 tracking-tight">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(Number(bill.amount))}
                                    </p>
                                </div>
                            </div>

                            {/* Status and Date */}
                            <div className="flex items-center justify-between mb-3">
                                <span className={clsx(
                                    "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                                    {
                                        'bg-emerald-100 text-emerald-700': bill.status === 'Payment Received',
                                        'bg-amber-100 text-amber-700': bill.status === 'Pending',
                                        'bg-blue-100 text-blue-700': bill.status === 'Submitted',
                                    }
                                )}>
                                    {bill.status}
                                </span>
                                <span className="text-xs text-slate-600 font-medium">{formatDate(bill.date)}</span>
                            </div>

                            {/* Dates Information */}
                            <div className="bg-slate-50 rounded-lg p-3 mb-3 space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-semibold">Created:</span>
                                    <span className="text-slate-700 font-medium">{formatDate(bill.createdDate)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-semibold">Updated:</span>
                                    <span className="text-slate-700 font-medium">{formatDate(bill.updatedDate)}</span>
                                </div>
                                {bill.paymentReceivedDate && (
                                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                                        <span className="text-emerald-600 font-semibold">Paid:</span>
                                        <span className="text-emerald-700 font-medium">{formatDate(bill.paymentReceivedDate)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(bill)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-semibold text-sm"
                                >
                                    <Edit2 size={16} strokeWidth={2.5} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(bill.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-semibold text-sm"
                                >
                                    <Trash2 size={16} strokeWidth={2.5} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div >
        </>
    );
};
