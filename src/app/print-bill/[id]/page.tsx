"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useBills } from '@/hooks/useBills';
import { Bill } from '@/types';
import Image from 'next/image';

export default function PrintBillPage() {
    const params = useParams();
    const { bills, isLoaded } = useBills();
    const [bill, setBill] = useState<Bill | null>(null);

    useEffect(() => {
        if (isLoaded && params?.id) {
            const foundBill = bills.find(b => b.id === params.id);
            setBill(foundBill || null);
        }
    }, [isLoaded, params?.id, bills]);

    useEffect(() => {
        if (bill) {
            // Auto-print when bill is loaded
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [bill]);

    if (!isLoaded) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!bill) {
        return <div className="p-8 text-center text-red-600">Bill not found</div>;
    }

    return (
        <div className="bg-white min-h-screen text-slate-900 font-sans p-8 print:p-0">
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>

            <div className="max-w-3xl mx-auto border border-slate-200 shadow-lg print:shadow-none print:border-0 p-8 print:p-8 bg-white">

                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">TSL</h1>

                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-widest">Invoice</h2>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Bill No:</span> {bill.billNumber}</p>
                            <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Date:</span> {new Date(bill.date).toLocaleDateString('en-IN')}</p>
                            <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Status:</span> {bill.status}</p>
                        </div>
                    </div>
                </div>

                {/* Bill To Section */}
                <div className="mb-10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bill To</h3>
                    <div className="text-lg font-bold text-slate-900">{bill.companyName}</div>
                </div>

                {/* Bill Details Table */}
                <div className="mb-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="py-3 text-sm font-bold text-slate-600 uppercase tracking-wider">Description</th>
                                <th className="py-3 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-100">
                                <td className="py-4 text-slate-900 font-medium">
                                    Service / Product Charges for Invoice #{bill.billNumber}
                                </td>
                                <td className="py-4 text-slate-900 font-bold text-right">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(bill.amount))}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="pt-6 text-right text-sm font-bold text-slate-600 uppercase tracking-wider">Total Amount</td>
                                <td className="pt-6 text-right text-2xl font-bold text-slate-900">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(bill.amount))}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="font-bold text-slate-900">Thank you for your business!</p>
                        <p className="text-sm text-slate-500 mt-1">Please make checks payable to TSL</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end">
                        <div className="h-12 w-auto relative mb-2">
                            {/* Signature placeholder or company stamp could go here */}
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Authorized Signature</p>
                    </div>
                </div>

                {/* No Print Button */}
                <div className="mt-12 text-center print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all"
                    >
                        Print Invoice
                    </button>
                    <p className="text-xs text-slate-400 mt-3">Press default print button if dialog doesn't appear.</p>
                </div>

            </div>
        </div>
    );
}
