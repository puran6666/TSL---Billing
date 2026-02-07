"use client";

import { useState, useMemo } from 'react';
import Image from "next/image";
import { useBills } from '@/hooks/useBills';
import { DashboardStats } from '@/components/DashboardStats';
import { BillForm } from '@/components/BillForm';
import { BillTable } from '@/components/BillTable';
import { SearchBar } from '@/components/SearchBar';
import { DateFilter, DateFilterType } from '@/components/DateFilter';
import { Bill } from '@/types';
import { LayoutDashboard, Plus, X, Printer } from 'lucide-react';

export default function Home() {
  const { bills, addBill, editBill, deleteBill, clearAllBills, isLoaded } = useBills();
  const [editingBill, setEditingBill] = useState<Bill | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Payment Received' | 'Pending' | 'Submitted'>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>('custom');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  // Derived Data
  const uniqueCompanies = useMemo(() => {
    const companies = new Set(bills.map(b => b.companyName));
    return Array.from(companies).sort();
  }, [bills]);

  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const lowerTerm = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        bill.companyName.toLowerCase().includes(lowerTerm) ||
        bill.billNumber.toLowerCase().includes(lowerTerm) ||
        bill.amount.toString().includes(lowerTerm);

      const matchesStatus = statusFilter === 'All' || bill.status === statusFilter;
      const matchesCompany = companyFilter === 'All' || bill.companyName === companyFilter;

      const billDate = new Date(bill.date);
      let matchesDate = true;

      if (dateFilterType === 'month' && selectedMonth && selectedYear) {
        const billMonth = (billDate.getMonth() + 1).toString().padStart(2, '0');
        const billYear = billDate.getFullYear().toString();
        matchesDate = billMonth === selectedMonth && billYear === selectedYear;
      } else if (dateFilterType === 'year' && selectedYear) {
        const billYear = billDate.getFullYear().toString();
        matchesDate = billYear === selectedYear;
      } else if (dateFilterType === 'custom') {
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        const matchesStart = !startDate || billDate >= startDate;
        const matchesEnd = !endDate || billDate <= endDate;
        matchesDate = matchesStart && matchesEnd;
      }

      return matchesSearch && matchesStatus && matchesCompany && matchesDate;
    });
  }, [bills, searchTerm, statusFilter, companyFilter, dateFilterType, selectedMonth, selectedYear, dateRange]);

  const activeFiltersCount = [
    statusFilter !== 'All',
    companyFilter !== 'All',
    dateFilterType === 'month' && (selectedMonth || selectedYear),
    dateFilterType === 'year' && selectedYear,
    dateFilterType === 'custom' && (dateRange.start || dateRange.end)
  ].filter(Boolean).length;

  const clearFilters = () => {
    setStatusFilter('All');
    setCompanyFilter('All');
    setDateFilterType('custom');
    setSelectedMonth('');
    setSelectedYear('');
    setDateRange({ start: '', end: '' });
    setSearchTerm('');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingBill(undefined);
    setShowForm(false);
  };

  const handleFormSubmit = (billData: any) => {
    if (editingBill) {
      editBill(billData);
    } else {
      addBill(billData);
    }
    setEditingBill(undefined);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 flex-shrink-0 shadow-sm print:hidden">
        {/* Top Image */}
        <div className="w-full flex justify-center py-2 bg-slate-50/50 border-b border-slate-100">
          <div className="relative h-16 w-auto aspect-[3/1]">
            <Image
              src="/jai-baba-ki.png"
              alt="Jai Baba Ki"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 md:gap-4 relative">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-gradient-to-br from-slate-900 to-slate-700 p-1.5 md:p-2 rounded-xl text-white shadow-lg shadow-slate-900/20">
              <LayoutDashboard size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={2.5} />
            </div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
              TSL
            </h1>
          </div>

          {/* Centered Image Placeholder / Spacer */}
          <div className="flex flex-1 justify-center items-center px-2 md:px-4 min-w-0">
            {/* Image moved to top */}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:block w-48 md:w-64">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>



            <button
              onClick={() => {
                setEditingBill(undefined);
                setShowForm(!showForm);
              }}
              className="px-3 md:px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-slate-900/20 flex items-center gap-1.5 md:gap-2 hover:shadow-xl"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">{showForm ? 'Close' : 'Add Bill'}</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-3">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </header>

      {/* Dashboard Stats - Sticky */}
      <div className="bg-slate-50 border-b border-slate-200/60 flex-shrink-0 print:hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <DashboardStats bills={filteredBills} />
        </div>
      </div>

      {/* Filter Bar - Sticky */}
      <div className="bg-slate-50 border-b border-slate-200/60 flex-shrink-0 print:hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-4 shadow-sm">
            <div className="flex flex-col gap-4">
              {/* Top Row: Status, Company, and Date Filter Type Selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full text-sm rounded-lg border-slate-200 border p-2.5 bg-slate-50 hover:bg-white focus:bg-white transition-colors focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Payment Received">Payment Received</option>
                  </select>
                </div>

                {/* Company Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Company</label>
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="w-full text-sm rounded-lg border-slate-200 border p-2.5 bg-slate-50 hover:bg-white focus:bg-white transition-colors focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  >
                    <option value="All">All Companies</option>
                    {uniqueCompanies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <DateFilter
                    filterType={dateFilterType}
                    onFilterTypeChange={setDateFilterType}
                    selectedMonth={selectedMonth}
                    onMonthChange={setSelectedMonth}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 w-full sm:w-auto"
                >
                  <X size={14} strokeWidth={2.5} /> Clear Filters ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Section - Sticky */}
      {showForm && (
        <div className="sticky top-16 z-40 bg-slate-50 border-b border-slate-200/60 flex-shrink-0 shadow-md print:hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
            <BillForm
              onSubmit={handleFormSubmit}
              initialData={editingBill}
              onCancel={cancelEdit}
            />
          </div>
        </div>
      )}



      {/* Scrollable Content Area */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-xs md:text-sm font-bold text-slate-700 tracking-tight uppercase">
              Recent Bills
            </h2>
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 print:hidden"
                title="Print List"
              >
                <Printer size={16} strokeWidth={2.5} />
                <span>Print List</span>
              </button>
              <span className="px-2 md:px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                {filteredBills.length} / {bills.length}
              </span>
            </div>
          </div>



          {/* Table Section */}
          <div>
            <BillTable
              bills={filteredBills}
              onEdit={handleEdit}
              onDelete={deleteBill}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
