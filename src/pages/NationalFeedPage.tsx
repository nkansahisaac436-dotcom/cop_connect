import React, { useState, useMemo } from 'react';
import { Project, FeedFilterState } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FeedFilters } from '../components/feed/FeedFilters';
import { ProjectCard } from '../components/feed/ProjectCard';
import { QuickPostWidget } from '../components/feed/QuickPostWidget';
import { 
  Building2, 
  Compass, 
  CheckCircle2, 
  Flame, 
  Globe2, 
  Sparkles, 
  PlusCircle,
  TrendingUp,
  MapPin,
  Trash2,
  RotateCcw
} from 'lucide-react';

interface NationalFeedPageProps {
  onSelectProject: (project: Project) => void;
  onOpenStatusModal: (project: Project) => void;
  onOpenUploadModal: () => void;
}

export const NationalFeedPage: React.FC<NationalFeedPageProps> = ({
  onSelectProject,
  onOpenStatusModal,
  onOpenUploadModal,
}) => {
  const { projects, areas, clearAllProjects, restoreDefaultData } = useData();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [filters, setFilters] = useState<FeedFilterState>({
    searchQuery: '',
    areaId: 'all',
    districtId: 'all',
    category: 'all',
    status: 'all',
    sortBy: 'newest',
  });

  const handleFilterChange = (updates: Partial<FeedFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      areaId: 'all',
      districtId: 'all',
      category: 'all',
      status: 'all',
      sortBy: 'newest',
    });
  };

  // Filtered and Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesDesc = project.description.toLowerCase().includes(q);
        const matchesArea = project.areaName.toLowerCase().includes(q);
        const matchesDistrict = project.districtName?.toLowerCase().includes(q) || false;
        const matchesLocation = project.location?.toLowerCase().includes(q) || false;
        const matchesAuthor = project.postedByName.toLowerCase().includes(q);

        if (!matchesTitle && !matchesDesc && !matchesArea && !matchesDistrict && !matchesLocation && !matchesAuthor) {
          return false;
        }
      }

      // Area filter
      if (filters.areaId !== 'all' && project.areaId !== filters.areaId) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && project.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && project.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [projects, filters]);

  // High-level statistics
  const totalProjectsCount = projects.length;
  const ongoingCount = projects.filter((p) => p.status === 'Ongoing').length;
  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const evangelismCount = projects.filter((p) => p.category === 'Outreach/Evangelism').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner & Live Stats */}
      <div className="relative rounded-3xl bg-gradient-to-br from-cop-blue-950 via-cop-blue-900 to-cop-blue-800 text-white p-6 sm:p-8 shadow-cop-lg overflow-hidden border border-cop-gold-500/30">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cop-blue-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-cop-gold-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cop-gold-300 text-xs font-bold border border-cop-gold-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National & Global Activity Network</span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white leading-tight">
              One Church, Visible Progress across all Areas
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Upload your own church construction updates, outreach reports, and community projects.
              Connect with leadership across all Areas to share what God is doing in your District.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            {currentUser && currentUser.status === 'approved' ? (
              <button
                onClick={onOpenUploadModal}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cop-gold-500 to-cop-gold-600 hover:from-cop-gold-600 hover:to-cop-gold-700 text-slate-950 font-heading font-extrabold text-sm shadow-gold-glow flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>Upload Real Project Update</span>
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold text-center">
                Account verification pending approval
              </div>
            )}

            {/* Clean slate option for fresh real user data */}
            {currentUser && (
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-300 pt-1">
                {projects.length > 0 ? (
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all sample data to start fresh with your own real posts?')) {
                        clearAllProjects(currentUser);
                      }
                    }}
                    className="hover:text-red-300 text-slate-400 hover:underline flex items-center gap-1"
                    title="Clear sample data to start clean"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Sample Data</span>
                  </button>
                ) : (
                  <button
                    onClick={restoreDefaultData}
                    className="hover:text-cop-gold-300 text-cop-gold-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Load Sample Examples</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live National Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-white">
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-cop-gold-300 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5" /> Total Projects
            </div>
            <div className="text-xl sm:text-2xl font-extrabold mt-0.5">{totalProjectsCount}</div>
            <div className="text-[10px] text-slate-300">Across {areas.length} Areas</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-red-300 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-400" /> Ongoing Work
            </div>
            <div className="text-xl sm:text-2xl font-extrabold mt-0.5">{ongoingCount}</div>
            <div className="text-[10px] text-slate-300">Active construction & projects</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Completed
            </div>
            <div className="text-xl sm:text-2xl font-extrabold mt-0.5">{completedCount}</div>
            <div className="text-[10px] text-slate-300">Dedicated sanctuaries & hubs</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-cop-gold-300 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cop-gold-400" /> Evangelism
            </div>
            <div className="text-xl sm:text-2xl font-extrabold mt-0.5">{evangelismCount}</div>
            <div className="text-[10px] text-slate-300">Harvest crusades & missions</div>
          </div>
        </div>
      </div>

      {/* Quick Post Box for Logged in Ministers */}
      {currentUser && currentUser.status === 'approved' && (
        <QuickPostWidget
          onOpenFullModal={onOpenUploadModal}
          onSuccess={(newProjId) => {
            const created = projects.find((p) => p.id === newProjId);
            if (created) onSelectProject(created);
          }}
        />
      )}

      {/* Filter & Search Bar */}
      <FeedFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        areas={areas}
        totalResults={filteredProjects.length}
      />

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-cop-blue-50 text-cop-blue-700 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              {projects.length === 0 ? 'No projects uploaded yet' : 'No projects found matching these filters'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {projects.length === 0
                ? 'Be the first minister to publish a church building, outreach, or community project update!'
                : 'Try adjusting your category, search keywords, or area selection to discover more projects.'}
            </p>
          </div>
          
          {currentUser && currentUser.status === 'approved' ? (
            <button
              onClick={onOpenUploadModal}
              className="px-5 py-2.5 rounded-xl bg-cop-blue-800 text-white font-bold text-xs hover:bg-cop-blue-900 shadow transition-colors inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-cop-gold-400" />
              <span>Create Your First Project Update</span>
            </button>
          ) : (
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-cop-blue-800 text-white font-bold text-xs hover:bg-cop-blue-900 shadow transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
              onOpenStatusModal={onOpenStatusModal}
            />
          ))}
        </div>
      )}
    </div>
  );
};
