import React from 'react';
import { Bill } from '@/types';

interface PrintViewProps {
    bills: Bill[];
}

export const PrintView: React.FC<PrintViewProps> = ({ bills }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(Number(amount));
    };

    return (
        <div className="hidden print:block print:p-8">
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 1cm;
                        size: A4 landscape;
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>

            {/* Print Table - Only table, no header or footer */}
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b-2 border-slate-900">
                        <th className="text-left py-2 px-2 font-bold text-slate-900">Company</th>
                        <th className="text-left py-2 px-2 font-bold text-slate-900">Bill #</th>
                        <th className="text-left py-2 px-2 font-bold text-slate-900">Date</th>
                        <th className="text-right py-2 px-2 font-bold text-slate-900">Amount</th>
                        <th className="text-left py-2 px-2 font-bold text-slate-900">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map((bill, index) => (
                        <tr
                            key={bill.id}
                            className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                        >
                            <td className="py-2 px-2 text-slate-900 font-medium border-b border-slate-200">
                                {bill.companyName}
                            </td>
                            <td className="py-2 px-2 text-slate-700 font-mono text-xs border-b border-slate-200">
                                {bill.billNumber}
                            </td>
                            <td className="py-2 px-2 text-slate-700 border-b border-slate-200">
                                {formatDate(bill.date)}
                            </td>
                            <td className="py-2 px-2 text-slate-900 font-bold text-right border-b border-slate-200">
                                {formatCurrency(bill.amount)}
                            </td>
                            <td className="py-2 px-2 text-slate-700 border-b border-slate-200">
                                {bill.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="border-t-2 border-slate-900">
                        <td colSpan={3} className="py-3 px-2 text-right font-bold text-slate-900">
                            Total Amount:
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-slate-900 text-lg">
                            {formatCurrency(
                                bills.reduce((sum, bill) => sum + Number(bill.amount), 0)
                            )}
                        </td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};
