import React, { useState } from 'react';
import { Project, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/feed/ProjectCard';
import { 
  UserCheck, 
  Users, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Layers, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AreaHeadDashboardPageProps {
  onSelectProject: (project: Project) => void;
  onOpenStatusModal: (project: Project) => void;
  onOpenUploadModal: () => void;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const AreaHeadDashboardPage: React.FC<AreaHeadDashboardPageProps> = ({
  onSelectProject,
  onOpenStatusModal,
  onOpenUploadModal,
  onNavigate,
}) => {
  const { currentUser, users, approveUser, rejectUser, requestMoreInfo } = useAuth();
  const { projects, areas, districts, recordApprovalLog } = useData();

  const [activeTab, setActiveTab] = useState<'approvals' | 'districts' | 'projects'>('approvals');
  const [districtSearch, setDistrictSearch] = useState('');
  
  // Modals
  const [rejectionModalUser, setRejectionModalUser] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [infoModalUser, setInfoModalUser] = useState<User | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState('');

  if (!currentUser) return null;

  // Pending pastors requesting to join this specific Area
  const pendingPastors = users.filter(
    (u) =>
      u.role === 'pastor' &&
      (u.status === 'pending' || u.status === 'needs_info') &&
      (u.areaId === currentUser.areaId || u.areaName === currentUser.areaName)
  );

  // Districts under this Area
  const areaDistricts = districts.filter(
    (d) => d.areaId === currentUser.areaId || d.areaName === currentUser.areaName
  );

  // Projects across all Districts under this Area
  const areaProjects = projects.filter(
    (p) => p.areaId === currentUser.areaId || p.areaName === currentUser.areaName
  );

  const ongoingProjects = areaProjects.filter((p) => p.status === 'Ongoing').length;
  const completedProjects = areaProjects.filter((p) => p.status === 'Completed').length;

  const handleApprovePastor = (pastor: User) => {
    approveUser(pastor.id, currentUser);
    recordApprovalLog(
      'PASTOR_APPROVED',
      currentUser,
      pastor,
      `Apostle ${currentUser.fullName} confirmed and approved ${pastor.fullName} as minister for ${pastor.districtName} (${currentUser.areaName})`
    );

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalUser) return;

    rejectUser(rejectionModalUser.id, rejectionReason || 'Information not verified with Area Secretariat.', currentUser);
    recordApprovalLog(
      'PASTOR_REJECTED',
      currentUser,
      rejectionModalUser,
      `Area Head declined registration: ${rejectionReason || 'Credentials unverified'}`
    );

    setRejectionModalUser(null);
    setRejectionReason('');
  };

  const handleConfirmRequestInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoModalUser) return;

    requestMoreInfo(infoModalUser.id, inquiryMessage || 'Please clarify your current pastoral appointment and stationing.', currentUser);
    setInfoModalUser(null);
    setInquiryMessage('');
  };

  const filteredDistricts = areaDistricts.filter(
    (d) =>
      d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
      (d.pastorName && d.pastorName.toLowerCase().includes(districtSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Area Head Header Banner */}
      <div className="bg-gradient-to-r from-cop-blue-900 via-cop-blue-800 to-cop-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-cop-lg border border-cop-gold-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cop-gold-500/20 text-cop-gold-300 font-bold text-xs border border-cop-gold-500/40 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Area Head Executive Command</span>
              </span>
              <span className="text-xs text-slate-300">
                {currentUser.areaName || 'Assigned Area'}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {currentUser.areaName || 'Area Dashboard'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-2">
              <span className="font-semibold text-cop-gold-300">Area Head:</span>
              <span>{currentUser.titlePrefix || 'Apostle'} {currentUser.fullName}</span>
              <span>•</span>
              <span>{areaDistricts.length} Districts Under Jurisdiction</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUploadModal}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cop-gold-500 to-cop-gold-600 hover:from-cop-gold-600 text-slate-950 font-heading font-extrabold text-sm shadow-gold-glow flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Post Area Update</span>
            </button>
          </div>
        </div>

        {/* Quick Area Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-cop-gold-300 font-bold uppercase tracking-wider">
              Total Districts
            </div>
            <div className="text-2xl font-extrabold mt-0.5">{areaDistricts.length}</div>
            <div className="text-[10px] text-slate-300">Under your Area leadership</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-red-300 font-bold uppercase tracking-wider">
              Active Projects
            </div>
            <div className="text-2xl font-extrabold mt-0.5">{ongoingProjects}</div>
            <div className="text-[10px] text-slate-300">Ongoing construction/events</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider">
              Completed
            </div>
            <div className="text-2xl font-extrabold mt-0.5">{completedProjects}</div>
            <div className="text-[10px] text-slate-300">Dedicated sanctuaries</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> Pending Pastors
            </div>
            <div className="text-2xl font-extrabold mt-0.5 text-amber-300">
              {pendingPastors.length}
            </div>
            <div className="text-[10px] text-slate-300">Awaiting your approval</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'approvals'
              ? 'bg-cop-blue-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Pending Pastor Approvals Queue</span>
          {pendingPastors.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black animate-pulse">
              {pendingPastors.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('districts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'districts'
              ? 'bg-cop-blue-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Districts Directory ({areaDistricts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'projects'
              ? 'bg-cop-blue-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Area Projects Feed ({areaProjects.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING PASTOR APPROVAL QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-cop-gold-50 border border-cop-gold-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-cop-gold-950">
            <ShieldCheck className="w-5 h-5 text-cop-gold-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Pastor Verification Protocol:</strong> Because you know
              the pastors ministering in <strong className="text-cop-blue-900">{currentUser.areaName}</strong>,
              the church hierarchy entrusts you to verify that each applicant is genuinely appointed to
              their requested district. Once confirmed and approved, they will immediately be granted rights
              to upload projects and updates for their district.
            </div>
          </div>

          {pendingPastors.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-heading font-bold text-base text-slate-800">
                No Pending Pastor Approvals in {currentUser.areaName}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When a minister registers and selects {currentUser.areaName}, their application will
                appear right here for your confirmation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPastors.map((pastor) => (
                <div
                  key={pastor.id}
                  className="bg-white rounded-2xl border border-amber-300 shadow-sm p-5 space-y-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-cop-gold-500" />

                  <div className="flex items-start gap-3.5">
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          pastor.profilePhoto ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                        }
                        alt={pastor.fullName}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md"
                      />
                      <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 rounded-md bg-cop-blue-900 text-[9px] font-bold text-cop-gold-300 border border-cop-gold-400/40">
                        Face ID
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        {pastor.status === 'needs_info' ? (
                          <span className="text-[10px] font-bold text-cop-blue-800 bg-cop-blue-100 px-2 py-0.5 rounded-full">
                            Clarification Inquired
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            Pending Area Verification
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {pastor.createdAt ? new Date(pastor.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-base text-slate-900 mt-1 truncate">
                        {pastor.titlePrefix || 'Pastor'} {pastor.fullName}
                      </h3>

                      <div className="text-xs font-semibold text-cop-blue-900 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-cop-gold-600 flex-shrink-0" />
                        <span>Requested District: <strong>{pastor.districtName}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Note if provided */}
                  {pastor.notes && (
                    <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-950">
                      <span className="font-bold text-amber-900">Applicant Note:</span> "{pastor.notes}"
                    </div>
                  )}

                  {/* Previous Inquiry note if present */}
                  {pastor.infoRequestMessage && (
                    <div className="bg-cop-blue-50 p-2.5 rounded-xl border border-cop-blue-200 text-[11px] text-cop-blue-950">
                      <span className="font-bold text-cop-blue-900">Pending Clarification:</span> "{pastor.infoRequestMessage}"
                    </div>
                  )}

                  {/* Contact & Registration info */}
                  <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Email</span>
                      <div className="font-semibold text-slate-800 truncate">{pastor.email}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Phone</span>
                      <div className="font-semibold text-slate-800">{pastor.phone}</div>
                    </div>
                  </div>

                  {/* 3 Approver Actions */}
                  <div className="pt-1">
                    <div className="text-[11px] text-slate-500 mb-2">
                      Take ministerial action for <strong>{pastor.districtName}</strong>:
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleApprovePastor(pastor)}
                        className="col-span-3 sm:col-span-1 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => setInfoModalUser(pastor)}
                        className="py-2.5 px-2 rounded-xl bg-cop-blue-50 hover:bg-cop-blue-100 text-cop-blue-800 font-bold text-xs flex items-center justify-center gap-1 border border-cop-blue-200 transition-colors"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Request Info</span>
                      </button>

                      <button
                        onClick={() => setRejectionModalUser(pastor)}
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

      {/* TAB 2: ALL DISTRICTS DIRECTORY */}
      {activeTab === 'districts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                placeholder="Search district name or pastor..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
              />
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Showing {filteredDistricts.length} of {areaDistricts.length} Districts
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDistricts.map((dist) => (
              <div
                key={dist.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-cop-blue-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      {dist.name}
                    </h3>
                    <p className="text-xs text-cop-blue-700 font-semibold mt-0.5">
                      {dist.pastorName || 'Minister Pending Assignment'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cop-blue-50 text-cop-blue-800 text-xs font-bold">
                    {dist.assemblyCount} Assemblies
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{dist.projectCount || 0} Projects Logged</span>
                  <button
                    onClick={() => onNavigate('district_profile', { districtId: dist.id })}
                    className="text-cop-blue-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View District</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AREA PROJECTS FEED */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Projects across all Districts in {currentUser.areaName} ({areaProjects.length})
            </h3>
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2 rounded-xl bg-cop-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cop-gold-400" />
              <span>Upload Area Project</span>
            </button>
          </div>

          {areaProjects.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              No projects recorded for this Area yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areaProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={onSelectProject}
                  onOpenStatusModal={onOpenStatusModal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectionModalUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Decline Pastor Application
              </h3>
              <button
                onClick={() => setRejectionModalUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please provide a reason for declining the registration of{' '}
              <strong>{rejectionModalUser.fullName}</strong> for{' '}
              <strong>{rejectionModalUser.districtName}</strong>:
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-3">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="e.g. Pastor is not assigned to this District / Incorrect Area selected"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalUser(null)}
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
      {infoModalUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-cop-blue-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-cop-blue-700" />
                Request Clarification from Applicant
              </h3>
              <button
                onClick={() => setInfoModalUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Send a clarification message to <strong>{infoModalUser.fullName}</strong> regarding their registration for <strong>{infoModalUser.districtName}</strong>:
            </p>

            <form onSubmit={handleConfirmRequestInfo} className="space-y-3">
              <textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                rows={3}
                placeholder="e.g. Please clarify your year of appointment or provide your station transfer letter."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
                required
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInfoModalUser(null)}
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
