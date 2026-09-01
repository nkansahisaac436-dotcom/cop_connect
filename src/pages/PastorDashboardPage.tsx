import React from 'react';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/feed/ProjectCard';
import { QuickPostWidget } from '../components/feed/QuickPostWidget';
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  TrendingUp, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Users, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
  ChevronRight,
  UploadCloud,
  FileCheck
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface PastorDashboardPageProps {
  onSelectProject: (project: Project) => void;
  onOpenStatusModal: (project: Project) => void;
  onOpenUploadModal: () => void;
  onNavigate: (page: string) => void;
}

export const PastorDashboardPage: React.FC<PastorDashboardPageProps> = ({
  onSelectProject,
  onOpenStatusModal,
  onOpenUploadModal,
  onNavigate,
}) => {
  const { currentUser } = useAuth();
  const { projects, areas, districts } = useData();

  if (!currentUser) return null;

  // Filter projects belonging to this pastor's district or posted by this pastor
  const myProjects = projects.filter(
    (p) =>
      p.postedByUserId === currentUser.id ||
      (currentUser.districtId && p.districtId === currentUser.districtId) ||
      (currentUser.districtName && p.districtName === currentUser.districtName)
  );

  const ongoingCount = myProjects.filter((p) => p.status === 'Ongoing').length;
  const completedCount = myProjects.filter((p) => p.status === 'Completed').length;
  const plannedCount = myProjects.filter((p) => p.status === 'Planned').length;

  const totalRaised = myProjects.reduce((acc, p) => acc + (p.raisedBudget || 0), 0);
  const totalTarget = myProjects.reduce((acc, p) => acc + (p.targetBudget || 0), 0);

  const districtInfo = districts.find(
    (d) => d.id === currentUser.districtId || d.name === currentUser.districtName
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cop-blue-900 via-cop-blue-800 to-cop-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-cop-lg border border-cop-gold-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cop-gold-500/20 text-cop-gold-300 font-bold text-xs border border-cop-gold-500/40 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>District Administration Command</span>
              </span>
              <span className="text-xs text-slate-300">
                {currentUser.areaName}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {currentUser.districtName || 'My District Dashboard'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-2">
              <span className="font-semibold text-cop-gold-300">District Minister:</span>
              <span>{currentUser.titlePrefix || 'Pastor'} {currentUser.fullName}</span>
              {districtInfo && (
                <>
                  <span>•</span>
                  <span>{districtInfo.assemblyCount} Local Assemblies</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUploadModal}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cop-gold-500 to-cop-gold-600 hover:from-cop-gold-600 text-slate-950 font-heading font-extrabold text-sm shadow-gold-glow flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Upload New Project</span>
            </button>
          </div>
        </div>

        {/* District Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-cop-gold-300 font-bold uppercase tracking-wider">
              District Projects
            </div>
            <div className="text-2xl font-extrabold mt-0.5">{myProjects.length}</div>
            <div className="text-[10px] text-slate-300">Your published projects</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-red-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-400" /> Ongoing Work
            </div>
            <div className="text-2xl font-extrabold mt-0.5">{ongoingCount}</div>
            <div className="text-[10px] text-slate-300">Active sites / projects</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
            </div>
            <div className="text-2xl font-extrabold mt-0.5">{completedCount}</div>
            <div className="text-[10px] text-slate-300">Dedicated projects</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-cop-gold-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-cop-gold-400" /> Funds Raised
            </div>
            <div className="text-xl font-extrabold mt-0.5 truncate">
              {formatCurrency(totalRaised, 'GHS')}
            </div>
            <div className="text-[10px] text-slate-300">
              Target: {formatCurrency(totalTarget, 'GHS')}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Post Box for the Pastor */}
      <QuickPostWidget
        onOpenFullModal={onOpenUploadModal}
        onSuccess={(newId) => {
          const fresh = projects.find((p) => p.id === newId);
          if (fresh) onSelectProject(fresh);
        }}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My District Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cop-blue-700" />
              <span>Projects Uploaded by Your District ({myProjects.length})</span>
            </h2>

            <button
              onClick={() => onNavigate('feed')}
              className="text-xs font-bold text-cop-blue-700 hover:underline flex items-center gap-1"
            >
              <span>Explore National Feed</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myProjects.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-cop-blue-200 p-8 sm:p-10 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-cop-blue-50 text-cop-blue-700 flex items-center justify-center mx-auto">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-lg text-slate-900">
                  Ready to share what God is doing in {currentUser.districtName || 'your District'}?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Post your ongoing church building construction, local evangelism outreach, mission
                  house renovation, or community initiative to make your progress visible nationwide!
                </p>
              </div>
              <button
                onClick={onOpenUploadModal}
                className="px-6 py-3 rounded-2xl bg-cop-blue-800 hover:bg-cop-blue-900 text-white font-heading font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-cop-gold-400" />
                <span>Write and Upload Your First Project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {myProjects.map((project) => (
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

        {/* Right 1 Col: Area Leadership Context & Quick Actions */}
        <div className="space-y-5">
          {/* Area Leadership Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cop-gold-600" />
              <span>Assigned Area Oversight</span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-cop-blue-900 text-cop-gold-300 font-bold flex items-center justify-center text-sm ring-1 ring-cop-gold-400">
                COP
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  {currentUser.areaName || 'Kaneshie Area'}
                </h3>
                <p className="text-xs text-cop-blue-800 font-semibold">
                  Apostle Emmanuel Yaw Gyasi (Area Head)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              Your district projects are visible in your Area Head&apos;s supervisory dashboard and featured
              on the public National Feed for other Areas to view.
            </p>
          </div>

          {/* Quick Writing Tips */}
          <div className="bg-gradient-to-br from-slate-900 to-cop-blue-950 text-white rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-cop-gold-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Writing Effective Project Updates</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Upload clear stage-by-stage construction photos (foundation, roofing, completion).</li>
              <li>Keep the estimated budget and funding progress updated as funds are disbursed.</li>
              <li>Encourage sister districts by reacting and commenting on their posts.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
