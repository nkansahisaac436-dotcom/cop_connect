import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Globe2, 
  MapPin, 
  Search, 
  Layers, 
  Building2, 
  UserCheck, 
  ChevronRight, 
  Users 
} from 'lucide-react';

interface DirectoryPageProps {
  onNavigateArea: (areaId: string) => void;
  onNavigateDistrict: (districtId: string) => void;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  onNavigateArea,
  onNavigateDistrict,
}) => {
  const { areas, districts } = useData();
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const filteredAreas = areas.filter((area) => {
    if (selectedCountry !== 'all' && area.country !== selectedCountry) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        area.name.toLowerCase().includes(q) ||
        area.region.toLowerCase().includes(q) ||
        area.country.toLowerCase().includes(q) ||
        (area.areaHeadName && area.areaHeadName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Directory Banner */}
      <div className="bg-gradient-to-r from-cop-blue-900 to-cop-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-cop-lg border border-cop-gold-500/30">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cop-gold-300 text-xs font-bold">
            <Globe2 className="w-3.5 h-3.5" />
            <span>National & International Directory</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Church of Pentecost Areas & Districts
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Browse through all administrative Areas and constituent Districts to explore leadership
            structures and local church developments.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Area name, region, country, or Apostle..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cop-blue-600"
          />
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full sm:w-56 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none"
        >
          <option value="all">All Nations</option>
          <option value="Ghana">Ghana</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="United States">United States</option>
          <option value="France">France</option>
        </select>
      </div>

      {/* Area Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAreas.map((area) => {
          const areaDistrictsList = districts.filter((d) => d.areaId === area.id);

          return (
            <div
              key={area.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-cop-lg hover:border-cop-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-cop-gold-700 uppercase">
                      {area.region} &bull; {area.country}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-slate-900 mt-0.5">
                      {area.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cop-blue-50 text-cop-blue-800 text-xs font-bold">
                    {areaDistrictsList.length} Districts
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="text-slate-400 font-semibold">Area Head: </span>
                  <strong className="text-slate-800">
                    {area.areaHeadName || 'Pending Assignment'}
                  </strong>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Total Projects:</span>
                    <div className="font-bold text-slate-800">{area.totalProjectsCount || 0}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Completed:</span>
                    <div className="font-bold text-emerald-600">{area.totalCompletedProjects || 0}</div>
                  </div>
                </div>

                {/* Sample Districts Chips */}
                {areaDistrictsList.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                      Districts:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {areaDistrictsList.slice(0, 4).map((d) => (
                        <button
                          key={d.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateDistrict(d.id);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-cop-blue-50 text-[11px] text-slate-700 hover:text-cop-blue-800 font-medium transition-colors"
                        >
                          {d.name.replace(' District', '')}
                        </button>
                      ))}
                      {areaDistrictsList.length > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{areaDistrictsList.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onNavigateArea(area.id)}
                  className="font-bold text-cop-blue-800 hover:underline flex items-center gap-1"
                >
                  <span>Explore {area.name} Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
