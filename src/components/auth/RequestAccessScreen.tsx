import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CopLogo } from '../../assets/CopLogo';
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
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Lock, 
  FileText,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequestAccessScreenProps {
  onBackToLogin: () => void;
}

const SAMPLE_AVATARS = [
  { label: 'Minister Photo 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Minister Photo 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Minister Photo 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Minister Photo 4', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
];

export const RequestAccessScreen: React.FC<RequestAccessScreenProps> = ({ onBackToLogin }) => {
  const { requestAccess, users } = useAuth();
  const { areas, addArea } = useData();

  // Form State
  const [claimedRole, setClaimedRole] = useState<'area_head' | 'pastor'>('pastor');
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
      setError('A clear face or ID profile photo is required for identity verification.');
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

      if (claimedRole === 'area_head') {
        areaNameToUse = customAreaName.trim();
        // Check if area already exists in registry
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
    if (submittedUser.role === 'area_head') {
      return {
        title: 'National Super Admin (General Headquarters)',
        name: 'Rev. Dr. Samuel Kwadwo Boakye',
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(19,62,135,0.4),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cop-blue-700 via-cop-gold-500 to-cop-red-600" />

      <div className="relative w-full max-w-2xl space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center gap-2 text-xs font-bold text-cop-gold-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Verification Portal
            </span>
          </div>
        </div>

        {/* SUBMISSION CONFIRMATION VIEW */}
        {submittedUser ? (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-10 space-y-6 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-slate-900">
                Access Request Submitted!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{submittedUser.titlePrefix} {submittedUser.fullName}</strong>. Your account has been registered with status <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">PENDING</span>.
              </p>
            </div>

            {/* Routing Card */}
            {getApproverInfo() && (
              <div className="bg-gradient-to-br from-cop-blue-900 to-cop-blue-950 rounded-2xl p-5 text-white space-y-3 border border-cop-gold-500/30">
                <div className="flex items-center gap-2 text-cop-gold-300 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-cop-gold-400" />
                  <span>Independent Approver Routing</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-300">Your application has been routed directly to:</div>
                  <div className="font-heading font-extrabold text-lg text-white">
                    {getApproverInfo()?.name}
                  </div>
                  <div className="text-xs text-cop-gold-300 font-semibold">
                    {getApproverInfo()?.title}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] text-slate-300 leading-relaxed">
                  {submittedUser.role === 'pastor' ? (
                    <span>
                      Because the Area Head oversees pastors in <strong>{submittedUser.areaName}</strong>, Apostle {getApproverInfo()?.name} will independently verify your appointment for <strong>{submittedUser.districtName}</strong>. Once approved, you will be able to sign in immediately.
                    </span>
                  ) : (
                    <span>
                      The National Super Admin at General Headquarters will verify your appointment over <strong>{submittedUser.areaName}</strong>. Once activated, your Area will go live and your district pastors will be able to register under you.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cop-blue-700" />
                <span>What happens next?</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                <li>Your face verification photo and details are in the approver's queue.</li>
                <li>When you attempt to sign in with your email/phone and password, your pending status will display.</li>
                <li>Once approved by your superior, full dashboard and posting privileges are unlocked automatically.</li>
              </ul>
            </div>

            <button
              onClick={onBackToLogin}
              className="w-full py-3.5 rounded-2xl bg-cop-blue-900 hover:bg-cop-blue-950 text-white font-heading font-extrabold text-sm shadow-cop transition-all flex items-center justify-center gap-2"
            >
              <span>Return to Login Screen</span>
              <ArrowRight className="w-4 h-4 text-cop-gold-400" />
            </button>
          </div>
        ) : (
          /* REGISTRATION FORM VIEW */
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cop-blue-800 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-cop-gold-600" />
                <span>COP Identity & Access Request</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-slate-900">
                Request Ministerial Account
              </h2>
              <p className="text-xs text-slate-500">
                All accounts start from a formal request and are verified by your Area Head or Super Admin.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. ROLE SELECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  1. Select Your Claimed Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setClaimedRole('pastor');
                      setTitlePrefix('Pastor');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      claimedRole === 'pastor'
                        ? 'border-cop-gold-500 bg-cop-gold-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${claimedRole === 'pastor' ? 'bg-cop-gold-500 text-slate-950' : 'bg-slate-200 text-slate-600'}`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">District Pastor</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Assigned to 1 District. Verified by your Area Head.
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setClaimedRole('area_head');
                      setTitlePrefix('Apostle');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      claimedRole === 'area_head'
                        ? 'border-cop-blue-700 bg-cop-blue-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${claimedRole === 'area_head' ? 'bg-cop-blue-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">Area Head (Apostle)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Assigned to 1 Area. Verified by Super Admin.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. REQUIRED FACE / ID PHOTO UPLOAD */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  2. Face / ID Photo Upload (Required for Identity Verification) <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Approvers inspect this clear portrait to confirm your identity before granting church access.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {/* Photo Preview */}
                  <div className="relative flex-shrink-0">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile Preview"
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cop-gold-500 shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-slate-200 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-6 h-6" />
                        <span className="text-[9px] font-bold mt-1">Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Uploader Controls */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-4 py-2 rounded-xl bg-cop-blue-900 hover:bg-cop-blue-950 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Face Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {profilePhoto && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Photo Selected
                        </span>
                      )}
                    </div>

                    {/* Preset sample avatars for quick browser testing */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-slate-500">
                        Or select quick demo photo:
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {SAMPLE_AVATARS.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setProfilePhoto(s.url)}
                            className={`p-0.5 rounded-lg border-2 transition-all flex-shrink-0 ${
                              profilePhoto === s.url ? 'border-cop-gold-500 ring-2 ring-cop-gold-400' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={s.url} alt={s.label} className="w-8 h-8 rounded-md object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. PERSONAL DETAILS */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  3. Minister Contact & Profile
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                    <select
                      value={titlePrefix}
                      onChange={(e) => setTitlePrefix(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                    >
                      {claimedRole === 'area_head' ? (
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
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Isaac Kwadwo Mensah"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="pastor.name@copconnect.org"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+233 24 000 0000"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Setup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Create Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. JURISDICTION & ASSIGNMENT */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  4. Hierarchy & Assignment
                </label>

                {claimedRole === 'area_head' ? (
                  /* Area Head Assignment: Declare Area */
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-cop-blue-900 mb-1">
                        Area Name You Head <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customAreaName}
                        onChange={(e) => setCustomAreaName(e.target.value)}
                        placeholder="e.g. Cape Coast Area / Sunyani Area / Dallas Area"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Region / State</label>
                        <input
                          type="text"
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          placeholder="e.g. Central Region"
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Country</label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. Ghana / USA"
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Pastor Assignment: Select Area & District */
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-cop-blue-900 mb-1">
                        Select Your Area <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedAreaId}
                        onChange={(e) => setSelectedAreaId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900"
                        required
                      >
                        {areas.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.region}, {a.country})
                          </option>
                        ))}
                      </select>

                      {selectedArea && (
                        <div className="mt-1.5 text-[11px] text-cop-blue-800 font-semibold flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-cop-gold-600" />
                          <span>
                            Approving Area Head:{' '}
                            <strong>{selectedArea.areaHeadName || 'Assigned Area Head'}</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Assigned District Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={districtName}
                        onChange={(e) => setDistrictName(e.target.value)}
                        placeholder="e.g. Darkuman District / Kaneshie Central"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. OPTIONAL NOTE */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  5. Optional Note to Approver
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Appointed by Executive Council in December 2025; formerly in Sunyani Area."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cop-blue-900 via-cop-blue-800 to-cop-blue-900 hover:from-cop-blue-950 text-white font-heading font-extrabold text-sm shadow-cop hover:shadow-cop-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Access Request for Verification</span>
                <ArrowRight className="w-4 h-4 text-cop-gold-400" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
