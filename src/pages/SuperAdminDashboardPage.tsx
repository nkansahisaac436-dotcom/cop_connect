import React, { useState } from 'react';
import { Project, User, Area, District } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Shield, 
  UserCheck, 
  Users, 
  Building2, 
  Globe2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  FileText, 
  Search, 
  Layers, 
  TrendingUp,
  AlertCircle,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import confetti from 'canvas-confetti';

interface SuperAdminDashboardPageProps {
  onSelectProject: (project: Project) => void;
  onOpenStatusModal: (project: Project) => void;
  onOpenUploadModal: () => void;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const SuperAdminDashboardPage: React.FC<SuperAdminDashboardPageProps> = ({
  onSelectProject,
  onOpenStatusModal,
  onOpenUploadModal,
  onNavigate,
}) => {
  const { currentUser, users, approveUser, rejectUser, requestMoreInfo } = useAuth();
  const { projects, areas, districts, auditLogs, recordApprovalLog } = useData();

  const [activeTab, setActiveTab] = useState<'verifications' | 'areas' | 'audit_logs'>('verifications');
  const [searchArea, setSearchArea] = useState('');
  const [auditFilter, setAuditFilter] = useState<'ALL' | 'APPROVALS' | 'SECURITY' | 'PROJECTS'>('ALL');

  // Modals
  const [rejectionModalApplicant, setRejectionModalApplicant] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [infoModalApplicant, setInfoModalApplicant] = useState<User | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState('');

  // Pending Area Heads awaiting Super Admin verification
  const pendingAreaHeads = users.filter(
    (u) => u.role === 'area_head' && (u.status === 'pending' || u.status === 'needs_info')
  );

  const totalRaised = projects.reduce((acc, p) => acc + (p.raisedBudget || 0), 0);
  const totalCompleted = projects.filter((p) => p.status === 'Completed').length;
  const totalOngoing = projects.filter((p) => p.status === 'Ongoing').length;

  const handleApproveAreaHead = (applicant: User) => {
    if (!currentUser) return;
    approveUser(applicant.id, currentUser);
    recordApprovalLog(
      'AREA_HEAD_APPROVED',
      currentUser,
      applicant,
      `Super Admin verified and activated Apostle ${applicant.fullName} over ${applicant.areaName}`
    );

    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalApplicant || !currentUser) return;
    
    rejectUser(rejectionModalApplicant.id, rejectionReason || 'Credentials unverified by Head Office', currentUser);
    recordApprovalLog(
      'AREA_HEAD_REJECTED',
      currentUser,
      rejectionModalApplicant,
      `Super Admin rejected application: ${rejectionReason || 'Credentials unverified'}`
    );

    setRejectionModalApplicant(null);
    setRejectionReason('');
  };

