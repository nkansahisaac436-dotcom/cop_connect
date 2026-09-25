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

  // Mode: 'splash' | 'form'
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
        // Successful login
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
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden bg-[#EFEBE2]">
      
      {/* Background: Dimmed Campus Atmosphere Photo */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-20 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('/cop_convention_center.jpg')` }}
      />
      
      {/* Deep Navy Veil for Maximum Legibility */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(9,15,32,0.88) 0%, rgba(12,20,42,0.58) 30%, rgba(12,20,42,0.50) 60%, rgba(6,11,24,0.94) 100%)'
        }}
      />

      {/* Main Hero / Login Stage */}
      <div className="w-full max-w-[340px] sm:max-w-[380px] z-10 transition-all duration-300">
        
        {/* Phone / Glass Shield Stage Card */}
        <div className="relative rounded-[32px] bg-[#060B18]/80 backdrop-blur-md p-6 sm:p-7 shadow-[0_30px_60px_-25px_rgba(19,35,73,0.7)] border border-white/10 flex flex-col items-center text-center">
          
          {/* 1. Official Centerpiece Halo & Raised Badge */}
          <div className="relative w-[140px] h-[140px] flex items-center justify-center my-1">
            {/* Halo Arc */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from -40deg, #D4A017 0deg 95deg, transparent 95deg 180deg, #C0392B 180deg 210deg, transparent 210deg 360deg)',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
                opacity: 0.95
              }}
            />

            {/* Raised White Emblem Badge */}
            <div className="w-[110px] h-[110px] rounded-full bg-white flex items-center justify-center p-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
              <img
                src="/cop_emblem_official.png"
                alt="The Church of Pentecost Official Seal"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* 2. Institutional Title & Wordmark */}
          <div className="mt-5 space-y-1">
            <div className="text-[12px] sm:text-[12.5px] text-[#DCE3F2] tracking-[0.5px] font-medium uppercase">
              THE CHURCH OF PENTECOST
            </div>
            <div className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-wide">
              COP <em className="not-italic text-[#D4A017] italic font-normal">Connect</em>
            </div>
          </div>

          {/* Gold Divider Line */}
          <div 
            className="w-[46px] h-[2px] my-3.5" 
            style={{ backgroundColor: '#D4A017' }} 
          />

          <div className="text-[#C6CEE4] text-[12.5px] tracking-[0.3px] font-normal">
            Official ministerial intranet
          </div>

          {/* 3. VIEW SWITCHER: Hero CTA Mode vs Interactive Login Form */}
          {viewMode === 'splash' && !twoFactorPendingUser ? (
            <div className="w-full mt-7 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Primary Gold CTA */}
              <button
                onClick={() => setViewMode('form')}
                className="w-full py-3.5 px-4 rounded-[4px] bg-[#D4A017] hover:bg-[#C29112] active:bg-[#B38309] text-[#241C08] font-semibold text-[13.5px] tracking-wide transition-all transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue to sign in</span>
                <ArrowRight className="w-4 h-4 text-[#241C08]" />
              </button>

              {/* Secondary Request Access Button */}
              <button
                onClick={onRequestAccess}
                className="w-full py-2.5 px-4 rounded-[4px] bg-white/5 hover:bg-white/10 text-[#DCE3F2] hover:text-white font-medium text-[12.5px] transition-colors border border-white/10 flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>Request access</span>
              </button>
            </div>
          ) : (
            /* Interactive Login & 2FA Form Container */
            <div className="w-full mt-5 text-left space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Back to Hero Preview */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <button
                  type="button"
                  onClick={() => setViewMode('splash')}
                  className="text-[11.5px] text-[#C6CEE4] hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#D4A017]" />
                  <span>Overview</span>
                </button>
                <span className="text-[11px] font-semibold text-[#D4A017] uppercase tracking-wider">
                  {twoFactorPendingUser ? '2FA Verification' : 'Sign In'}
                </span>
              </div>

              {/* 2FA Mode */}
              {twoFactorPendingUser ? (
                <form onSubmit={handle2FASubmit} className="space-y-3">
                  <div className="text-center space-y-1">
                    <p className="text-[12px] text-slate-300">
                      Security code for <strong className="text-white">{twoFactorPendingUser.fullName}</strong>
                    </p>
                  </div>

                  {error && (
                    <div className="p-2.5 rounded bg-red-950/60 border border-red-500/50 text-red-200 text-[11px] flex items-center gap-1.5">
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
                    className="w-full text-center tracking-[0.4em] font-mono font-bold text-xl py-2 rounded bg-black/40 border border-white/20 text-white focus:border-[#D4A017] focus:outline-none"
                    autoFocus
                    required
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-[4px] bg-[#D4A017] hover:bg-[#C29112] text-[#241C08] font-bold text-[13px] uppercase tracking-wide transition-all"
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
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  
                  {/* Status Alerts */}
                  {pendingStatusInfo && (
                    <div className="p-2.5 rounded bg-amber-950/60 border border-amber-500/50 text-amber-200 text-[11px] space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-amber-300">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Pending Verification</span>
                      </div>
                      <p className="text-[10.5px] text-amber-200/90">{pendingStatusInfo}</p>
                    </div>
                  )}

                  {lockoutMinutes && (
                    <div className="p-2.5 rounded bg-red-950/60 border border-red-500/50 text-red-200 text-[11px] space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-red-300">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Security Lockout</span>
                      </div>
                      <p className="text-[10.5px]">Please retry in ~{lockoutMinutes} min.</p>
                    </div>
                  )}

                  {error && !pendingStatusInfo && !lockoutMinutes && (
                    <div className="p-2.5 rounded bg-red-950/60 border border-red-500/50 text-red-200 text-[11.5px] flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Identifier Input */}
                  <div>
                    <label className="block text-[10.5px] font-semibold text-[#DCE3F2] uppercase tracking-wider mb-1">
                      Email or Phone
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="pastor@copconnect.org"
                        className="w-full pl-8 pr-3 py-2 rounded bg-black/40 border border-white/20 focus:border-[#D4A017] text-white text-[12px] focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-[10.5px] font-semibold text-[#DCE3F2] uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-8 py-2 rounded bg-black/40 border border-white/20 focus:border-[#D4A017] text-white text-[12px] focus:outline-none transition-colors"
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
                    className="w-full mt-2 py-3 rounded-[3px] bg-[#D4A017] hover:bg-[#C29112] active:bg-[#B38309] text-[#241C08] font-bold text-[13px] uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#241C08]" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={onRequestAccess}
                      className="text-[11.5px] text-[#C6CEE4] hover:text-[#D4A017] underline transition-colors"
                    >
                      New here? Request access
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer Theme */}
          <div className="mt-6 pt-3 border-t border-white/10 w-full text-center">
            <div className="text-[#8695BC] text-[10.5px] tracking-wide">
              Vision 2028 — Possessing the Nations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
