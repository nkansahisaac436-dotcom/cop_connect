import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  KeyRound, 
  ArrowRight, 
  UserCheck, 
  ShieldAlert
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

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pendingStatusInfo, setPendingStatusInfo] = useState<string | null>(null);
  const [lockoutMinutes, setLockoutMinutes] = useState<number | null>(null);

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
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center py-10 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden">
      
      {/* Background: Subtle Darkened Church Facility Photograph */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20"
        style={{ backgroundImage: `url('/cop_convention_center.jpg')` }}
      />
      
      {/* Deep Institutional Navy Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#091B33]/85 via-[#0B2545]/92 to-[#040D1A]/96 backdrop-blur-[2px] -z-10" />

      {/* Top COP Gold Trim Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002D72] via-[#F1B51C] to-[#002D72]" />

      {/* Header Banner */}
      <header className="w-full max-w-md text-center pt-2 space-y-1 z-10">
        <div className="inline-block px-3 py-1 rounded bg-[#091B33]/80 border border-[#F1B51C]/30 text-[#F1B51C] text-[10px] font-bold tracking-widest uppercase">
          Vision 2028: Possessing the Nations
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-md my-auto z-10 space-y-5">
        
        {/* Official COP Centerpiece Emblem */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="relative p-2.5 rounded-full bg-white shadow-2xl border-2 border-[#F1B51C]/80 ring-4 ring-black/20">
            <img
              src="/cop_emblem_official.png"
              alt="The Church of Pentecost Official Seal"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
            />
          </div>

          <div className="space-y-0.5">
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-wider uppercase drop-shadow-md">
              THE CHURCH OF PENTECOST
            </h1>
            <p className="text-xs font-bold text-[#F1B51C] tracking-widest uppercase">
              COP Connect &bull; Ministerial Intranet
            </p>
          </div>
        </div>

        {/* Authentication Card */}
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          
          {/* 2FA Challenge View */}
          {twoFactorPendingUser ? (
            <div className="space-y-4">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 bg-[#0B2545]/10 text-[#002D72] rounded-lg flex items-center justify-center mx-auto border border-[#002D72]/20">
                  <KeyRound className="w-6 h-6 text-[#002D72]" />
                </div>
                <h2 className="font-serif font-bold text-xl text-[#0B2545]">
                  Two-Factor Verification
                </h2>
                <p className="text-xs text-slate-600">
                  Leadership verification for{' '}
                  <strong className="text-slate-900">{twoFactorPendingUser.fullName}</strong> (
                  <span className="text-[#002D72] font-bold uppercase text-[11px]">
                    {twoFactorPendingUser.role.replace('_', ' ')}
                  </span>
                  ).
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-300 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handle2FASubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 text-center uppercase tracking-wider">
                    Enter 6-Digit Authenticator Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full text-center tracking-[0.5em] font-mono font-black text-2xl py-2.5 rounded-md bg-slate-50 border-2 border-slate-300 focus:border-[#002D72] focus:bg-white focus:outline-none transition-all"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-md bg-[#F1B51C] hover:bg-[#E5A812] text-[#091B33] font-bold text-xs uppercase tracking-wider shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={cancel2FA}
                    className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                  >
                    Return to Login
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Standard Login View */
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-serif font-bold text-lg text-[#0B2545] uppercase tracking-wide">
                  Minister Sign In
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your credentials to access the verified network.
                </p>
              </div>

              {/* Status Alert: Pending Verification */}
              {pendingStatusInfo && (
                <div className="p-3.5 rounded-md bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900 text-xs">
                    <Clock className="w-4 h-4 text-amber-700 animate-spin" />
                    <span>Application Pending Verification</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">{pendingStatusInfo}</p>
                </div>
              )}

              {/* Status Alert: Lockout Notice */}
              {lockoutMinutes && (
                <div className="p-3.5 rounded-md bg-red-50 border border-red-300 text-red-950 text-xs space-y-1 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-red-900 text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Account Locked (Security Protection)</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    5 consecutive failed attempts. To protect church data, please wait approximately{' '}
                    <strong>{lockoutMinutes} minute(s)</strong>.
                  </p>
                </div>
              )}

              {/* Error Notice */}
              {error && !pendingStatusInfo && !lockoutMinutes && (
                <div className="p-3 rounded-md bg-red-50 border border-red-300 text-red-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {/* Email / Phone Field */}
                <div>
                  <label className="block text-[11px] font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                    Email Address or Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="minister@copconnect.org"
                      className="w-full pl-9 pr-3 py-2.5 rounded-md bg-slate-50 border border-slate-300 focus:border-[#002D72] focus:bg-white focus:outline-none text-xs font-medium text-slate-900 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-[11px] font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-md bg-slate-50 border border-slate-300 focus:border-[#002D72] focus:bg-white focus:outline-none text-xs font-medium text-slate-900 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 rounded-md bg-[#F1B51C] hover:bg-[#E5A812] active:bg-[#D99A08] text-[#091B33] font-bold text-xs uppercase tracking-wider shadow hover:shadow-md transition-all flex items-center justify-center gap-2 border border-[#D99A08]"
                >
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4 text-[#091B33]" />
                </button>
              </form>

              {/* Request Access Gateway Link */}
              <div className="pt-3 border-t border-slate-100 text-center space-y-1.5">
                <p className="text-xs text-slate-600">
                  New appointment or transfer?
                </p>
                <button
                  type="button"
                  onClick={onRequestAccess}
                  className="w-full py-2.5 rounded-md text-xs font-bold text-[#002D72] bg-[#002D72]/5 hover:bg-[#002D72]/10 border border-[#002D72]/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#F1B51C]" />
                  <span>Request Ministerial Access</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="w-full max-w-md text-center py-2 space-y-1 text-slate-300 text-[11px] z-10">
        <div className="flex items-center justify-center gap-2 text-[#F1B51C] font-semibold text-[10px] tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Church Collaboration Network</span>
        </div>
        <div className="text-slate-400 text-[10px]">
          &copy; {new Date().getFullYear()} The Church of Pentecost. General Headquarters, Accra.
        </div>
      </footer>
    </div>
  );
};
