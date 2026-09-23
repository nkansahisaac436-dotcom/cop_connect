import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { compressImage } from '../../utils/imageCompressor';
import { 
  UserCheck, 
  Users, 
  ShieldCheck, 
  Upload, 
  Camera, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Lock, 
  Shield,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequestAccessScreenProps {
  onBackToLogin: () => void;
}

const SAMPLE_AVATARS = [
  { label: 'Minister 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Minister 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Minister 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Minister 4', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
];

export const RequestAccessScreen: React.FC<RequestAccessScreenProps> = ({ onBackToLogin }) => {
  const { requestAccess, users } = useAuth();
  const { areas, addArea } = useData();

  // Form State
  const hasExistingSuperAdmin = users.some((u) => u.role === 'super_admin');
  const [claimedRole, setClaimedRole] = useState<'super_admin' | 'area_head' | 'pastor'>('pastor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [titlePrefix, setTitlePrefix] = useState('Pastor');
  
  // Area / District assignments
  const [selectedAreaId, setSelectedAreaId] = useState<string>(areas[0]?.id || '');
  const [customAreaName, setCustomAreaName] = useState('');
  const [region, setRegion] = useState('Greater Accra');
  const [country, setCountry] = useState('Ghana');
  const [districtName, setDistrictName] = useState('');

  // Required Face ID / Verification Photo
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [notes, setNotes] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUser, setSubmittedUser] = useState<any | null>(null);

  const selectedArea = areas.find((a) => a.id === selectedAreaId);

  // Handle Photo File Upload with compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 600, 600, 0.85);
      setProfilePhoto(compressed);
      setError(null);
    } catch (err) {
      setError('Could not process the uploaded photo. Please select another image.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please fill in all required personal information fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!profilePhoto) {
      setError('A clear face or ID portrait photo is required for ministerial verification.');
      return;
    }

    if (claimedRole === 'area_head' && !customAreaName.trim()) {
      setError('Please specify the Area name you are heading.');
      return;
    }

    if (claimedRole === 'pastor' && (!selectedAreaId || !districtName.trim())) {
      setError('Please select your Area and provide your assigned District name.');
      return;
    }

    setIsSubmitting(true);

    try {
      let areaNameToUse = '';
      let areaIdToUse = undefined;

      if (claimedRole === 'super_admin') {
        areaNameToUse = 'General Headquarters';
      } else if (claimedRole === 'area_head') {
        areaNameToUse = customAreaName.trim();
        const existingArea = areas.find(
          (a) => a.name.toLowerCase() === areaNameToUse.toLowerCase()
        );
        if (existingArea) {
          areaIdToUse = existingArea.id;
        }
      } else {
        areaNameToUse = selectedArea?.name || 'Selected Area';
        areaIdToUse = selectedAreaId;
      }

      const newUser = await requestAccess({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        claimedRole,
        claimedAreaId: areaIdToUse,
        claimedAreaName: areaNameToUse,
        claimedDistrictName: claimedRole === 'pastor' ? districtName.trim() : undefined,
        region: claimedRole === 'area_head' ? region.trim() : selectedArea?.region,
        country: claimedRole === 'area_head' ? country.trim() : selectedArea?.country,
        profilePhoto,
        notes: notes.trim() || undefined,
      });

      // If Area Head registering a new Area, make sure area is recorded
      if (claimedRole === 'area_head' && !areas.some((a) => a.name.toLowerCase() === areaNameToUse.toLowerCase())) {
        addArea(
          {
            name: areaNameToUse,
            region: region.trim(),
            country: country.trim(),
            areaHeadName: `${titlePrefix} ${fullName.trim()} (Pending Verification)`,
          },
          newUser
        );
      }

      confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } });
      setSubmittedUser(newUser);
    } catch (err: any) {
      setError(err.message || 'Failed to submit access request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find Approver description for display
  const getApproverInfo = () => {
    if (!submittedUser) return null;
    if (submittedUser.role === 'super_admin') {
      if (submittedUser.status === 'approved') {
        return {
          title: 'General Headquarters Administration',
          name: 'Primary Super Administrator',
          scope: 'National Headquarters Scope',
        };
      }
      return {
        title: 'National Super Admin (General Headquarters)',
        name: 'Existing General Secretariat Overseer',
        scope: 'National Scope',
      };
    }
    if (submittedUser.role === 'area_head') {
      return {
        title: 'National Super Admin (General Headquarters)',
        name: 'Head Office Administration',
        scope: 'National Scope',
      };
    } else {
      const areaHead = users.find(
        (u) => u.role === 'area_head' && (u.areaId === submittedUser.areaId || u.areaName === submittedUser.areaName)
      );
      return {
        title: `${submittedUser.areaName} Area Head`,
        name: areaHead ? `${areaHead.titlePrefix || 'Apostle'} ${areaHead.fullName}` : 'Assigned Area Apostle',
        scope: submittedUser.areaName,
      };
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center py-8 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden">
      
      {/* Background Facility Photo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20"
        style={{ backgroundImage: `url('/cop_convention_center.jpg')` }}
      />
      
      {/* Dark Navy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#091B33]/85 via-[#0B2545]/92 to-[#040D1A]/96 backdrop-blur-[2px] -z-10" />

      {/* Top Gold Trim */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002D72] via-[#F1B51C] to-[#002D72]" />

      {/* Top Bar */}
      <header className="w-full max-w-2xl flex items-center justify-between z-10 pt-2 pb-4">
        <button
          onClick={onBackToLogin}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#F1B51C] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>
        <span className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">
          Ministerial Access Gateway
        </span>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl z-10 space-y-4 my-auto">
        
        {/* SUBMISSION CONFIRMATION VIEW */}
        {submittedUser ? (
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#0B2545]">
                {submittedUser.status === 'approved' ? 'Administrator Account Initialized!' : 'Access Request Submitted!'}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{submittedUser.titlePrefix} {submittedUser.fullName}</strong>. Your account has been registered with status{' '}
                <span className={`font-bold px-2 py-0.5 rounded ${submittedUser.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {submittedUser.status.toUpperCase()}
                </span>.
              </p>
            </div>

            {/* Routing Card */}
            {getApproverInfo() && (
              <div className="bg-gradient-to-br from-[#0B2545] to-[#040D1A] rounded-lg p-5 text-white space-y-2.5 border border-[#F1B51C]/30">
                <div className="flex items-center gap-2 text-[#F1B51C] text-[11px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#F1B51C]" />
                  <span>Approver Routing</span>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-300">Your application has been routed to:</div>
                  <div className="font-serif font-bold text-base text-white">
                    {getApproverInfo()?.name}
                  </div>
                  <div className="text-xs text-[#F1B51C] font-semibold">
                    {getApproverInfo()?.title}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 leading-relaxed">
                  {submittedUser.role === 'pastor' ? (
                    <span>
                      Because the Area Head oversees ministers in <strong>{submittedUser.areaName}</strong>, your application for <strong>{submittedUser.districtName}</strong> will be independently verified. Once confirmed, you can log in directly.
                    </span>
                  ) : submittedUser.role === 'area_head' ? (
                    <span>
                      The National Super Admin at General Headquarters will verify your leadership over <strong>{submittedUser.areaName}</strong>. Once approved, your Area will be activated on the national network.
                    </span>
                  ) : (
                    <span>
                      You have initialized the General Headquarters National Super Admin account. You may now log in to oversee Area Head verifications and global access logs.
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={onBackToLogin}
              className="w-full py-3 rounded-md bg-[#F1B51C] hover:bg-[#E5A812] text-[#091B33] font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Login Screen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* REGISTRATION FORM VIEW */
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 animate-in fade-in">
            {/* Header */}
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#002D72] text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F1B51C]" />
                <span>Identity Verification Protocol</span>
              </div>
              <h2 className="font-serif font-bold text-xl text-[#0B2545] uppercase tracking-wide mt-0.5">
                Request Ministerial Account
              </h2>
              <p className="text-xs text-slate-500">
                All accounts require formal superior clearance before dashboard and posting rights are granted.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-300 text-red-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 1. ROLE SELECTION */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-[#0B2545] uppercase tracking-wider">
                  1. Select Your Ministerial Role <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => {
                      setClaimedRole('pastor');
                      setTitlePrefix('Pastor');
                    }}
                    className={`p-3 rounded-md border-2 cursor-pointer transition-all ${
                      claimedRole === 'pastor'
                        ? 'border-[#002D72] bg-[#002D72]/5'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#0B2545]">
                      <Users className="w-4 h-4 text-[#F1B51C]" />
                      <span>District Pastor</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Assigned to 1 District. Verified by Area Head.
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setClaimedRole('area_head');
                      setTitlePrefix('Apostle');
                    }}
                    className={`p-3 rounded-md border-2 cursor-pointer transition-all ${
                      claimedRole === 'area_head'
                        ? 'border-[#002D72] bg-[#002D72]/5'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#0B2545]">
                      <UserCheck className="w-4 h-4 text-[#F1B51C]" />
                      <span>Area Head (Apostle)</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Assigned to 1 Area. Verified by Super Admin.
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setClaimedRole('super_admin');
                      setTitlePrefix('Rev. Dr.');
                    }}
                    className={`p-3 rounded-md border-2 cursor-pointer transition-all ${
                      claimedRole === 'super_admin'
                        ? 'border-[#002D72] bg-[#002D72]/5'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#0B2545]">
                      <Shield className="w-4 h-4 text-[#F1B51C]" />
                      <span>Super Admin (HQ)</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      General Headquarters national administration.
                    </div>
                  </div>
                </div>

                {!hasExistingSuperAdmin && claimedRole === 'super_admin' && (
                  <div className="p-2.5 rounded-md bg-[#002D72]/5 border border-[#002D72]/20 text-[11px] text-[#002D72] flex items-start gap-1.5">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#002D72]" />
                    <span>
                      <strong>Root Setup Notice:</strong> As no Super Admin account currently exists, submitting this form will initialize the primary General Headquarters administrator.
                    </span>
                  </div>
                )}
              </div>

              {/* 2. REQUIRED PORTRAIT / FACE PHOTO UPLOAD */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-bold text-[#0B2545] uppercase tracking-wider">
                  2. Face / ID Portrait Photo (Required for Identity Verification) <span className="text-red-600">*</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3.5 rounded-md border border-slate-200">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Portrait Preview"
                      className="w-16 h-16 rounded-md object-cover ring-2 ring-[#002D72] shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-slate-200 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-500">
                      <Camera className="w-5 h-5" />
                      <span className="text-[8px] font-bold mt-0.5">Photo</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3.5 py-1.5 rounded-md bg-[#002D72] hover:bg-[#091B33] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Portrait Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {profilePhoto && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Photo Attached
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      <span className="text-[10px] text-slate-400 font-medium">Or quick sample:</span>
                      {SAMPLE_AVATARS.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProfilePhoto(s.url)}
                          className={`p-0.5 rounded border transition-all ${
                            profilePhoto === s.url ? 'border-[#002D72] ring-1 ring-[#002D72]' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={s.url} alt={s.label} className="w-6 h-6 rounded object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. PERSONAL DETAILS */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-bold text-[#0B2545] uppercase tracking-wider">
                  3. Minister Details
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Title</label>
                    <select
                      value={titlePrefix}
                      onChange={(e) => setTitlePrefix(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-md bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800"
                    >
                      {claimedRole === 'super_admin' ? (
                        <>
                          <option value="Rev. Dr.">Rev. Dr.</option>
                          <option value="Apostle">Apostle</option>
                        </>
                      ) : claimedRole === 'area_head' ? (
                        <>
                          <option value="Apostle">Apostle</option>
                          <option value="Apostle Dr.">Apostle Dr.</option>
                          <option value="Prophet">Prophet</option>
                          <option value="Area Pastor">Area Pastor</option>
                        </>
                      ) : (
                        <>
                          <option value="Pastor">Pastor</option>
                          <option value="Rev.">Rev.</option>
                          <option value="Overseer">Overseer</option>
                          <option value="Elder">Elder</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Isaac Kwadwo Mensah"
                      className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#002D72]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Official Email <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="pastor.name@copconnect.org"
                        className="w-full pl-8 pr-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#002D72]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+233 24 000 0000"
                        className="w-full pl-8 pr-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#002D72]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-8 pr-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#002D72]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-8 pr-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#002D72]"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. HIERARCHY & ASSIGNMENT */}
              {claimedRole !== 'super_admin' && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <label className="block text-[11px] font-bold text-[#0B2545] uppercase tracking-wider">
                    4. Area & District Jurisdiction
                  </label>

                  {claimedRole === 'area_head' ? (
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#0B2545] mb-0.5">
                          Area Name You Head <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={customAreaName}
                          onChange={(e) => setCustomAreaName(e.target.value)}
                          placeholder="e.g. Cape Coast Area / Sunyani Area"
                          className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-xs font-bold text-slate-900"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Region</label>
                          <input
                            type="text"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-md bg-white border border-slate-300 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Country</label>
                          <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-md bg-white border border-slate-300 text-xs"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#0B2545] mb-0.5">
                          Select Your Area <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={selectedAreaId}
                          onChange={(e) => setSelectedAreaId(e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-xs font-bold text-slate-900"
                          required
                        >
                          {areas.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.region}, {a.country})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                          Assigned District Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={districtName}
                          onChange={(e) => setDistrictName(e.target.value)}
                          placeholder="e.g. Darkuman District / Kaneshie Central"
                          className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-xs font-semibold text-slate-900"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. NOTES */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-bold text-[#0B2545] uppercase tracking-wider">
                  5. Remarks / Note to Superior
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Optional appointment or transfer context..."
                  className="w-full p-2.5 rounded-md bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#002D72]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-md bg-[#F1B51C] hover:bg-[#E5A812] text-[#091B33] font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Access Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl text-center py-2 text-slate-400 text-[10px] z-10">
        The Church of Pentecost Worldwide &bull; Verified Leadership Intranet
      </footer>
    </div>
  );
};
