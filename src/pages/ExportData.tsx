import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { BusinessCard } from '../types';
import { format, subDays, startOfMonth, subMonths, isAfter, isBefore, endOfDay, startOfDay } from 'date-fns';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Calendar, CheckSquare, Square, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExportData() {
  const { user } = useAuth();
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCards();
  }, [user]);

  const fetchCards = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const qCards = query(collection(db, 'cards'), where('userId', '==', user.uid));
      const snapshot = await getDocs(qCards);
      const fetchedCards: BusinessCard[] = [];
      snapshot.forEach((doc) => {
        fetchedCards.push({ id: doc.id, ...doc.data() } as BusinessCard);
      });
      // Sort by newest first
      fetchedCards.sort((a, b) => b.createdAt - a.createdAt);
      setCards(fetchedCards);
      setSelectedIds(new Set(fetchedCards.map(c => c.id!)));
    } catch (error) {
      console.error("Error fetching cards for export", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCards = () => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (dateRange) {
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'yesterday':
        start = startOfDay(subDays(now, 1));
        end = endOfDay(subDays(now, 1));
        break;
      case '7days':
        start = startOfDay(subDays(now, 7));
        end = endOfDay(now);
        break;
      case '30days':
        start = startOfDay(subDays(now, 30));
        end = endOfDay(now);
        break;
      case 'thisMonth':
        start = startOfMonth(now);
        end = endOfDay(now);
        break;
      case 'lastMonth':
        start = startOfMonth(subMonths(now, 1));
        end = endOfDay(subDays(startOfMonth(now), 1));
        break;
      case 'custom':
        if (customStart) start = startOfDay(new Date(customStart));
        if (customEnd) end = endOfDay(new Date(customEnd));
        break;
    }

    return cards.filter(card => {
      const cardDate = new Date(card.createdAt);
      if (start && isBefore(cardDate, start)) return false;
      if (end && isAfter(cardDate, end)) return false;
      return true;
    });
  };

  const filteredCards = getFilteredCards();
  const selectedCards = filteredCards.filter(c => selectedIds.has(c.id!));

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedCards.length === filteredCards.length) {
      // deselect all in current view
      const newSet = new Set(selectedIds);
      filteredCards.forEach(c => newSet.delete(c.id!));
      setSelectedIds(newSet);
    } else {
      // select all in current view
      const newSet = new Set(selectedIds);
      filteredCards.forEach(c => newSet.add(c.id!));
      setSelectedIds(newSet);
    }
  };

  const prepareExportData = () => {
    return selectedCards.map(c => ({
      Name: c.fullName,
      Company: c.company,
      Designation: c.designation,
      Phone: c.phoneNumbers?.join(', ') || '',
      Email: c.emails?.join(', ') || '',
      Website: c.website,
      Address: c.address,
      LinkedIn: c.linkedIn,
      Category: c.category,
      Notes: c.notes,
      Tags: c.tags?.join(', ') || '',
      'Scan Date': format(c.createdAt, 'yyyy-MM-dd HH:mm:ss')
    }));
  };

  const exportCSV = () => {
    if (selectedCards.length === 0) return toast.error('No cards selected');
    const data = prepareExportData();
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contacts_export_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
    toast.success('Exported to CSV');
  };

  const exportExcel = () => {
    if (selectedCards.length === 0) return toast.error('No cards selected');
    const data = prepareExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    XLSX.writeFile(workbook, `contacts_export_${format(new Date(), 'yyyyMMdd')}.xlsx`);
    toast.success('Exported to Excel');
  };

  const exportPDF = () => {
    if (selectedCards.length === 0) return toast.error('No cards selected');
    const doc = new jsPDF('landscape');
    
    doc.text("Business Contacts Export", 14, 15);
    
    const data = prepareExportData().map(row => [
      row.Name, row.Company, row.Designation, row.Phone, row.Email, row.Category, row['Scan Date']
    ]);
    
    autoTable(doc, {
      head: [['Name', 'Company', 'Designation', 'Phone', 'Email', 'Category', 'Scan Date']],
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] } // blue-500
    });
    
    doc.save(`contacts_export_${format(new Date(), 'yyyyMMdd')}.pdf`);
    toast.success('Exported to PDF');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-2">Export Data</h1>
        <p className="text-gray-500">Filter and export your scanned business cards.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Step 1: Choose Date Range
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'thisMonth', label: 'This Month' },
            { id: 'lastMonth', label: 'Last Month' },
            { id: 'custom', label: 'Custom Range' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setDateRange(opt.id)}
              className={`py-2 px-4 rounded-xl text-sm font-medium transition-colors border ${
                dateRange === opt.id 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {dateRange === 'custom' && (
          <div className="flex items-center space-x-4 mt-4 bg-gray-50 p-4 rounded-xl">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
            Step 2: Preview Data
          </h2>
          <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg font-medium">
            Selected {selectedCards.length} of {filteredCards.length} records
          </div>
        </div>

        <div className="overflow-x-auto max-h-[400px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <button onClick={toggleAll} className="text-gray-400 hover:text-blue-600 focus:outline-none">
                    {selectedCards.length === filteredCards.length && filteredCards.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scan Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td></tr>
              ) : filteredCards.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">No records found for this date range.</td></tr>
              ) : (
                filteredCards.map((card) => (
                  <tr key={card.id} className={selectedIds.has(card.id!) ? 'bg-blue-50/50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => toggleSelection(card.id!)} className="text-gray-400 hover:text-blue-600 focus:outline-none">
                        {selectedIds.has(card.id!) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{card.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.emails?.[0] || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {card.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(card.createdAt, 'MMM d, yyyy')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-lg font-medium text-gray-900 mb-1">Step 3: Export</h2>
          <p className="text-sm text-gray-500">Download your selected records in your preferred format.</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button onClick={exportCSV} disabled={selectedCards.length === 0} className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            CSV
          </button>
          <button onClick={exportExcel} disabled={selectedCards.length === 0} className="w-full sm:w-auto bg-emerald-600 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Excel (.xlsx)
          </button>
          <button onClick={exportPDF} disabled={selectedCards.length === 0} className="w-full sm:w-auto bg-red-600 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            PDF
          </button>
        </div>
      </div>
    </div>
  );
}
