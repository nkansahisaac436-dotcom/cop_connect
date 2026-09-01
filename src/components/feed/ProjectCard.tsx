import React, { useState } from 'react';
import { Project } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Heart, 
  MessageSquare, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { formatCurrency, formatRelativeTime, truncateText } from '../../utils/formatters';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onOpenStatusModal?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onOpenStatusModal,
}) => {
  const { currentUser } = useAuth();
  const { toggleLike } = useData();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const isLiked = currentUser ? project.likes.includes(currentUser.id) : false;
  const isOwner = currentUser && (
    currentUser.id === project.postedByUserId ||
    (currentUser.role === 'area_head' && currentUser.areaId === project.areaId) ||
    currentUser.role === 'super_admin'
  );

  const getStatusBadge = () => {
    switch (project.status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'Ongoing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-cop-red-50 text-cop-red-600 border border-cop-red-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cop-red-600 animate-pulse"></span>
            Ongoing
          </span>
        );
      case 'Planned':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-cop-gold-100 text-cop-gold-900 border border-cop-gold-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-cop-gold-700" />
            Planned
          </span>
        );
    }
  };

  const getCategoryIcon = () => {
    switch (project.category) {
      case 'Church Building':
        return <Building2 className="w-3.5 h-3.5 text-cop-blue-700" />;
      case 'Outreach/Evangelism':
        return <Compass className="w-3.5 h-3.5 text-cop-red-600" />;
      case 'Community Project':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Mission House':
        return <Layers className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-cop-blue-700" />;
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-cop hover:shadow-cop-lg transition-all duration-300 overflow-hidden flex flex-col hover:border-cop-blue-300">
      {/* Photo Header */}
      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onSelect(project)}>
        {project.photos && project.photos.length > 0 ? (
          <img
            src={project.photos[activePhotoIdx] || project.photos[0]}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cop-blue-900 to-cop-blue-800 text-white">
            <Building2 className="w-16 h-16 opacity-30" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow">
            {getCategoryIcon()}
            <span>{project.category}</span>
          </div>

          <div>{getStatusBadge()}</div>
        </div>

        {/* Bottom Area / District Tag & Photo Counter */}
        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between z-10 text-white">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-cop-gold-300 drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-cop-gold-400" />
              <span>{project.areaName}</span>
              {project.districtName && (
                <>
                  <span className="text-white/60">•</span>
                  <span className="text-slate-100">{project.districtName}</span>
                </>
              )}
            </div>
          </div>

          {project.photos && project.photos.length > 1 && (
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-[11px] font-medium text-white">
              <ImageIcon className="w-3 h-3 text-cop-gold-400" />
              <span>{project.photos.length} photos</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3
            onClick={() => onSelect(project)}
            className="font-heading font-bold text-base sm:text-lg text-slate-900 line-clamp-2 hover:text-cop-blue-700 transition-colors cursor-pointer"
          >
            {project.title}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Funding Progress (if available) */}
          {project.fundingProgress !== undefined && project.fundingProgress > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cop-gold-600" />
                  Funding Progress
                </span>
                <span className="font-extrabold text-cop-blue-900">
                  {project.fundingProgress}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cop-gold-500 to-cop-gold-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(project.fundingProgress, 100)}%` }}
                />
              </div>
              {project.targetBudget && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Raised: {formatCurrency(project.raisedBudget, project.currency)}</span>
                  <span>Target: {formatCurrency(project.targetBudget, project.currency)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: Posted by + Interactions */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cop-blue-900 text-cop-gold-300 font-bold text-xs flex items-center justify-center ring-1 ring-cop-gold-500">
              {project.postedByName.charAt(0)}
            </div>
            <div className="text-[11px] leading-tight">
              <div className="font-bold text-slate-800 truncate max-w-[130px]">
                {project.postedByName}
              </div>
              <div className="text-slate-400">
                {formatRelativeTime(project.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Encouragements / Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentUser) {
                  toggleLike(project.id, currentUser.id);
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                isLiked
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Give encouragement"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
              <span>{project.likes.length}</span>
            </button>

            {/* Comment Count */}
            <button
              onClick={() => onSelect(project)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{project.comments.length}</span>
            </button>

            {/* Owner Update Status shortcut */}
            {isOwner && onOpenStatusModal && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStatusModal(project);
                }}
                className="px-2 py-1 rounded-lg text-[11px] font-bold text-cop-blue-700 bg-cop-blue-50 hover:bg-cop-blue-100 border border-cop-blue-200"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