  const handleConfirmRequestInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoModalApplicant || !currentUser) return;

    requestMoreInfo(infoModalApplicant.id, inquiryMessage || 'Please clarify your executive appointment letter with General Headquarters.', currentUser);
    setInfoModalApplicant(null);
    setInquiryMessage('');
  };

  const filteredAreas = areas.filter(
    (a) =>
      a.name.toLowerCase().includes(searchArea.toLowerCase()) ||
      a.region.toLowerCase().includes(searchArea.toLowerCase()) ||
      (a.areaHeadName && a.areaHeadName.toLowerCase().includes(searchArea.toLowerCase()))
  );

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === 'APPROVALS') {
      return log.action.includes('APPROVED') || log.action.includes('REJECTED') || log.action.includes('INFO');
    }
    if (auditFilter === 'SECURITY') {
      return log.action.includes('LOGIN') || log.action.includes('LOCK') || log.action.includes('FACTOR');
    }
    if (auditFilter === 'PROJECTS') {
      return log.action.includes('PROJECT') || log.action.includes('AREA_CREATED');
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Super Admin Command Banner */}
      <div className="bg-gradient-to-r from-cop-blue-950 via-cop-blue-900 to-cop-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-cop-lg border border-red-500/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-bold text-xs border border-red-500/40 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span>National Super Admin Command Center</span>
              </span>
              <span className="text-xs text-cop-gold-300">
                General Headquarters &bull; IT & Admin
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              National Area Head Verification Portal
            </h1>

            <p className="text-xs sm:text-sm text-slate-200">
              Area Heads self-register and declare the Area they lead. As Super Admin, your primary role is
              to <strong>verify each Area Head</strong> so their Area goes live on the national network and their pastors can register under them.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-2xl bg-white/10 text-cop-gold-300 font-bold text-xs border border-white/15">
              Logged in: {currentUser?.fullName}
            </span>
          </div>
        </div>

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-cop-gold-300 font-bold uppercase tracking-wider">
              Active Areas
            </div>
            <div className="text-2xl font-extrabold mt-0.5">{areas.length}</div>
            <div className="text-[10px] text-slate-300">Registered across church</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-cop-gold-300 font-bold uppercase tracking-wider">
              Total Districts
            </div>
            <div className="text-2xl font-extrabold mt-0.5">{districts.length}</div>
            <div className="text-[10px] text-slate-300">Active Pastorates</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-cop-gold-300 font-bold uppercase tracking-wider">
              Total Projects
            </div>
            <div className="text-2xl font-extrabold mt-0.5">{projects.length}</div>
            <div className="text-[10px] text-slate-300">{totalOngoing} ongoing &bull; {totalCompleted} completed</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> Pending Area Heads
            </div>
            <div className="text-2xl font-extrabold mt-0.5 text-amber-300">
              {pendingAreaHeads.length}
            </div>
            <div className="text-[10px] text-slate-300">Awaiting your verification</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-cop-gold-300 font-bold uppercase tracking-wider">
              National Funds Raised
            </div>
            <div className="text-xl font-extrabold mt-0.5 truncate text-cop-gold-300">
              {formatCurrency(totalRaised, 'GHS')}
            </div>
            <div className="text-[10px] text-slate-300">Across all projects</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'verifications'
              ? 'bg-cop-blue-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Area Head Verification Queue</span>
          {pendingAreaHeads.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black animate-pulse">
              {pendingAreaHeads.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('areas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'areas'
              ? 'bg-cop-blue-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>Verified Areas & Leadership ({areas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'audit_logs'
              ? 'bg-cop-blue-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>System Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: AREA HEAD VERIFICATION QUEUE */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="bg-cop-blue-50 border border-cop-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-cop-blue-950">
            <Shield className="w-5 h-5 text-cop-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Super Admin Role:</strong> You do not need to manually
              create Areas. Area Heads self-register their accounts and declare the Area they are heading.
              Review their credentials below and click <strong>"Verify & Activate Area"</strong> to make
              their leadership and Area live on the national network.
            </div>
          </div>

          {pendingAreaHeads.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-heading font-bold text-base text-slate-800">
                All Registered Area Heads Are Verified
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When a new Apostle registers to head an Area, their verification request will appear right here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingAreaHeads.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-white rounded-2xl border border-amber-300 shadow-sm p-5 space-y-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-amber-500" />

                  <div className="flex items-start gap-3.5">
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          applicant.profilePhoto ||
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
                        }
                        alt={applicant.fullName}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-red-400 shadow-md"
                      />
                      <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 rounded-md bg-cop-blue-900 text-[9px] font-bold text-cop-gold-300 border border-cop-gold-400/40">
                        Face ID
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        {applicant.status === 'needs_info' ? (
                          <span className="text-[10px] font-bold text-cop-blue-800 bg-cop-blue-100 px-2 py-0.5 rounded-full">
                            Clarification Inquired
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                            Pending Super Admin Verification
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-base text-slate-900 mt-1 truncate">
                        {applicant.titlePrefix || 'Apostle'} {applicant.fullName}
                      </h3>

                      <div className="text-xs font-semibold text-cop-blue-900 flex items-center gap-1 mt-0.5">
                        <Globe2 className="w-3.5 h-3.5 text-cop-gold-600 flex-shrink-0" />
                        <span>Area Declared: <strong>{applicant.areaName}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Notes */}
                  {applicant.notes && (
                    <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-950">
                      <span className="font-bold text-amber-900">Applicant Note:</span> "{applicant.notes}"
                    </div>
                  )}

                  {/* Inquired note */}
                  {applicant.infoRequestMessage && (
                    <div className="bg-cop-blue-50 p-2.5 rounded-xl border border-cop-blue-200 text-[11px] text-cop-blue-950">
                      <span className="font-bold text-cop-blue-900">Head Office Inquiry:</span> "{applicant.infoRequestMessage}"
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Email</span>
                      <div className="font-semibold text-slate-800 truncate">{applicant.email}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Phone</span>
                      <div className="font-semibold text-slate-800">{applicant.phone}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1">
                    <div className="text-[11px] text-slate-500 mb-2">
                      National Executive Action for <strong>{applicant.areaName}</strong>:
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleApproveAreaHead(applicant)}
                        className="col-span-3 sm:col-span-1 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify & Activate</span>
                      </button>

                      <button
                        onClick={() => setInfoModalApplicant(applicant)}
                        className="py-2.5 px-2 rounded-xl bg-cop-blue-50 hover:bg-cop-blue-100 text-cop-blue-800 font-bold text-xs flex items-center justify-center gap-1 border border-cop-blue-200 transition-colors"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Request Info</span>
                      </button>

                      <button
                        onClick={() => setRejectionModalApplicant(applicant)}
                        className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-1 border border-slate-200 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VERIFIED AREAS & LEADERSHIP */}
      {activeTab === 'areas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchArea}
                onChange={(e) => setSearchArea(e.target.value)}
                placeholder="Search Area name, region, or Apostle..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
              />
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Showing {filteredAreas.length} of {areas.length} Areas
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAreas.map((area) => {
              const areaDistrictsList = districts.filter((d) => d.areaId === area.id);

              return (
                <div
                  key={area.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-cop transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[11px] font-bold text-cop-gold-700 uppercase">
                          {area.region} &bull; {area.country}
                        </div>
                        <h3 className="font-heading font-bold text-lg text-slate-900 mt-0.5">
                          {area.name}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-cop-blue-50 text-cop-blue-800 text-xs font-bold">
                        {areaDistrictsList.length} Districts
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="text-slate-400 font-semibold">Area Head: </span>
                      <strong className="text-slate-800">
                        {area.areaHeadName || 'Pending Assignment'}
                      </strong>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Total Projects:</span>
                        <div className="font-bold text-slate-800">{area.totalProjectsCount || 0}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Completed:</span>
                        <div className="font-bold text-emerald-600">{area.totalCompletedProjects || 0}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onNavigate('area_profile', { areaId: area.id })}
                      className="font-bold text-cop-blue-800 hover:underline"
                    >
                      View Area Profile &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT TRAIL / ACCESS LOG */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                National Access & Verification Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Read-only global oversight of all access requests, independent approvals by Area Heads, security logins, and project activities.
              </p>
            </div>
            <span className="text-xs font-bold text-cop-blue-700 bg-cop-blue-50 px-3 py-1 rounded-full border border-cop-blue-200 w-fit">
              {filteredAuditLogs.length} Events Filtered
            </span>
          </div>

          {/* Filter Bar */}
          <div className="p-3 bg-slate-100/70 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setAuditFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                auditFilter === 'ALL' ? 'bg-cop-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Events ({auditLogs.length})
            </button>
            <button
              onClick={() => setAuditFilter('APPROVALS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                auditFilter === 'APPROVALS' ? 'bg-cop-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Approvals & Verifications
            </button>
            <button
              onClick={() => setAuditFilter('SECURITY')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                auditFilter === 'SECURITY' ? 'bg-cop-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Security & 2FA
            </button>
            <button
              onClick={() => setAuditFilter('PROJECTS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                auditFilter === 'PROJECTS' ? 'bg-cop-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Projects & Areas
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredAuditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No events found matching the selected filter.
              </div>
            ) : (
              filteredAuditLogs.map((log) => (
                <div key={log.id} className="p-4 sm:p-5 flex items-start gap-4 text-xs hover:bg-slate-50/70 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-cop-blue-50 text-cop-blue-800 font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {formatDateTime(log.timestamp)}
                      </span>
                    </div>

                    <div className="text-slate-600 mt-1">
                      <span className="font-semibold text-cop-blue-900">{log.actorName}</span>{' '}
                      ({log.actorRole.replace('_', ' ')}) &rarr;{' '}
                      <span className="font-semibold text-slate-800">{log.targetName}</span>
                    </div>

                    <p className="text-slate-600 mt-1.5 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      {log.details}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {rejectionModalApplicant && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Decline Area Head Application
              </h3>
              <button
                onClick={() => setRejectionModalApplicant(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please enter the official reason for declining the registration of{' '}
              <strong>{rejectionModalApplicant.fullName}</strong> for{' '}
              <strong>{rejectionModalApplicant.areaName}</strong>:
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-3">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="e.g. Applicant credentials unverified with General Secretariat records."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalApplicant(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST MORE INFO MODAL */}
      {infoModalApplicant && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-cop-blue-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-cop-blue-700" />
                Request Head Office Clarification
              </h3>
              <button
                onClick={() => setInfoModalApplicant(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Send a clarification message to <strong>{infoModalApplicant.fullName}</strong> regarding <strong>{infoModalApplicant.areaName}</strong>:
            </p>

            <form onSubmit={handleConfirmRequestInfo} className="space-y-3">
              <textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                rows={3}
                placeholder="e.g. Please confirm your transfer date or attach your Council Appointment Minute."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
                required
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInfoModalApplicant(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cop-blue-800 hover:bg-cop-blue-900 text-white font-bold text-xs shadow"
                >
                  Send Inquiry Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
