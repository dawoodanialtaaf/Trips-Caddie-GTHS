import React, { useState } from 'react';
import { QuoteRequestLog } from '../types';
import {
  X,
  Calendar,
  MapPin,
  Trash2,
  Search,
  Monitor,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  Globe
} from 'lucide-react';

interface AdminRequestLogModalProps {
  logs: QuoteRequestLog[];
  onDeleteLog: (id: string) => void;
  onClose: () => void;
}

const AdminRequestLogModal: React.FC<AdminRequestLogModalProps> = ({
  logs,
  onDeleteLog,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // --- NORMALIZE LOG SHAPE (handles old rows where JSON is in `data`) ---
  const normalizedLogs: QuoteRequestLog[] = logs
    .map((l: any) => {
      // Already correct shape
      if (l && l.customer && l.tripName) return l as QuoteRequestLog;

      // DB row that still has `data` as JSON string
      if (l && typeof l.data === 'string') {
        try {
          const parsed = JSON.parse(l.data);
          if (parsed && parsed.customer && parsed.tripName) {
            return parsed as QuoteRequestLog;
          }
        } catch {
          return null;
        }
      }

      return null;
    })
    .filter((v): v is QuoteRequestLog => v !== null);

  const filteredLogs = normalizedLogs
    .filter((log) =>
      [
        log.customer?.name || '',
        log.customer?.email || '',
        log.tripName || ''
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Time',
      'Customer Name',
      'Email',
      'Phone',
      'Company',
      'Trip Name',
      'Request Notes',
      // Trip Details Columns
      'Trip Month/Year',
      'Group Size',
      'Lodging',
      'Courses',
      'Price/Person',
      'Vibe',
      'Transport',
      'Special Requests',
      'Highlights',
      'Synopsis',
      'Planner Notes',
      'Itinerary Summary',
      // Metadata Columns
      'City',
      'Region',
      'Country',
      'IP',
      'Device',
      'Source'
    ];

    const safeStr = (str: string | undefined | null) =>
      `"${(str || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;

    const csvContent = [
      headers.join(','),
      ...filteredLogs.map((log) => {
        const date = new Date(log.timestamp);
        const snap = log.tripSnapshot;

        const itineraryStr = snap?.dailyItinerary
          ? snap.dailyItinerary
              .map(
                (d) =>
                  `Day ${d.day}: ${d.activity} @ ${d.time} (${d.location})`
              )
              .join(' | ')
          : '';

        return [
          date.toLocaleDateString(),
          date.toLocaleTimeString(),
          safeStr(log.customer?.name),
          safeStr(log.customer?.email),
          safeStr(log.customer?.phone),
          safeStr(log.customer?.company),
          safeStr(log.tripName),
          safeStr(log.constraints),
          // Trip Details
          safeStr(snap ? `${snap.month} ${snap.year}` : ''),
          safeStr(snap?.groupSize?.toString()),
          safeStr(snap?.lodging),
          safeStr(snap?.courses?.join(', ')),
          safeStr(snap?.pricePerPerson?.toString()),
          safeStr(snap?.vibe),
          safeStr(snap?.logistics?.transportType),
          safeStr(snap?.logistics?.specialRequests?.join(', ')),
          safeStr(snap?.highlights?.join(', ')),
          safeStr(snap?.synopsis),
          safeStr(snap?.whyItWorked),
          safeStr(itineraryStr),
          // Metadata
          safeStr(log.metadata?.city),
          safeStr(log.metadata?.region),
          safeStr(log.metadata?.country),
          safeStr(log.metadata?.ip),
          safeStr(log.metadata?.deviceType),
          safeStr(log.metadata?.landingPage)
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `quote_requests_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full flex flex-col h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Incoming Quote Requests
            </h3>
            <p className="text-xs text-slate-500">
              Memory of last 50 requests with full details.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export Full CSV
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name, email, or trip..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <p className="text-sm">No requests found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {log.customer?.name}
                        </h4>
                        <div className="text-xs text-slate-500 flex flex-col gap-0.5 mt-1">
                          {log.customer?.email && (
                            <a
                              href={`mailto:${log.customer.email}`}
                              className="hover:text-emerald-600"
                            >
                              {log.customer.email}
                            </a>
                          )}
                          {log.customer?.phone && (
                            <a
                              href={`tel:${log.customer.phone}`}
                              className="hover:text-emerald-600"
                            >
                              {log.customer.phone}
                            </a>
                          )}
                          {log.customer?.company && (
                            <span className="text-slate-400 font-medium">
                              {log.customer.company}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 mb-1 inline-block">
                          {log.tripName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Constraints / Notes */}
                    {log.constraints && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 mb-4 italic">
                        "{log.constraints}"
                      </div>
                    )}

                    {/* Metadata Footer - Collapsed View */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-[10px] text-slate-400">
                        <div
                          className="flex items-center gap-1.5"
                          title="Location"
                        >
                          <MapPin className="w-3 h-3 text-slate-300" />
                          {log.metadata?.city}, {log.metadata?.region} (
                          {log.metadata?.country})
                        </div>
                        <div
                          className="flex items-center gap-1.5"
                          title="Device"
                        >
                          <Monitor className="w-3 h-3 text-slate-300" />
                          {log.metadata?.deviceType}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                          {expandedLogId === log.id
                            ? 'Hide Details'
                            : 'View Technical Data'}
                          {expandedLogId === log.id ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={() => onDeleteLog(log.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                          title="Delete Log Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Technical Details */}
                  {expandedLogId === log.id && (
                    <div className="bg-slate-50 border-t border-slate-200 p-4 text-xs font-mono text-slate-600 space-y-2 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="block font-bold text-slate-400 text-[9px] uppercase mb-0.5">
                            IP Address
                          </span>
                          {log.metadata?.ip}
                        </div>
                        <div>
                          <span className="block font-bold text-slate-400 text-[9px] uppercase mb-0.5">
                            Timezone
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />{' '}
                            {log.metadata?.timezone}
                          </span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="block font-bold text-slate-400 text-[9px] uppercase mb-0.5">
                            Source URL
                          </span>
                          <div
                            className="truncate flex items-center gap-1.5"
                            title={log.metadata?.landingPage}
                          >
                            <Globe className="w-3 h-3" />{' '}
                            {log.metadata?.landingPage}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <span className="block font-bold text-slate-400 text-[9px] uppercase mb-0.5">
                            User Agent
                          </span>
                          <div className="break-all p-2 bg-slate-100 rounded border border-slate-200 text-[10px]">
                            {log.metadata?.userAgent}
                          </div>
                        </div>
                      </div>

                      {log.tripSnapshot && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <span className="block font-bold text-slate-500 text-[10px] uppercase mb-1">
                            Archived Trip Data Snapshot
                          </span>
                          <div className="text-[10px] text-slate-500">
                            ID: {log.tripSnapshot.id} | Pax:{' '}
                            {log.tripSnapshot.groupSize} | Price: $
                            {log.tripSnapshot.pricePerPerson} | Vibe:{' '}
                            {log.tripSnapshot.vibe}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRequestLogModal;