import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Clock, 
  KeyRound, 
  ArrowRight, 
  UserCheck, 
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

interface LoginScreenProps {
  onRequestAccess: () => void;
  onLoginSuccess: (role: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onRequestAccess,
  onLoginSuccess,
}) => {
  const { login, verify2FA, cancel2FA, twoFactorPendingUser, isLoading } = useAuth();

  // Mode: 'splash' (exact reference launch screen) | 'form' (credentials input)
  const [viewMode, setViewMode] = useState<'splash' | 'form'>('splash');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pendingStatusInfo, setPendingStatusInfo] = useState<string | null>(null);
  const [lockoutMinutes, setLockoutMinutes] = useState<number | null>(null);

  // Auto-switch to form view if 2FA becomes pending
  useEffect(() => {
    if (twoFactorPendingUser) {
      setViewMode('form');
    }
  }, [twoFactorPendingUser]);

  // Auto-clear notices when user edits fields
  useEffect(() => {
    if (error) setError(null);
    if (pendingStatusInfo) setPendingStatusInfo(null);
  }, [identifier, password]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingStatusInfo(null);
    setLockoutMinutes(null);

    if (!identifier.trim()) {
      setError('Please enter your official email address or phone number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const result = await login(identifier, password);

    if (result.success) {
      if (!result.requires2FA) {
        // Successful login handled by AuthContext session state
      }
    } else {
      if (result.status === 'pending') {
        setPendingStatusInfo(result.error || 'Your account is pending verification.');
      } else if (result.lockedMinutes) {
        setLockoutMinutes(result.lockedMinutes);
        setError(result.error || 'Account is temporarily locked.');
      } else {
        setError(result.error || 'Invalid credentials. Please verify and try again.');
      }
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode.trim()) {
      setError('Please enter the 6-digit security code.');
      return;
    }

    const result = await verify2FA(twoFactorCode.trim());
    if (!result.success) {
      setError(result.error || 'Invalid 2FA code. Please check and try again.');
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-between items-center px-6 py-6 sm:py-8 font-sans overflow-hidden select-none">
      
      {/* 1. Full-Bleed Campus Photo Background (road and red-roofed buildings visible in mid-section) */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat -z-20 scale-100"
        style={{ 
          backgroundImage: `url('/cop_convention_center.jpg')`,
          backgroundPosition: 'center 58%' 
        }}
      />
      
      {/* 2. Direct Navy Veil Gradient: Dark at top & bottom, lighter in mid-section */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(8,16,36,0.86) 0%, rgba(12,22,46,0.50) 25%, rgba(12,22,46,0.38) 50%, rgba(12,22,46,0.52) 75%, rgba(6,11,24,0.95) 100%)'
        }}
      />

      {/* TOP THIRD: Emblem Badge & Branding Wordmark */}
      <div className="w-full max-w-sm flex flex-col items-center text-center mt-6 sm:mt-10 z-10">
        
        {/* Emblem Badge Container with Gold & Red Arcs */}
        <div className="relative w-[126px] h-[126px] flex items-center justify-center mb-5">
          {/* Thin Vector Arcs matching reference angles */}
          <svg className="absolute -inset-2 w-[142px] h-[142px] pointer-events-none" viewBox="0 0 160 160">
            {/* Gold Arc: sweeps from upper-left over top to upper-right */}
            <path
              d="M 31 39 A 64 64 0 0 1 138 107"
              fill="none"
              stroke="#D4A017"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Short Red Accent Arc at bottom-right */}
            <path
              d="M 117 132 A 64 64 0 0 1 86 144"
              fill="none"
              stroke="#C0392B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Plain White Circular Badge with Soft Drop Shadow */}
          <div className="w-[108px] h-[108px] rounded-full bg-white flex items-center justify-center p-3 shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
            <img
              src="/cop_emblem_official.png"
              alt="The Church of Pentecost Official Seal"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Small Tracked-out Overline */}
        <div className="text-[11.5px] sm:text-[12px] text-[#C6CEE4] tracking-[0.2em] font-medium uppercase drop-shadow-sm">
          THE CHURCH OF PENTECOST
        </div>

        {/* Title: COP in bold white serif, Connect in gold serif italic on one line */}
        <div className="flex items-baseline justify-center font-serif text-3xl sm:text-4xl mt-1 drop-shadow-md">
          <span className="font-bold text-white tracking-wide">COP</span>
          <span className="font-normal italic text-[#D4A017] ml-2">Connect</span>
        </div>

        {/* Short Gold Divider Line */}
        <div className="w-[46px] h-[2px] bg-[#D4A017] my-3" />

        {/* Tagline */}
        <div className="text-[#C6CEE4] text-[12.5px] sm:text-[13px] tracking-[0.3px] font-normal drop-shadow-sm">
          Official ministerial intranet
        </div>
      </div>

      {/* BOTTOM AREA: Launch Splash CTAs OR Sign-In Form */}
      <div className="w-full max-w-sm flex flex-col items-center text-center mb-2 z-10">
        
        {viewMode === 'splash' && !twoFactorPendingUser ? (
          /* EXACT MATCH ENTRY VIEW: Pinned Gold Button + Request Access + Theme */
          <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
            {/* Full-width Gold Rounded-Rectangle Button */}
            <button
              onClick={() => setViewMode('form')}
              className="w-full py-3.5 px-6 rounded-lg bg-[#D4A017] hover:bg-[#C29112] active:bg-[#B38309] text-[#241C08] font-bold text-[14px] tracking-wide shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Continue to sign in</span>
              <span className="text-base font-bold">&rarr;</span>
            </button>

            {/* Request Access Text Link */}
            <button
              onClick={onRequestAccess}
              className="mt-3.5 text-[12.5px] text-[#C6CEE4] hover:text-white font-normal transition-colors"
            >
              New here? Request access
            </button>
          </div>
        ) : (
          /* FORM VIEW: Sign In & 2FA Interface */
          <div className="w-full rounded-2xl bg-[#060B18]/90 backdrop-blur-md p-5 border border-white/10 shadow-2xl text-left space-y-3 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Top Back Navigation */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => setViewMode('splash')}
                className="text-[11.5px] text-[#C6CEE4] hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>Back</span>
              </button>
              <span className="text-[11px] font-semibold text-[#D4A017] uppercase tracking-wider">
                {twoFactorPendingUser ? '2FA Code' : 'Sign In'}
              </span>
            </div>

            {/* 2FA Verification Mode */}
            {twoFactorPendingUser ? (
              <form onSubmit={handle2FASubmit} className="space-y-3">
                <div className="text-center space-y-1">
                  <p className="text-[12px] text-slate-300">
                    Enter code for <strong className="text-white">{twoFactorPendingUser.fullName}</strong>
                  </p>
                </div>

                {error && (
                  <div className="p-2.5 rounded bg-red-950/70 border border-red-500/50 text-red-200 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full text-center tracking-[0.4em] font-mono font-bold text-xl py-2 rounded bg-black/50 border border-white/20 text-white focus:border-[#D4A017] focus:outline-none"
                  autoFocus
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-[#D4A017] hover:bg-[#C29112] text-[#241C08] font-bold text-[13px] uppercase tracking-wide transition-all"
                >
                  Verify & Continue
                </button>

                <button
                  type="button"
                  onClick={cancel2FA}
                  className="w-full text-center text-[11.5px] text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </form>
            ) : (
              /* Standard Credentials Form */
              <form onSubmit={handleLoginSubmit} className="space-y-2.5">
                
                {/* Status Notices */}
                {pendingStatusInfo && (
                  <div className="p-2 rounded bg-amber-950/70 border border-amber-500/50 text-amber-200 text-[11px] space-y-0.5">
                    <div className="font-bold flex items-center gap-1 text-amber-300">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Pending Verification</span>
                    </div>
                    <p className="text-[10.5px] text-amber-200/90">{pendingStatusInfo}</p>
                  </div>
                )}

                {lockoutMinutes && (
                  <div className="p-2 rounded bg-red-950/70 border border-red-500/50 text-red-200 text-[11px] space-y-0.5">
                    <div className="font-bold flex items-center gap-1 text-red-300">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Security Lockout</span>
                    </div>
                    <p className="text-[10.5px]">Please retry in ~{lockoutMinutes} min.</p>
                  </div>
                )}

                {error && !pendingStatusInfo && !lockoutMinutes && (
                  <div className="p-2 rounded bg-red-950/70 border border-red-500/50 text-red-200 text-[11px] flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Email / Phone Field */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#DCE3F2] uppercase tracking-wider mb-1">
                    Email or Phone
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="pastor@copconnect.org"
                      className="w-full pl-8 pr-3 py-2 rounded bg-black/50 border border-white/20 focus:border-[#D4A017] text-white text-[12px] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#DCE3F2] uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-8 pr-8 py-2 rounded bg-black/50 border border-white/20 focus:border-[#D4A017] text-white text-[12px] focus:outline-none transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-1 py-2.5 rounded-lg bg-[#D4A017] hover:bg-[#C29112] active:bg-[#B38309] text-[#241C08] font-bold text-[13px] uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#241C08]" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={onRequestAccess}
                    className="text-[11px] text-[#C6CEE4] hover:text-[#D4A017] underline transition-colors"
                  >
                    New here? Request access
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Smallest, dimmest line at the very bottom */}
        <div className="text-[#8695BC]/80 text-[10px] tracking-wide mt-4">
          Vision 2028 — Possessing the Nations
        </div>
      </div>
    </div>
  );
};
