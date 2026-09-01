import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CopLogo } from '../../assets/CopLogo';
import { 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail,
  HelpCircle,
  LogOut,
  RefreshCw,
  Layers,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PendingApprovalViewProps {
  onNavigate: (page: string) => void;
}

export const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({ onNavigate }) => {
  const { currentUser, approveUser, logout } = useAuth();
  const { areas, recordApprovalLog } = useData();

  if (!currentUser) return null;

  const isAreaHead = currentUser.role === 'area_head';
  const assignedArea = areas.find((a) => a.id === currentUser.areaId || a.name === currentUser.areaName);

  const handleSimulateApproval = () => {
    const approver = {
      id: isAreaHead ? 'usr_super_admin' : (assignedArea?.areaHeadUserId || 'usr_area_kaneshie'),
      fullName: isAreaHead
        ? 'Rev. Dr. Samuel Kwadwo Boakye (National Super Admin)'
        : (assignedArea?.areaHeadName ? `${assignedArea.areaHeadName} (Area Head)` : 'Area Head Apostle'),
      email: isAreaHead ? 'admin@thecophq.org' : 'areahead@thecophq.org',
      phone: '+233 24 000 0000',
      role: isAreaHead ? ('super_admin' as const) : ('area_head' as const),
      status: 'approved' as const,
      createdAt: new Date().toISOString(),
    };

    approveUser(currentUser.id, approver);
    recordApprovalLog(
      isAreaHead ? 'AREA_HEAD_APPROVED' : 'PASTOR_APPROVED',
      approver,
      currentUser,
      `Verified and approved ${currentUser.fullName} as ${currentUser.role}`
    );

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      onNavigate(isAreaHead ? 'area_head' : 'pastor');
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-cop-blue-900 via-cop-blue-800 to-cop-blue-900 p-6 text-white text-center relative">
          <div className="flex justify-center mb-3">
            <CopLogo size="lg" />
          </div>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight">
            The Church of Pentecost &bull; COP Connect
          </h1>
          <p className="text-xs sm:text-sm text-cop-gold-300 font-medium mt-1">
            Official 2-Tier Hierarchical Verification Trust Chain
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs shadow-sm">
            <Clock className="w-4 h-4 text-amber-600 animate-spin" />
            <span>STATUS: PENDING VERIFICATION</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">
              Welcome, {currentUser.titlePrefix || (isAreaHead ? 'Apostle' : 'Pastor')}{' '}
              {currentUser.fullName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Because COP Connect is an internal leadership network, your account must be verified
              up the church hierarchy before full project posting rights are activated.
            </p>
          </div>

          {/* Verification Details Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Verification Pathway</span>
              <span className="text-cop-blue-800 font-semibold text-[11px]">
                {isAreaHead ? 'Tier 1 Verification' : 'Tier 2 Verification'}
              </span>
            </div>

            {isAreaHead ? (
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="p-2 rounded-xl bg-red-100 text-red-800 mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-xs leading-relaxed">
                  <div className="font-bold text-slate-900 text-sm">
                    Awaiting National Super Admin Verification
                  </div>
                  <div className="text-slate-600 mt-1">
                    Your appointment to head <strong className="text-cop-blue-900">{currentUser.areaName}</strong>{' '}
                    has been submitted to the <strong>National Head Office (General Headquarters IT & Administration)</strong>.
                    Once the Super Admin verifies your Area Head credentials, you will have complete oversight over all districts in {currentUser.areaName}.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="p-2 rounded-xl bg-cop-gold-100 text-cop-gold-900 mt-0.5">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-xs leading-relaxed">
                  <div className="font-bold text-slate-900 text-sm">
                    Awaiting Area Head Approval ({currentUser.areaName})
                  </div>
                  <div className="text-slate-600 mt-1">
                    Your registration for <strong className="text-cop-blue-900">{currentUser.districtName}</strong>{' '}
                    has been forwarded to your Supervising Area Head:{' '}
                    <strong className="text-cop-blue-900">
                      {assignedArea?.areaHeadName || 'The Area Head Apostle'}
                    </strong>.
                  </div>
                  <div className="mt-2 text-[11px] text-cop-gold-900 bg-cop-gold-50 p-2 rounded-lg border border-cop-gold-200">
                    💡 <em>Because the Area Head knows all pastors in their Area, they will confirm you are assigned to this district and verify your access.</em>
                  </div>
                </div>
              </div>
            )}

            {/* Applicant Summary */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">Registered Email:</span>
                <div className="font-bold text-slate-800 truncate">{currentUser.email}</div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Registered Phone:</span>
                <div className="font-bold text-slate-800">{currentUser.phone}</div>
              </div>
            </div>
          </div>

          {/* Action Simulation for Demo Testing */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleSimulateApproval}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-heading font-bold text-sm shadow-lg flex items-center justify-center gap-2 group transition-all"
            >
              <Sparkles className="w-4 h-4 text-cop-gold-300" />
              <span>Simulate Instant Approval by {isAreaHead ? 'Super Admin' : 'Area Head'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-slate-400">
              In live operations, the {isAreaHead ? 'National Super Admin' : 'Area Head'} logs in and confirms this account from their approval queue.
            </p>
          </div>

          {/* Sign Out or Browse Feed */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            <button
              onClick={() => onNavigate('feed')}
              className="hover:text-cop-blue-800 underline"
            >
              Browse Public National Feed
            </button>
            <span>•</span>
            <button
              onClick={() => logout()}
              className="hover:text-cop-red-600 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
