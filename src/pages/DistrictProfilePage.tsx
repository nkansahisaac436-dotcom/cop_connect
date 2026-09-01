import React from 'react';
import { Project } from '../types';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/feed/ProjectCard';
import { 
  Building2, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Layers, 
  CheckCircle2, 
  Flame, 
  Phone,
  Mail,
  TrendingUp
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface DistrictProfilePageProps {
  districtId: string;
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  onOpenStatusModal: (project: Project) => void;
}

export const DistrictProfilePage: React.FC<DistrictProfilePageProps> = ({
  districtId,
  onBack,
  onSelectProject,
  onOpenStatusModal,
}) => {
  const { districts, projects, areas } = useData();

  const district = districts.find((d) => d.id === districtId) || districts[0];
  const districtProjects = projects.filter(
    (p) =>
      p.districtId === district?.id ||
      p.districtName === district?.name
  );

  const ongoingCount = districtProjects.filter((p) => p.status === 'Ongoing').length;
  const completedCount = districtProjects.filter((p) => p.status === 'Completed').length;
  const totalRaised = districtProjects.reduce((acc, p) => acc + (p.raisedBudget || 0), 0);

  if (!district) return null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-cop-blue-800 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Previous View</span>
      </button>

      {/* District Header */}
      <div className="rounded-3xl bg-gradient-to-r from-cop-blue-900 to-cop-blue-800 text-white p-6 sm:p-8 shadow-cop-lg border border-cop-gold-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cop-gold-500/20 text-cop-gold-300 font-bold text-xs border border-cop-gold-500/40">
                {district.areaName}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
              {district.name}
            </h1>

            <div className="text-xs sm:text-sm text-slate-200 flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cop-gold-400" />
                <span>District Minister: <strong>{district.pastorName || 'Pastor'}</strong></span>
              </div>
              <span>•</span>
              <span>{district.assemblyCount} Local Assemblies</span>
            </div>
          </div>

          <div className="text-right flex-shrink-0 bg-white/10 p-4 rounded-2xl border border-white/15">
            <div className="text-[11px] text-cop-gold-300 uppercase font-bold">District Projects</div>
            <div className="text-3xl font-extrabold mt-0.5">{districtProjects.length}</div>
            <div className="text-[10px] text-slate-300">{ongoingCount} Ongoing &bull; {completedCount} Done</div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cop-blue-700" />
          <span>Projects Logged in {district.name} ({districtProjects.length})</span>
        </h2>

        {districtProjects.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
            No projects logged for this District yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districtProjects.map((project) => (
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
