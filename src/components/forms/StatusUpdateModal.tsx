import React, { useState } from 'react';
import { Project, ProjectStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { X, CheckCircle, Flame, Clock, Edit3, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StatusUpdateModalProps {
  project: Project | null;
  onClose: () => void;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  project,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { updateProjectStatus } = useData();

  const [newStatus, setNewStatus] = useState<ProjectStatus>(
    project?.status || 'Ongoing'
  );
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    updateProjectStatus(
      project.id,
      newStatus,
      note.trim() || `Status updated from ${project.status} to ${newStatus}`,
      currentUser
    );

    if (newStatus === 'Completed') {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-cop-blue-900 to-cop-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-cop-gold-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base">
                Update Project Status
              </h3>
              <p className="text-xs text-slate-300 truncate max-w-xs">
                {project.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select New Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { status: 'Planned' as ProjectStatus, icon: Clock, label: 'Planned', color: 'border-cop-gold-400 text-cop-gold-900 bg-cop-gold-50' },
                { status: 'Ongoing' as ProjectStatus, icon: Flame, label: 'Ongoing', color: 'border-cop-red-400 text-cop-red-700 bg-cop-red-50' },
                { status: 'Completed' as ProjectStatus, icon: CheckCircle, label: 'Completed', color: 'border-emerald-400 text-emerald-800 bg-emerald-50' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = newStatus === item.status;

                return (
                  <button
                    key={item.status}
                    type="button"
                    onClick={() => setNewStatus(item.status)}
                    className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? item.color + ' ring-2 ring-cop-blue-700 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Progress Update Note / Milestone Summary
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="e.g. Roofing successfully completed. Now proceeding with plastering and floor tiling..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-xs sm:text-sm"
              required
            />
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-cop-blue-800 hover:bg-cop-blue-900 text-white text-xs font-bold shadow transition-colors"
            >
              Save Status Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
