import React, { useState } from 'react';
import { Project, ProjectStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  X, 
  MapPin, 
  Calendar, 
  Building2, 
  Compass, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Heart, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  ShieldCheck, 
  CheckSquare, 
  Square, 
  Edit3,
  Trash2,
  Share2,
  Phone,
  Mail
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
import confetti from 'canvas-confetti';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenStatusModal: (project: Project) => void;
  onOpenEditModal?: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenStatusModal,
  onOpenEditModal,
}) => {
  const { currentUser } = useAuth();
  const { toggleLike, addComment, toggleMilestone, deleteProject } = useData();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'encouragement'>('encouragement');
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const isLiked = currentUser ? project.likes.includes(currentUser.id) : false;
  const isOwner = currentUser && (
    currentUser.id === project.postedByUserId ||
    (currentUser.role === 'area_head' && currentUser.areaId === project.areaId) ||
    currentUser.role === 'super_admin'
  );

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    addComment(project.id, commentText.trim(), commentType, currentUser);
    setCommentText('');

    if (commentType === 'encouragement') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (!currentUser) return;
    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      deleteProject(project.id, currentUser);
      onClose();
    }
  };

  const getCategoryIcon = () => {
    switch (project.category) {
      case 'Church Building':
        return <Building2 className="w-4 h-4 text-cop-blue-700" />;
      case 'Outreach/Evangelism':
        return <Compass className="w-4 h-4 text-cop-red-600" />;
      case 'Community Project':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'Mission House':
        return <Layers className="w-4 h-4 text-amber-600" />;
      default:
        return <Building2 className="w-4 h-4 text-cop-blue-700" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/80 sticky top-0 z-20">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-sm">
                {getCategoryIcon()}
                {project.category}
              </span>

              {project.status === 'Completed' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Completed
                </span>
              )}

              {project.status === 'Ongoing' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cop-red-50 text-cop-red-600 border border-cop-red-200">
                  <span className="w-2 h-2 rounded-full bg-cop-red-600 animate-pulse"></span>
                  Ongoing
                </span>
              )}

              {project.status === 'Planned' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cop-gold-100 text-cop-gold-900 border border-cop-gold-300">
                  <Clock className="w-3.5 h-3.5 text-cop-gold-700" />
                  Planned
                </span>
              )}

              <span className="text-xs font-bold text-cop-blue-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cop-gold-600" />
                {project.areaName} {project.districtName ? `• ${project.districtName}` : ''}
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-lg sm:text-2xl text-slate-900 leading-snug">
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors"
              title="Copy Link"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Photo Gallery Viewer */}
          {project.photos && project.photos.length > 0 && (
            <div className="space-y-3">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-950 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={project.photos[activePhotoIdx] || project.photos[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />

                {project.photos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActivePhotoIdx((prev) =>
                          prev === 0 ? project.photos.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActivePhotoIdx((prev) =>
                          prev === project.photos.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                      {activePhotoIdx + 1} / {project.photos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {project.photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {project.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activePhotoIdx === idx
                          ? 'border-cop-blue-700 ring-2 ring-cop-blue-300'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Leadership
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 truncate">
                {project.postedByName}
              </div>
              <div className="text-[10px] text-cop-blue-700 font-semibold">
                {project.postedByRole.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Location
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 truncate">
                {project.location || project.areaName}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {project.areaName}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Timeline
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                {formatDate(project.startDate)}
              </div>
              <div className="text-[10px] text-slate-500">
                Target: {formatDate(project.targetCompletionDate)}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Budget / Funding
              </div>
              <div className="text-xs sm:text-sm font-bold text-cop-blue-900 mt-0.5">
                {formatCurrency(project.raisedBudget, project.currency)}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Target: {formatCurrency(project.targetBudget, project.currency)}
              </div>
            </div>
          </div>

          {/* Funding Progress Bar (if available) */}
          {project.fundingProgress !== undefined && (
            <div className="p-4 rounded-2xl bg-cop-blue-50/50 border border-cop-blue-100">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-cop-blue-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cop-gold-600" />
                  Total Project Funding Raised
                </span>
                <span className="text-cop-blue-800 text-sm font-extrabold">
                  {project.fundingProgress}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cop-gold-500 via-cop-gold-600 to-cop-blue-700 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(project.fundingProgress, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Full Narrative Scope */}
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 mb-2">
              Project Description & Scope
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              {project.description}
            </p>
          </div>

          {/* Milestones Checklist */}
          {project.milestones && project.milestones.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Key Construction & Project Milestones
                </h3>
                <span className="text-xs text-slate-500">
                  {project.milestones.filter((m) => m.completed).length} of{' '}
                  {project.milestones.length} completed
                </span>
              </div>

              <div className="space-y-2">
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => isOwner && toggleMilestone(project.id, m.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      m.completed
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-700'
                    } ${isOwner ? 'cursor-pointer hover:border-cop-blue-400' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {m.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                      <span className={`text-xs sm:text-sm font-semibold ${m.completed ? 'line-through text-slate-500' : ''}`}>
                        {m.title}
                      </span>
                    </div>

                    {m.completed && m.completedAt && (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        Completed {formatDate(m.completedAt)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Updates Timeline */}
          {project.statusUpdates && project.statusUpdates.length > 0 && (
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-2">
                Status History & Leadership Updates
              </h3>
              <div className="space-y-2 border-l-2 border-cop-blue-200 pl-4 ml-2">
                {project.statusUpdates.map((su) => (
                  <div key={su.id} className="relative pb-2">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-cop-blue-700 ring-4 ring-cop-blue-100" />
                    <div className="text-xs font-bold text-slate-800">
                      {su.previousStatus} → <span className="text-cop-blue-700">{su.newStatus}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{su.note}</p>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      By {su.updatedBy} • {formatRelativeTime(su.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encouragement Reactions & Comments Section */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            {/* Quick Encouragement Buttons */}
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Express Praise & Encouragement to {project.postedByName}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: '🙏 Amen! Praise God', text: 'Amen! Praise God for this great step forward in His kingdom!' },
                  { label: '✨ Glory to God', text: 'Glory to God in the highest! Highly inspiring work.' },
                  { label: '👏 Commendable Effort', text: 'Commendable leadership and execution by the District and Area.' },
                  { label: '🌟 Keep Shining', text: 'May the Lord grant speed and resources for a glorious completion!' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (currentUser) {
                        addComment(project.id, item.text, 'encouragement', currentUser);
                        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
                      }
                    }}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-cop-gold-100 hover:text-cop-gold-900 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shadow-sm"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Thread List */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                Leadership Encouragements & Discussions ({project.comments.length})
              </h4>

              {project.comments.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                  Be the first minister to post an encouragement for this project!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {project.comments.map((c) => (
                    <div
                      key={c.id}
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        c.type === 'encouragement'
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{c.userName}</span>
                          <span className="text-[10px] text-cop-blue-700 font-semibold">
                            ({c.userAreaName || c.userRole.replace('_', ' ')})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {formatRelativeTime(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-700">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post Comment Input Form */}
            {currentUser && currentUser.status === 'approved' ? (
              <form onSubmit={handleSendComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`Send words of encouragement to ${project.postedByName}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-xs sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-cop-blue-800 hover:bg-cop-blue-900 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4 text-cop-gold-400" />
                  <span>Send</span>
                </button>
              </form>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 text-center font-medium">
                Verified ministers only can post comments and reactions.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => currentUser && toggleLike(project.id, currentUser.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isLiked
                  ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
              <span>{project.likes.length} Encouragements</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && onOpenEditModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEditModal(project);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-cop-blue-700" />
                <span>Edit Content</span>
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => onOpenStatusModal(project)}
                className="px-4 py-2 rounded-xl bg-cop-blue-800 hover:bg-cop-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-cop-gold-400" />
                <span>Update Status</span>
              </button>
            )}

            {isOwner && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
