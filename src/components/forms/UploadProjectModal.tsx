import React, { useState } from 'react';
import { ProjectCategory, ProjectStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { compressImage } from '../../utils/imageCompressor';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Sparkles, 
  Building2, 
  Compass, 
  Layers, 
  Calendar, 
  TrendingUp, 
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UploadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (projectId: string) => void;
}

const SAMPLE_PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1548625361-195fe614b749?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80'
];

export const UploadProjectModal: React.FC<UploadProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { addProject } = useData();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Church Building');
  const [status, setStatus] = useState<ProjectStatus>('Ongoing');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetCompletionDate, setTargetCompletionDate] = useState('');
  const [fundingProgress, setFundingProgress] = useState(30);
  const [targetBudget, setTargetBudget] = useState<number | ''>(500000);
  const [currency, setCurrency] = useState('GHS');

  const [photos, setPhotos] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [milestones, setMilestones] = useState<{ title: string }[]>([
    { title: 'Architectural Approval & Site Clearing' },
    { title: 'Foundation & Pillars Concrete Casting' },
    { title: 'Roofing Truss & Wall Enclosure' }
  ]);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    setError('');

    try {
      const compressedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImage(file, 1600, 1200, 0.82);
        compressedUrls.push(compressed);
      }
      setPhotos((prev) => [...prev, ...compressedUrls]);
    } catch (err: any) {
      setError('Failed to process image. Please try another image format.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleAddSampleImage = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddMilestone = () => {
    if (newMilestoneText.trim()) {
      setMilestones((prev) => [...prev, { title: newMilestoneText.trim() }]);
      setNewMilestoneText('');
    }
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Project description is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = addProject(
        {
          title: title.trim(),
          category,
          status,
          description: description.trim(),
          photos: photos.length > 0 ? photos : [SAMPLE_PROJECT_IMAGES[0]],
          fundingProgress: Number(fundingProgress),
          targetBudget: targetBudget ? Number(targetBudget) : undefined,
          currency,
          location: location.trim() || `${currentUser.districtName || currentUser.areaName}`,
          startDate,
          targetCompletionDate: targetCompletionDate || undefined,
          milestones,
        },
        currentUser
      );

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });

      onSuccess(created.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-cop-blue-900 to-cop-blue-800 text-white flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-cop-gold-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              National Project Portal
            </div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl mt-0.5">
              Upload New Project / Activity Update
            </h2>
            <div className="text-xs text-slate-300 mt-1">
              Posting on behalf of:{' '}
              <strong className="text-white">
                {currentUser?.districtName || currentUser?.areaName}
              </strong>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider text-cop-blue-800">
              1. Project Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5,000-Seater Central Cathedral & Ministry Complex Construction"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-sm font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-sm font-semibold"
                >
                  <option value="Church Building">Church Building</option>
                  <option value="Outreach/Evangelism">Outreach / Evangelism Crusade</option>
                  <option value="Community Project">Community & Social Transformation</option>
                  <option value="Mission House">Mission House / Secretariat</option>
                  <option value="Conference/Event">Conference / Leadership Event</option>
                  <option value="Other">Other Initiative</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-sm font-semibold"
                >
                  <option value="Planned">Planned (Site acquisition / Architectural design)</option>
                  <option value="Ongoing">Ongoing (Active construction / In progress)</option>
                  <option value="Completed">Completed (Dedicated / Fully Inaugurated)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description & Scope <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Detail the scope of the project, seating capacity, facilities, purpose, and impact..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-sm leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Specific Location / Town
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kaneshie Highway Junction, Accra"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-sm"
              />
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider text-cop-blue-800">
                2. Project Photos (Auto-compressed for fast mobile feed)
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                {photos.length} photos selected
              </span>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-cop-blue-600 rounded-2xl p-6 text-center bg-slate-50/60 transition-colors">
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-cop-blue-100 text-cop-blue-800 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {isCompressing ? 'Optimizing & Compressing...' : 'Click to Upload Construction / Project Photos'}
                </div>
                <p className="text-xs text-slate-500">
                  Supports JPG, PNG, WebP • Auto-optimized for low-bandwidth regions
                </p>
              </label>
            </div>

            {/* Quick Sample Photos Picker (for demo testing convenience) */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500">
                Or select high-res COP project sample images:
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {SAMPLE_PROJECT_IMAGES.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddSampleImage(imgUrl)}
                    className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 hover:opacity-80 flex-shrink-0"
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Photos Preview */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200 shadow-sm"
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget, Timeline & Milestones */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider text-cop-blue-800">
              3. Budget & Progress Tracking
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Budget
                </label>
                <div className="flex">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-2 py-2.5 rounded-l-xl bg-slate-100 border border-r-0 border-slate-200 text-xs font-bold text-slate-700"
                  >
                    <option value="GHS">GHS (GH₵)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                  <input
                    type="number"
                    value={targetBudget}
                    onChange={(e) =>
                      setTargetBudget(e.target.value ? Number(e.target.value) : '')
                    }
                    placeholder="500000"
                    className="w-full px-3 py-2.5 rounded-r-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  value={targetCompletionDate}
                  onChange={(e) => setTargetCompletionDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Funding Progress Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Estimated Funding Progress</span>
                <span className="text-cop-blue-800 text-sm font-extrabold">
                  {fundingProgress}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fundingProgress}
                onChange={(e) => setFundingProgress(Number(e.target.value))}
                className="w-full accent-cop-blue-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Milestones */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Key Construction / Project Milestones
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  placeholder="e.g. Roofing truss installation"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              <div className="space-y-1.5">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <span className="font-semibold text-slate-800">{m.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cop-blue-900 via-cop-blue-800 to-cop-blue-700 hover:from-cop-blue-950 hover:to-cop-blue-800 text-white font-bold text-sm shadow-md flex items-center gap-2 border border-cop-gold-500/40"
            >
              <CheckCircle className="w-4 h-4 text-cop-gold-400" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish to National Feed'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
