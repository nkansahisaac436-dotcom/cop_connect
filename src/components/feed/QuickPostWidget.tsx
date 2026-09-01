import React, { useState } from 'react';
import { ProjectCategory, ProjectStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { compressImage } from '../../utils/imageCompressor';
import { 
  Building2, 
  Compass, 
  Sparkles, 
  Layers, 
  Calendar, 
  Image as ImageIcon, 
  Send, 
  PlusCircle, 
  X, 
  UploadCloud,
  CheckCircle2,
  Flame,
  Clock,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickPostWidgetProps {
  onOpenFullModal: () => void;
  onSuccess: (projectId: string) => void;
}

export const QuickPostWidget: React.FC<QuickPostWidgetProps> = ({
  onOpenFullModal,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { addProject } = useData();

  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Church Building');
  const [status, setStatus] = useState<ProjectStatus>('Ongoing');
  const [location, setLocation] = useState('');
  const [targetBudget, setTargetBudget] = useState<number | ''>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  if (!currentUser || currentUser.status !== 'approved') return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const compressedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i], 1600, 1200, 0.82);
        compressedList.push(compressed);
      }
      setPhotos((prev) => [...prev, ...compressedList]);
      setIsExpanded(true);
    } catch (err) {
      console.error('Image compression error', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const created = addProject(
      {
        title: title.trim(),
        category,
        status,
        description: description.trim() || `Update from ${currentUser.districtName || currentUser.areaName} regarding ${title.trim()}.`,
        photos: photos.length > 0 ? photos : [
          'https://images.unsplash.com/photo-1548625361-195fe614b749?w=1000&auto=format&fit=crop&q=80'
        ],
        fundingProgress: status === 'Completed' ? 100 : 35,
        targetBudget: targetBudget ? Number(targetBudget) : undefined,
        currency: 'GHS',
        location: location.trim() || `${currentUser.districtName || currentUser.areaName}`,
      },
      currentUser
    );

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTitle('');
    setDescription('');
    setPhotos([]);
    setIsExpanded(false);
    onSuccess(created.id);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-5 transition-all hover:border-cop-blue-300">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Top bar: Avatar + Quick Title Input */}
        <div className="flex items-start gap-3">
          <img
            src={
              currentUser.profilePhoto ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
            }
            alt={currentUser.fullName}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-cop-gold-400 flex-shrink-0 mt-0.5"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-slate-800">
                {currentUser.titlePrefix || (currentUser.role === 'area_head' ? 'Apostle' : 'Pastor')}{' '}
                {currentUser.fullName}
              </span>
              <span className="text-[11px] text-cop-blue-800 font-semibold bg-cop-blue-50 px-2 py-0.5 rounded-full">
                {currentUser.districtName || currentUser.areaName}
              </span>
            </div>

            <input
              type="text"
              value={title}
              onFocus={() => setIsExpanded(true)}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What project or activity is happening in your District/Area? (e.g. New Church Building, Crusade...)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="space-y-3 pt-2 animate-in fade-in">
            {/* Description Textarea */}
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Add brief details or description of progress, seating capacity, or soul count..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-xs leading-relaxed"
              />
            </div>

            {/* Category Selector Chips */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Select Category:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '🏛️ Church Building', val: 'Church Building' as ProjectCategory },
                  { label: '🕊️ Outreach / Evangelism', val: 'Outreach/Evangelism' as ProjectCategory },
                  { label: '🌟 Community Project', val: 'Community Project' as ProjectCategory },
                  { label: '🏠 Mission House', val: 'Mission House' as ProjectCategory },
                  { label: '📅 Conference / Event', val: 'Conference/Event' as ProjectCategory },
                ].map((c) => (
                  <button
                    key={c.val}
                    type="button"
                    onClick={() => setCategory(c.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      category === c.val
                        ? 'bg-cop-blue-800 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
              {[
                { st: 'Ongoing' as ProjectStatus, label: 'Ongoing', color: 'bg-cop-red-50 text-cop-red-700 border-cop-red-300' },
                { st: 'Planned' as ProjectStatus, label: 'Planned', color: 'bg-cop-gold-50 text-cop-gold-900 border-cop-gold-300' },
                { st: 'Completed' as ProjectStatus, label: 'Completed', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
              ].map((item) => (
                <button
                  key={item.st}
                  type="button"
                  onClick={() => setStatus(item.st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    status === item.st ? item.color + ' ring-2 ring-cop-blue-700' : 'border-slate-200 text-slate-600 bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Uploaded Photos Preview */}
            {photos.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                {photos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {/* Direct Camera / File Upload Input */}
            <input
              type="file"
              id="quick-photo-upload"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <label
              htmlFor="quick-photo-upload"
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-cop-blue-50 hover:text-cop-blue-800 text-slate-700 text-xs font-semibold transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-cop-blue-700" />
              <span>{isUploading ? 'Compressing...' : 'Add Real Photos'}</span>
            </label>

            <button
              type="button"
              onClick={onOpenFullModal}
              className="text-xs font-bold text-cop-blue-700 hover:underline hidden sm:inline"
            >
              Full Details Form &rarr;
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 rounded-xl bg-cop-blue-800 hover:bg-cop-blue-900 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5 text-cop-gold-400" />
              <span>Publish to Feed</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
