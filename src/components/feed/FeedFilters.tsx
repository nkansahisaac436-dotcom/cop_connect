import React from 'react';
import { Area, FeedFilterState, ProjectCategory, ProjectStatus } from '../../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  RotateCcw, 
  Building2, 
  Compass, 
  Sparkles, 
  Layers, 
  Calendar,
  CheckCircle2,
  Clock,
  Flame
} from 'lucide-react';

interface FeedFiltersProps {
  filters: FeedFilterState;
  onFilterChange: (updates: Partial<FeedFilterState>) => void;
  onResetFilters: () => void;
  areas: Area[];
  totalResults: number;
}

const CATEGORIES: { label: string; value: string; icon: any }[] = [
  { label: 'All Categories', value: 'all', icon: Filter },
  { label: 'Church Building', value: 'Church Building', icon: Building2 },
  { label: 'Evangelism & Outreach', value: 'Outreach/Evangelism', icon: Compass },
  { label: 'Community & Social', value: 'Community Project', icon: Sparkles },
  { label: 'Conferences & Events', value: 'Conference/Event', icon: Calendar },
  { label: 'Mission House', value: 'Mission House', icon: Layers },
];

const STATUSES: { label: string; value: string; icon: any; color: string }[] = [
  { label: 'All Statuses', value: 'all', icon: Filter, color: '' },
  { label: 'Ongoing', value: 'Ongoing', icon: Flame, color: 'text-cop-red-600' },
  { label: 'Planned', value: 'Planned', icon: Clock, color: 'text-cop-gold-600' },
  { label: 'Completed', value: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' },
];

export const FeedFilters: React.FC<FeedFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  areas,
  totalResults,
}) => {
  const isFiltered = 
    filters.searchQuery !== '' || 
    filters.areaId !== 'all' || 
    filters.category !== 'all' || 
    filters.status !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Top Row: Search and Area Selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search projects by title, district, town, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-xs sm:text-sm placeholder:text-slate-400"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Searchable Area Dropdown */}
        <div className="md:col-span-5 relative">
          <MapPin className="w-4 h-4 text-cop-gold-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filters.areaId}
            onChange={(e) => onFilterChange({ areaId: e.target.value })}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cop-blue-600 text-xs sm:text-sm font-semibold text-slate-800 appearance-none cursor-pointer"
          >
            <option value="all">National & International (All Areas)</option>
            <optgroup label="Ghana Areas">
              {areas
                .filter((a) => a.country === 'Ghana')
                .map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name} ({area.region})
                  </option>
                ))}
            </optgroup>
            <optgroup label="International Areas">
              {areas
                .filter((a) => a.country !== 'Ghana')
                .map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name} ({area.country})
                  </option>
                ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = filters.category === cat.value;

          return (
            <button
              key={cat.value}
              onClick={() => onFilterChange({ category: cat.value })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cop-blue-800 text-white shadow-sm ring-1 ring-cop-blue-900'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Status Filter & Results Row */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-400 mr-1 hidden sm:inline">Status:</span>
          {STATUSES.map((st) => {
            const Icon = st.icon;
            const isActive = filters.status === st.value;

            return (
              <button
                key={st.value}
                onClick={() => onFilterChange({ status: st.value })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-cop-gold-500 text-slate-900 font-extrabold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3 h-3 ${st.color}`} />
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{totalResults}</strong> projects
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-cop-red-600 hover:underline font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
