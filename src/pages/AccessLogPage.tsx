import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatDateTime } from '../utils/formatters';
import { 
  FileText, 
  ShieldCheck, 
  ShieldAlert, 
  Filter, 
  Search, 
  ArrowLeft, 
  Calendar, 
  UserCheck, 
  Users, 
  KeyRound,
  Download
} from 'lucide-react';

interface AccessLogPageProps {
  onBack: () => void;
}

export const AccessLogPage: React.FC<AccessLogPageProps> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const { auditLogs } = useData();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser || currentUser.role !== 'super_admin') {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-200">
        Access Restricted. National Super Admin privileges are required to view the Global Access Log.
      </div>
    );
  }

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'APPROVALS') {
      return log.action.includes('APPROVED') || log.action.includes('REJECTED') || log.action.includes('INFO');
    }
    if (filterType === 'SECURITY') {
      return log.action.includes('LOGIN') || log.action.includes('LOCK') || log.action.includes('FACTOR');
    }
    if (filterType === 'PROJECTS') {
      return log.action.includes('PROJECT') || log.action.includes('AREA_CREATED');
    }

    return true;
  });

  const getActionBadge = (action: string) => {
    if (action.includes('APPROVED')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Approved</span>;
    }
    if (action.includes('REJECTED')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Rejected</span>;
    }
    if (action.includes('LOCKED') || action.includes('FAILED')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Security Alert</span>;
    }
    if (action.includes('FACTOR') || action.includes('LOGIN')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cop-blue-100 text-cop-blue-800">Auth Event</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">Activity</span>;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-cop-blue-950 via-cop-blue-900 to-cop-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-cop-lg border border-red-500/40">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-cop-gold-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
            Super Admin Access Only
          </span>
        </div>

        <div className="mt-4 space-y-1">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            National Access & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Complete immutable log of all access requests, independent Area Head approvals, pastoral appointments, 2FA logins, and security lockouts across the church.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search minister name, area, district, action..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-bold">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              filterType === 'ALL' ? 'bg-cop-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({auditLogs.length})
          </button>
          <button
            onClick={() => setFilterType('APPROVALS')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              filterType === 'APPROVALS' ? 'bg-cop-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Approvals & Requests
          </button>
          <button
            onClick={() => setFilterType('SECURITY')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              filterType === 'SECURITY' ? 'bg-cop-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Security & 2FA
          </button>
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No audit records matching your search or filter.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors text-xs">
              <div className="w-9 h-9 rounded-xl bg-cop-blue-50 text-cop-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-slate-900">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    {getActionBadge(log.action)}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </span>
                </div>

                <div className="text-slate-600">
                  <strong className="text-cop-blue-900">{log.actorName}</strong> ({log.actorRole.replace('_', ' ')}) &rarr;{' '}
                  <strong className="text-slate-800">{log.targetName}</strong>
                </div>

                <p className="text-slate-600 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  {log.details}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
