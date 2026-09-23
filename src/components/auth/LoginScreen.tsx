import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CopLogo } from '../../assets/CopLogo';
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
  Users, 
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Sparkles
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
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Auto-clear error when user types
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
      setError('Please enter your email address or phone number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const result = await login(identifier, password);

    if (result.success) {
      if (result.requires2FA) {
        // 2FA step will render automatically from AuthContext.twoFactorPendingUser
        setError(null);
      } else {
        // Pastors or verified sessions
        // Auth state will trigger navigation
      }
    } else {
      if (result.status === 'pending') {
        setPendingStatusInfo(result.error || 'Your account is pending verification.');
      } else if (result.lockedMinutes) {
        setLockoutMinutes(result.lockedMinutes);
        setError(result.error || 'Account is temporarily locked.');
      } else {
        setError(result.error || 'Invalid credentials. Please try again.');
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

  const fillTestCredentials = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setError(null);
    setPendingStatusInfo(null);
    setLockoutMinutes(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Decorative COP Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(19,62,135,0.4),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cop-blue-700 via-cop-gold-500 to-cop-red-600" />

      <div className="relative w-full max-w-md space-y-6">
        {/* Church Seal & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex justify-center p-3 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <CopLogo size="lg" showText={false} />
          </div>
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              COP Connect
            </h1>
            <p className="text-xs sm:text-sm text-cop-gold-400 font-semibold tracking-wide uppercase">
              The Church of Pentecost Worldwide
            </p>
            <p className="text-[11px] text-slate-400">
              Vision 2028: Possessing the Nations &bull; Leadership Portal
            </p>
          </div>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          {/* TWO-FACTOR AUTHENTICATION VIEW */}
          {twoFactorPendingUser ? (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-cop-blue-50 text-cop-blue-800 rounded-2xl flex items-center justify-center mx-auto ring-4 ring-cop-blue-100">
                  <KeyRound className="w-6 h-6 text-cop-blue-700" />
                </div>
                <h2 className="font-heading font-extrabold text-xl text-slate-900">
                  Two-Factor Verification
                </h2>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Leadership security check for{' '}
                  <strong className="text-slate-800">{twoFactorPendingUser.fullName}</strong> (
                  <span className="text-cop-blue-700 font-semibold uppercase">
                    {twoFactorPendingUser.role.replace('_', ' ')}
                  </span>
                  ).
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handle2FASubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                    Enter 6-Digit Authenticator / SMS Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="195328"
                    className="w-full text-center tracking-[0.4em] font-mono font-black text-2xl py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-cop-blue-700 focus:bg-white focus:outline-none transition-all"
                    autoFocus
                    required
                  />
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setTwoFactorCode('195328')}
                      className="text-[11px] text-cop-blue-700 font-semibold hover:underline bg-cop-blue-50 px-2.5 py-1 rounded-lg border border-cop-blue-200"
                    >
                      Autofill Sample Code (195328)
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cop-blue-900 to-cop-blue-800 hover:from-cop-blue-950 text-white font-heading font-extrabold text-sm shadow-cop hover:shadow-cop-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Verify & Access Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-cop-gold-400" />
                  </button>

                  <button
                    type="button"
                    onClick={cancel2FA}
                    className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors"
                  >
                    Cancel & Return to Login
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* STANDARD LOGIN VIEW */
            <div className="space-y-5">
              <div>
                <h2 className="font-heading font-extrabold text-xl text-slate-900">
                  Minister & Leader Sign In
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in to access your Area, District, or National dashboard.
                </p>
              </div>

              {/* Status Alert: Pending Verification */}
              {pendingStatusInfo && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1.5 animate-in fade-in">
                  <div className="font-bold flex items-center gap-2 text-amber-900 text-sm">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>Access Request Pending</span>
                  </div>
                  <p className="leading-relaxed">{pendingStatusInfo}</p>
                  <p className="text-[11px] text-amber-800 font-medium pt-1 border-t border-amber-200">
                    Contact your Area Secretariat or Head Office if you need expedited clearance.
                  </p>
                </div>
              )}

              {/* Status Alert: Lockout Notice */}
              {lockoutMinutes && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-950 text-xs space-y-1.5 animate-in fade-in">
                  <div className="font-bold flex items-center gap-2 text-red-900 text-sm">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Account Temporarily Locked (15 Min)</span>
                  </div>
                  <p className="leading-relaxed">
                    5 consecutive failed login attempts detected. To protect church records, this account is locked for approximately{' '}
                    <strong>{lockoutMinutes} minute(s)</strong>.
                  </p>
                </div>
              )}

              {/* Standard Error Notice */}
              {error && !pendingStatusInfo && !lockoutMinutes && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email or Phone Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address or Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. pastor.kaneshie@copconnect.org"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-cop-blue-700 focus:bg-white focus:outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Input with Visibility Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Case sensitive
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-cop-blue-700 focus:bg-white focus:outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cop-blue-900 via-cop-blue-800 to-cop-blue-900 hover:from-cop-blue-950 hover:to-cop-blue-900 text-white font-heading font-extrabold text-sm shadow-cop hover:shadow-cop-lg transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
                >
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4 text-cop-gold-400" />
                </button>
              </form>

              {/* No Public Open Sign Up — Dedicated Request Access Link */}
              <div className="pt-4 border-t border-slate-100 text-center space-y-2">
                <p className="text-xs text-slate-600">
                  New minister or area leadership appointment?
                </p>
                <button
                  type="button"
                  onClick={onRequestAccess}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-cop-blue-900 bg-cop-blue-50 hover:bg-cop-blue-100 border border-cop-blue-200 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-cop-gold-600" />
                  <span>Request Access & Identity Verification</span>
                </button>
                <div className="text-[10px] text-slate-400 italic">
                  * All accounts require superior verification (Area Head or Super Admin) before activation.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 1-Click Evaluation Credentials Drawer */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 overflow-hidden text-white text-xs">
          <button
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            className="w-full p-3.5 flex items-center justify-between font-bold text-cop-gold-300 hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cop-gold-400" />
              <span>Evaluator Quick-Fill Credentials</span>
            </span>
            {showDemoCredentials ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDemoCredentials && (
            <div className="p-4 pt-1 space-y-2.5 bg-slate-950/40 border-t border-white/10">
              <p className="text-[11px] text-slate-300">
                Click any profile to autofill test credentials (Password is default <code>cop12345</code>):
              </p>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => fillTestCredentials('admin@thecophq.org', 'cop12345')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400 text-left transition-all"
                >
                  <div className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                    <span>Super Admin (National Scope & Verifies Area Heads)</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Rev. Dr. Boakye &bull; <code>admin@thecophq.org</code> (2FA code: 195328)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fillTestCredentials('kaneshie.area@thecophq.org', 'cop12345')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-cop-blue-500/20 border border-white/10 hover:border-cop-blue-400 text-left transition-all"
                >
                  <div className="text-xs font-bold text-cop-blue-300 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-cop-gold-400" />
                    <span>Area Head (Kaneshie Area & Verifies Pastors)</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Apostle Gyasi &bull; <code>kaneshie.area@thecophq.org</code> (2FA code: 195328)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fillTestCredentials('pastor.kaneshie@copconnect.org', 'cop12345')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-left transition-all"
                >
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>District Pastor (Kaneshie Central)</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Pastor Mensah &bull; <code>pastor.kaneshie@copconnect.org</code> (Direct login)
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Tenets Footer */}
        <div className="text-center text-[11px] text-slate-400 space-y-1">
          <div>Verified Ministerial Platform &bull; The Church of Pentecost</div>
          <div className="text-slate-500 text-[10px]">
            Protected with Web Crypto SHA-256 password salting, 15-min brute-force lockout, and dual-layer authorization.
          </div>
        </div>
      </div>
    </div>
  );
};
