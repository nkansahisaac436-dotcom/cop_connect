import React from 'react';
import { Project } from '../types';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/feed/ProjectCard';
import { 
  Building2, 
  MapPin, 
  UserCheck, 
  Layers, 
  ArrowLeft, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Flame, 
  TrendingUp,
  Globe2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface AreaProfilePageProps {
  areaId: string;
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  onOpenStatusModal: (project: Project) => void;
  onNavigateDistrict: (districtId: string) => void;
}

export const AreaProfilePage: React.FC<AreaProfilePageProps> = ({
  areaId,
  onBack,
  onSelectProject,
  onOpenStatusModal,
  onNavigateDistrict,
}) => {
  const { areas, districts, projects } = useData();

  const area = areas.find((a) => a.id === areaId) || areas[0];
  const areaDistricts = districts.filter((d) => d.areaId === area?.id);
  const areaProjects = projects.filter((p) => p.areaId === area?.id);

  const ongoingCount = areaProjects.filter((p) => p.status === 'Ongoing').length;
  const completedCount = areaProjects.filter((p) => p.status === 'Completed').length;
  const totalRaised = areaProjects.reduce((acc, p) => acc + (p.raisedBudget || 0), 0);

  if (!area) return null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-cop-blue-800 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to National Feed</span>
      </button>

      {/* Area Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-cop-blue-950 via-cop-blue-900 to-cop-blue-800 text-white p-6 sm:p-8 shadow-cop-lg overflow-hidden border border-cop-gold-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cop-gold-500/20 text-cop-gold-300 font-bold text-xs border border-cop-gold-500/40 flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" />
                <span>{area.region} &bull; {area.country}</span>
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
              {area.name}
            </h1>

            <div className="text-xs sm:text-sm text-slate-200 flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-cop-gold-400" />
                <span>Area Head: <strong>{area.areaHeadName || 'Pending Assignment'}</strong></span>
              </div>
              {area.areaHeadPhone && (
                <div className="flex items-center gap-1 text-slate-300">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{area.areaHeadPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div className="text-[11px] text-cop-gold-300 uppercase font-bold">Districts in Jurisdiction</div>
            <div className="text-3xl font-extrabold mt-0.5">{areaDistricts.length}</div>
            <div className="text-[10px] text-slate-300">{areaProjects.length} Projects Uploaded</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 p-3 rounded-xl">
            <div className="text-[11px] text-cop-gold-300 uppercase font-semibold">Total Projects</div>
            <div className="text-xl font-bold mt-0.5">{areaProjects.length}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl">
            <div className="text-[11px] text-red-300 uppercase font-semibold">Ongoing Works</div>
            <div className="text-xl font-bold mt-0.5">{ongoingCount}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl">
            <div className="text-[11px] text-emerald-300 uppercase font-semibold">Completed Works</div>
            <div className="text-xl font-bold mt-0.5">{completedCount}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl">
            <div className="text-[11px] text-cop-gold-300 uppercase font-semibold">Funds Raised</div>
            <div className="text-lg font-bold mt-0.5 truncate">{formatCurrency(totalRaised, 'GHS')}</div>
          </div>
        </div>
      </div>

      {/* Constituent Districts */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cop-blue-700" />
          <span>Constituent Districts under {area.name} ({areaDistricts.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {areaDistricts.map((d) => (
            <div
              key={d.id}
              onClick={() => onNavigateDistrict(d.id)}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-cop-blue-400 hover:shadow-cop cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-heading font-bold text-sm text-slate-900">{d.name}</h3>
                <span className="text-[10px] bg-cop-blue-50 text-cop-blue-800 font-bold px-2 py-0.5 rounded-full">
                  {d.assemblyCount} Assemblies
                </span>
              </div>
              <div className="text-xs text-cop-blue-700 font-medium">
                {d.pastorName || 'Minister Pending Assignment'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Area Project Gallery */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cop-blue-700" />
          <span>Area Projects Portfolio ({areaProjects.length})</span>
        </h2>

        {areaProjects.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
            No projects published for this Area yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areaProjects.map((project) => (
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
    </div>
  );
};
