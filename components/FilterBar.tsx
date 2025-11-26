
import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Users, DollarSign, Calendar, Filter, X, Bus, Home, Flag, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterState {
  search: string;
  regions: string[];
  vibes: string[];
  logistics: string[];
  lodgingTypes: string[];
  months: string[];
  minPrice: number | '';
  maxPrice: number | '';
  minPax: number | '';
  maxPax: number | '';
  minNights: number | '';
  maxNights: number | '';
  minRounds: number | '';
  maxRounds: number | '';
  tripType: 'all' | 'golf' | 'charter';
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  resultCount: number;
  availableRegions: string[];
  availableVibes: string[];
  availableLogistics: string[];
  availableLodgingTypes: string[];
  availableMonths: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, resultCount, availableRegions, availableVibes, availableLogistics, availableLodgingTypes, availableMonths }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleRegionToggle = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region];
    onFilterChange({ ...filters, regions: newRegions });
  };

  const handleVibeToggle = (vibe: string) => {
    const newVibes = filters.vibes.includes(vibe)
      ? filters.vibes.filter(v => v !== vibe)
      : [...filters.vibes, vibe];
    onFilterChange({ ...filters, vibes: newVibes });
  };

  const handleLogisticToggle = (logistic: string) => {
    const newLogistics = filters.logistics.includes(logistic)
      ? filters.logistics.filter(l => l !== logistic)
      : [...filters.logistics, logistic];
    onFilterChange({ ...filters, logistics: newLogistics });
  };

  const handleLodgingTypeToggle = (type: string) => {
    const newTypes = filters.lodgingTypes.includes(type)
      ? filters.lodgingTypes.filter(t => t !== type)
      : [...filters.lodgingTypes, type];
    onFilterChange({ ...filters, lodgingTypes: newTypes });
  };

  const handleMonthToggle = (month: string) => {
    const newMonths = filters.months.includes(month)
      ? filters.months.filter(m => m !== month)
      : [...filters.months, month];
    onFilterChange({ ...filters, months: newMonths });
  };

  const resetFilters = () => {
    onFilterChange({
      search: '',
      regions: [],
      vibes: [],
      logistics: [],
      lodgingTypes: [],
      months: [],
      minPrice: '',
      maxPrice: '',
      minPax: '',
      maxPax: '',
      minNights: '',
      maxNights: '',
      minRounds: '',
      maxRounds: '',
      tripType: 'all'
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.regions.length > 0 || 
    filters.vibes.length > 0 || 
    filters.logistics.length > 0 ||
    filters.lodgingTypes.length > 0 ||
    filters.months.length > 0 ||
    filters.minPrice !== '' || 
    filters.tripType !== 'all' ||
    filters.minPax !== '' ||
    filters.minNights !== '' ||
    filters.minRounds !== '';

  // Count active non-text filters for the summary
  const activeFilterCount = 
    filters.regions.length + 
    filters.vibes.length + 
    filters.logistics.length + 
    filters.lodgingTypes.length + 
    filters.months.length +
    (filters.minPrice !== '' || filters.maxPrice !== '' ? 1 : 0) +
    (filters.minPax !== '' || filters.maxPax !== '' ? 1 : 0) +
    (filters.minNights !== '' || filters.maxNights !== '' ? 1 : 0) +
    (filters.minRounds !== '' || filters.maxRounds !== '' ? 1 : 0);

  const handleNumberChange = (field: keyof FilterState, value: string) => {
    const numVal = parseInt(value);
    onFilterChange({
        ...filters,
        [field]: isNaN(numVal) ? '' : numVal
    });
  };

  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const sortedMonths = availableMonths.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-8 animate-in slide-in-from-top-2">
      <div className="flex flex-col gap-4">
        
        {/* Top Row: Search and Quick Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, course, or keyword..." 
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm transition-all text-slate-900"
            />
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-bold">
                <button 
                    onClick={() => onFilterChange({...filters, tripType: 'all'})}
                    className={`px-4 py-2 rounded-lg transition-all ${filters.tripType === 'all' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    All Trips
                </button>
                <button 
                    onClick={() => onFilterChange({...filters, tripType: 'golf'})}
                    className={`px-4 py-2 rounded-lg transition-all ${filters.tripType === 'golf' ? 'bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-100' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Golf
                </button>
                <button 
                    onClick={() => onFilterChange({...filters, tripType: 'charter'})}
                    className={`px-4 py-2 rounded-lg transition-all ${filters.tripType === 'charter' ? 'bg-white text-blue-800 shadow-sm ring-1 ring-blue-100' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Charter/Bus
                </button>
             </div>
             
             {/* Filter Toggle Button */}
             <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                    isExpanded || activeFilterCount > 0
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
             >
                <Filter className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-0.5">{activeFilterCount}</span>
                )}
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
             </button>

             {hasActiveFilters && (
                <button 
                    onClick={resetFilters}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg px-3 py-2 flex items-center gap-1.5 transition-colors"
                >
                    <X className="w-3.5 h-3.5" /> Reset
                </button>
             )}
          </div>
        </div>

        {/* Collapsible Filter Grid */}
        {isExpanded && (
            <>
            <div className="border-t border-slate-100 my-2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 animate-in fade-in slide-in-from-top-1 duration-200">
                
                {/* Column 1: Destinations & Month */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" /> Destinations
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableRegions.length > 0 ? availableRegions.map(r => (
                                <button
                                    key={r}
                                    onClick={() => handleRegionToggle(r)}
                                    className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                                        filters.regions.includes(r) 
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {r}
                                </button>
                            )) : (
                                <span className="text-xs text-slate-400 italic py-1">No destinations available</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> Month
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {sortedMonths.length > 0 ? sortedMonths.map(m => (
                                <button
                                    key={m}
                                    onClick={() => handleMonthToggle(m)}
                                    className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                                        filters.months.includes(m) 
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {m}
                                </button>
                            )) : (
                                <span className="text-xs text-slate-400 italic py-1">No dates available</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: Vibe & Lodging Type */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" /> Vibe
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableVibes.length > 0 ? availableVibes.map(v => (
                                <button
                                    key={v}
                                    onClick={() => handleVibeToggle(v)}
                                    className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                                        filters.vibes.includes(v) 
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {v}
                                </button>
                            )) : (
                                <span className="text-xs text-slate-400 italic py-1">No vibes available</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                            <Home className="w-3 h-3" /> Lodging Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableLodgingTypes.length > 0 ? availableLodgingTypes.map(t => (
                                <button
                                    key={t}
                                    onClick={() => handleLodgingTypeToggle(t)}
                                    className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                                        filters.lodgingTypes.includes(t) 
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {t}
                                </button>
                            )) : (
                                <span className="text-xs text-slate-400 italic py-1">No lodging types available</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 3: Logistics */}
                <div className="space-y-3">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                        <Bus className="w-3 h-3" /> Transport Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {availableLogistics.length > 0 ? availableLogistics.map(l => (
                            <button
                                key={l}
                                onClick={() => handleLogisticToggle(l)}
                                className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                                    filters.logistics.includes(l) 
                                    ? 'bg-slate-800 border-slate-800 text-white shadow-md' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {l}
                            </button>
                        )) : (
                            <span className="text-xs text-slate-400 italic py-1">No options available</span>
                        )}
                    </div>
                </div>

                {/* Column 4: Ranges (Price, Pax, Nights, Rounds) */}
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                            <DollarSign className="w-3 h-3" /> Budget (Per Person)
                        </label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={filters.minPrice}
                                onChange={(e) => handleNumberChange('minPrice', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white text-slate-900"
                            />
                            <span className="text-slate-300 font-light">—</span>
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={filters.maxPrice}
                                onChange={(e) => handleNumberChange('maxPrice', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest flex items-center gap-1">
                                <Users className="w-3 h-3" /> Group Size
                            </label>
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={filters.minPax}
                                onChange={(e) => handleNumberChange('minPax', e.target.value)}
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Nights
                            </label>
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={filters.minNights}
                                onChange={(e) => handleNumberChange('minNights', e.target.value)}
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white text-slate-900"
                            />
                        </div>
                    </div>

                    {filters.tripType !== 'charter' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                                <Flag className="w-3 h-3" /> Rounds
                            </label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={filters.minRounds}
                                    onChange={(e) => handleNumberChange('minRounds', e.target.value)}
                                    className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white text-slate-900"
                                />
                                <span className="text-slate-300 font-light">—</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={filters.maxRounds}
                                    onChange={(e) => handleNumberChange('maxRounds', e.target.value)}
                                    className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white text-slate-900"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </>
        )}
        
        <div className="flex justify-between items-center pt-1">
            <div className="text-xs text-slate-500 font-medium">
                Showing <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{resultCount}</span> matching trips
            </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
