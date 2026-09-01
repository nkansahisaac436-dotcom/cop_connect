import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory, ProjectStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { compressImage } from '../../utils/imageCompressor';
import { 
  X, 
  UploadCloud, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Edit3 
} from 'lucide-react';

interface EditProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { editProject } = useData();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Church Building');
  const [status, setStatus] = useState<ProjectStatus>('Ongoing');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [targetBudget, setTargetBudget] = useState<number | ''>('');
  const [fundingProgress, setFundingProgress] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCategory(project.category);
      setStatus(project.status);
      setDescription(project.description);
      setLocation(project.location || '');
      setTargetBudget(project.targetBudget || '');
      setFundingProgress(project.fundingProgress || 0);
      setPhotos(project.photos || []);
    }
  }, [project]);

  if (!project) return null;

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
    } catch {
      setError('Failed to process image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    editProject(
      project.id,
      {
        title: title.trim(),
        category,
        status,
        description: description.trim(),
        location: location.trim(),
        targetBudget: targetBudget ? Number(targetBudget) : undefined,
        fundingProgress: Number(fundingProgress),
        photos,
      },
      currentUser
    );

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-cop-blue-900 to-cop-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-cop-gold-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg">Edit Project Details</h2>
              <p className="text-xs text-cop-gold-300">Modify content, photos, and budget</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
              >
                <option value="Church Building">Church Building</option>
                <option value="Outreach/Evangelism">Outreach/Evangelism</option>
                <option value="Community Project">Community Project</option>
                <option value="Mission House">Mission House</option>
                <option value="Conference/Event">Conference/Event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
              >
                <option value="Planned">Planned</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Budget (GH₵)</label>
              <input
                type="number"
                value={targetBudget}
                onChange={(e) => setTargetBudget(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Funding Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={fundingProgress}
                onChange={(e) => setFundingProgress(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Project Photos</label>
              <label
                htmlFor="edit-photo-upload"
                className="cursor-pointer text-xs font-bold text-cop-blue-700 hover:underline flex items-center gap-1"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Add Photos</span>
              </label>
              <input
                type="file"
                id="edit-photo-upload"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cop-blue-800 hover:bg-cop-blue-900 text-white text-xs font-bold shadow"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
