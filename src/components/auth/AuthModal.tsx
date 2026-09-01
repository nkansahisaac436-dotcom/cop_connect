import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CopLogo } from '../../assets/CopLogo';
import { 
  X, 
  Shield, 
  UserCheck, 
  Users, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building, 
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Globe2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup_area' | 'signup_pastor';
  onClose: () => void;
  onSuccess: (targetPage: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const { loginWithEmail, registerAreaHead, registerPastor, loginAs } = useAuth();
  const { areas, addArea } = useData();

  const [mode, setMode] = useState<'login' | 'signup_area' | 'signup_pastor'>(initialMode);
  
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [titlePrefix, setTitlePrefix] = useState('Apostle');
  
  // Area Head fields
  const [areaName, setAreaName] = useState('');
  const [region, setRegion] = useState('Greater Accra');
  const [country, setCountry] = useState('Ghana');

  // Pastor fields
  const [pastorAreaId, setPastorAreaId] = useState(areas[0]?.id || '');
  const [districtName, setDistrictName] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setMode(initialMode);
    setError('');
    if (initialMode === 'signup_area') {
      setTitlePrefix('Apostle');
    } else if (initialMode === 'signup_pastor') {
      setTitlePrefix('Pastor');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const result = loginWithEmail(email.trim(), password || undefined);
    if (result.success && result.user) {
      if (result.user.status === 'pending') {
        onSuccess('pending');
      } else if (result.user.role === 'super_admin') {
        onSuccess('admin');
      } else if (result.user.role === 'area_head') {
        onSuccess('area_head');
      } else {
        onSuccess('pastor');
      }
      onClose();
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterAreaHead = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !areaName.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create Area Head Account (Pending Super Admin verification)
      const newAreaHead = registerAreaHead({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
        titlePrefix: titlePrefix || 'Apostle',
        areaName: areaName.trim(),
        region: region.trim(),
        country: country.trim(),
      });

      // 2. Automatically register this Area in the database so pastors can find it
      const existingArea = areas.find(
        (a) => a.name.toLowerCase() === areaName.trim().toLowerCase()
      );
      if (!existingArea) {
        addArea(
          {
            name: areaName.trim(),
            region: region.trim(),
            country: country.trim(),
            areaHeadName: `${titlePrefix || 'Apostle'} ${fullName.trim()} (Pending Verification)`,
          },
          newAreaHead
        );
      }

      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onSuccess('pending');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterPastor = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !districtName.trim() || !pastorAreaId || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const chosenArea = areas.find((a) => a.id === pastorAreaId);

    setIsLoading(true);
    try {
      registerPastor({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
        titlePrefix: titlePrefix || 'Pastor',
        areaId: pastorAreaId,
        areaName: chosenArea?.name || 'Assigned Area',
        districtName: districtName.trim(),
      });

      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onSuccess('pending');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAreaForPastor = areas.find((a) => a.id === pastorAreaId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-cop-blue-900 via-cop-blue-800 to-cop-blue-900 p-5 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <CopLogo size="sm" />
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl leading-tight">
                {mode === 'login' && 'Sign In to COP Connect'}
                {mode === 'signup_area' && 'Area Head Sign Up (Creates Area)'}
                {mode === 'signup_pastor' && 'Pastor Sign Up (Selects Area)'}
              </h2>
              <p className="text-xs text-cop-gold-300">
                The Church of Pentecost &bull; Leadership Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-3 text-center transition-all ${
              mode === 'login'
                ? 'bg-white text-cop-blue-900 border-b-2 border-cop-blue-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup_area');
              setTitlePrefix('Apostle');
              setError('');
            }}
            className={`flex-1 py-3 text-center transition-all ${
              mode === 'signup_area'
                ? 'bg-white text-cop-blue-900 border-b-2 border-cop-blue-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Area Head Sign Up
          </button>
          <button
            onClick={() => {
              setMode('signup_pastor');
              setTitlePrefix('Pastor');
              setError('');
            }}
            className={`flex-1 py-3 text-center transition-all ${
              mode === 'signup_pastor'
                ? 'bg-white text-cop-blue-900 border-b-2 border-cop-blue-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pastor Sign Up
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. your.email@copconnect.org"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-sm font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-sm font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cop-blue-800 hover:bg-cop-blue-900 text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick 1-Click Demo Accounts */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                  Quick 1-Click Test Accounts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      loginAs('usr_super_admin');
                      onSuccess('admin');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-red-400 hover:bg-red-50 text-left transition-all"
                  >
                    <div className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Super Admin
                    </div>
                    <div className="text-[10px] text-slate-600 truncate mt-0.5">Rev. Dr. Boakye (Verifies Area Heads)</div>
                  </button>

                  <button
                    onClick={() => {
                      loginAs('usr_area_kaneshie');
                      onSuccess('area_head');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-cop-blue-400 hover:bg-cop-blue-50 text-left transition-all"
                  >
                    <div className="text-[11px] font-bold text-cop-blue-700 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Area Head
                    </div>
                    <div className="text-[10px] text-slate-600 truncate mt-0.5">Apostle Gyasi (Verifies Pastors)</div>
                  </button>

                  <button
                    onClick={() => {
                      loginAs('usr_pastor_kaneshie_central');
                      onSuccess('pastor');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-cop-gold-400 hover:bg-cop-gold-50 text-left transition-all"
                  >
                    <div className="text-[11px] font-bold text-cop-gold-700 flex items-center gap-1">
                      <Users className="w-3 h-3" /> District Pastor
                    </div>
                    <div className="text-[10px] text-slate-600 truncate mt-0.5">Pastor Mensah</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AREA HEAD SIGNUP FORM */}
          {mode === 'signup_area' && (
            <form onSubmit={handleRegisterAreaHead} className="space-y-3">
              <div className="p-3 rounded-xl bg-cop-blue-50/90 border border-cop-blue-200 text-xs text-cop-blue-950 flex items-start gap-2">
                <Shield className="w-4 h-4 text-cop-blue-700 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Area Head Self-Registration:</strong> Enter your details and the <strong>Area you are heading</strong>.
                  The Super Admin will simply check your credentials and verify you — you do not need to wait for Super Admin to create your Area!
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <select
                    value={titlePrefix}
                    onChange={(e) => setTitlePrefix(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Apostle">Apostle</option>
                    <option value="Apostle Dr.">Apostle Dr.</option>
                    <option value="Area Pastor">Area Pastor</option>
                    <option value="Prophet">Prophet</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Apostle Isaac K. Ayani"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="areahead@thecophq.org"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 20 000 0000"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password (to sign in later) <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set your password"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>

              {/* Direct Area Creation Field */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div>
                  <label className="block text-xs font-bold text-cop-blue-900 mb-1">
                    Area Name You Are Heading <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    placeholder="e.g. Cape Coast Area / Sunyani Area / Dallas Area"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Region / State</label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g. Central Region / Texas"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Ghana / USA / UK"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cop-blue-900 to-cop-blue-800 hover:from-cop-blue-950 text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2"
              >
                <span>Submit Account for Super Admin Verification</span>
                <ArrowRight className="w-4 h-4 text-cop-gold-400" />
              </button>
            </form>
          )}

          {/* PASTOR SIGNUP FORM */}
          {mode === 'signup_pastor' && (
            <form onSubmit={handleRegisterPastor} className="space-y-3">
              <div className="p-3 rounded-xl bg-cop-gold-50/90 border border-cop-gold-200 text-xs text-cop-gold-950 flex items-start gap-2">
                <UserCheck className="w-4 h-4 text-cop-gold-700 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Pastor Registration:</strong> Select your <strong>Area</strong> and enter your <strong>District</strong>.
                  Your Area Head will receive your registration, confirm you are from his Area, and verify your account.
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <select
                    value={titlePrefix}
                    onChange={(e) => setTitlePrefix(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Pastor">Pastor</option>
                    <option value="Rev.">Rev.</option>
                    <option value="Overseer">Overseer</option>
                    <option value="Elder">Elder</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Gabriel Antwi Boasiako"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pastor@copconnect.org"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password (to sign in later) <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set your password"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Your Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={pastorAreaId}
                  onChange={(e) => setPastorAreaId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  required
                >
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.region}, {a.country})
                    </option>
                  ))}
                </select>

                {selectedAreaForPastor && (
                  <div className="mt-1 text-[11px] text-cop-blue-800 font-semibold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-cop-gold-600" />
                    <span>
                      Verifying Area Head: <strong>{selectedAreaForPastor.areaHeadName || 'Assigned Apostle'}</strong>
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  District Name (e.g. Darkuman District) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  placeholder="e.g. Darkuman District / Kaneshie Central"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cop-blue-900 to-cop-blue-800 hover:from-cop-blue-950 text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2"
              >
                <span>Submit Registration for Area Head Verification</span>
                <ArrowRight className="w-4 h-4 text-cop-gold-400" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
