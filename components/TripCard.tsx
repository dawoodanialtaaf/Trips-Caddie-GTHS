import React, { useState, useEffect } from 'react';
import { TripRecap } from '../types';
import { COURSES, LODGING } from '../constants';
import { fetchWeather } from '../services/weatherService';
import { Calendar, MapPin, Bus, ChevronDown, ChevronUp, Star, Zap, Lightbulb, Trash2, Share2, ArrowUpRight, Trophy, Globe, CloudSun, Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

interface TripCardProps {
  trip: TripRecap;
  onClone: (trip: TripRecap) => void;
  onWebExport: (trip: TripRecap) => void;
  onShare: (trip: TripRecap) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onClone, onWebExport, onShare, onDelete, isAdmin = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [weather, setWeather] = useState<{ temp: number; condition: string; code: number } | null>(null);

  const badgeColors: Record<string, string> = {
    'Budget': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Value': 'bg-blue-50 text-blue-700 border-blue-100',
    'Premium': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Bucket List': 'bg-amber-50 text-amber-700 border-amber-100',
    'Bachelor Party': 'bg-rose-50 text-rose-700 border-rose-100',
    'Corporate': 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const getTripImage = (trip: TripRecap) => {
    // Combine fields for keyword search
    const text = `${trip.groupName} ${trip.synopsis} ${trip.lodging} ${trip.courses.join(' ')} ${trip.vibe}`.toLowerCase();
    
    // Use trip ID to deterministically select an image from a set
    const seed = trip.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Image Collections (High Quality Unsplash)
    const collections: Record<string, string[]> = {
        bus: [
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&q=80&w=800"
        ],
        tahoe: [
            "https://images.unsplash.com/photo-1552945432-a279769cbc2e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1563299796-b729d0af54a5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1548232979-6c557ee14752?auto=format&fit=crop&q=80&w=800"
        ],
        mountain: [
            "https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1605118287313-2d259e83897c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519331379826-f947873e307d?auto=format&fit=crop&q=80&w=800"
        ],
        reno_fun: [
             "https://images.unsplash.com/photo-1596726672322-25e1a38c2054?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1514525253440-b39345208668?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1583908064973-19614777d0a1?auto=format&fit=crop&q=80&w=800" // Neon
        ],
        reno_city: [
             "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1549495577-c37632684563?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1559437225-b1d61882d03a?auto=format&fit=crop&q=80&w=800"
        ],
        coastal: [
             "https://images.unsplash.com/photo-1533241249764-167882dc8104?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1473442240418-452f03b7ae40?auto=format&fit=crop&q=80&w=800"
        ],
        golf: [
             "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1593111774240-d529f12db464?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1622396345636-65b1d5754593?auto=format&fit=crop&q=80&w=800"
        ]
    };

    // Intelligent Grouping Logic
    let category = 'golf';
    if (trip.rounds === 0 || text.includes('charter') || text.includes('bus') || text.includes('school') || text.includes('team') || text.includes('transport') || text.includes('airport')) {
        category = 'bus';
    } else if (text.includes('tahoe') || text.includes('edgewood') || text.includes('hyatt') || text.includes('beach')) {
        category = 'tahoe';
    } else if (text.includes('graeagle') || text.includes('truckee') || text.includes('cabin') || text.includes('pines') || text.includes('nakoma')) {
        category = 'mountain';
    } else if (text.includes('monterey') || text.includes('carmel') || text.includes('bayonet')) {
        category = 'coastal';
    } else if (trip.vibe === 'Bachelor Party' || text.includes('bachelor') || text.includes('party')) {
        category = 'reno_fun';
    } else if (text.includes('reno') || text.includes('casino') || text.includes('silver legacy') || text.includes('atlantis')) {
        category = 'reno_city';
    }

    const set = collections[category];
    return set[seed % set.length];
  };

  useEffect(() => {
    setImgSrc(getTripImage(trip));
    
    // Determine primary region for weather
    let region = '';
    // Try lodging first
    const l = LODGING.find(opt => trip.lodging.includes(opt.name) || opt.name.includes(trip.lodging));
    if (l) {
        region = l.region;
    } else {
        // Try courses
        for (const cName of trip.courses) {
            const c = COURSES.find(opt => cName.includes(opt.name) || opt.name.includes(cName));
            if (c) {
                region = c.region;
                break;
            }
        }
    }
    
    // Fallback if no exact match found but names are indicative
    if (!region) {
        const text = (trip.lodging + ' ' + trip.courses.join(' ')).toLowerCase();
        if (text.includes('reno')) region = 'Reno';
        else if (text.includes('tahoe')) region = 'Lake Tahoe';
        else if (text.includes('graeagle')) region = 'Graeagle';
        else if (text.includes('truckee')) region = 'Truckee';
        else if (text.includes('carson')) region = 'Carson Valley';
    }

    if (region) {
        fetchWeather(region).then(data => {
            if (data) setWeather(data);
        });
    }

  }, [trip]);

  const handleImageError = () => {
    // Robust fallback image (General Golf Course)
    setImgSrc("https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800");
  };

  const getTrackingLink = (name: string, type: 'course' | 'lodging') => {
    let url = '';
    if (type === 'course') {
        const found = COURSES.find(c => name.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(name.toLowerCase()));
        url = found?.url || '';
    } else {
        const found = LODGING.find(l => name.toLowerCase().includes(l.name.toLowerCase()) || l.name.toLowerCase().includes(name.toLowerCase()));
        url = found?.url || '';
    }

    if (!url || url === '#' || url === '') return null;
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}utm_source=caddie_archive&utm_medium=referral&utm_campaign=trip_card`;
  };

  const lodgingLink = getTrackingLink(trip.lodging, 'lodging');

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-3 h-3 text-amber-400" />;
    if (code <= 3) return <CloudSun className="w-3 h-3 text-amber-200" />;
    if (code <= 67) return <CloudRain className="w-3 h-3 text-blue-300" />;
    if (code <= 77) return <Snowflake className="w-3 h-3 text-sky-200" />;
    return <Cloud className="w-3 h-3 text-slate-300" />;
  };

  return (
    <div 
        className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group/card ${isExpanded ? 'row-span-2' : 'h-[640px]'}`}
    >
      
      {/* Header Image */}
      <div className="h-40 bg-slate-900 relative shrink-0 overflow-hidden">
        <img 
            src={imgSrc} 
            onError={handleImageError}
            alt="Trip Destination" 
            className="w-full h-full object-cover opacity-90 group-hover/card:scale-110 transition-transform duration-[2000ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        {/* Weather Widget (Top Left) */}
        {weather && (
            <div className="absolute top-3 left-3 z-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 flex items-center gap-2 shadow-sm animate-in fade-in duration-700">
                {getWeatherIcon(weather.code)}
                <span className="text-[10px] font-bold text-white tracking-wide">{weather.temp}°F</span>
            </div>
        )}

        {/* Vibe Badge (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
           <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm backdrop-blur-sm ${badgeColors[trip.vibe] || 'bg-white/90 text-slate-800'}`}>
             {trip.vibe}
           </span>
        </div>
        
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h3 className="font-extrabold text-xl leading-snug shadow-black drop-shadow-sm mb-1 line-clamp-2">{trip.groupName}</h3>
          <div className="flex items-center text-xs font-bold text-slate-200 uppercase tracking-wide">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            {trip.month} {trip.year}
          </div>
        </div>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-white">
        
        {/* OVERVIEW SECTION */}
        <div className="p-6 pb-2">
            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div 
                    title="Number of Travelers (Group Size)"
                    className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-2.5 group/metric hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-help"
                >
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Pax</span>
                    <span className="block text-lg font-bold text-slate-800 leading-none">{trip.groupSize}</span>
                </div>
                {/* Pricing Metric */}
                <div 
                    title="Estimated price per person based on previous booking"
                    className="flex flex-col items-center justify-center bg-emerald-50/50 border border-emerald-100/50 rounded-xl py-2.5 group/metric hover:bg-emerald-50 hover:shadow-sm hover:border-emerald-200 transition-all cursor-help"
                >
                    <span className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider leading-none mb-0.5">From</span>
                    <span className="block text-lg font-bold text-emerald-800 leading-none">${trip.pricePerPerson}</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-600/60 tracking-wide mt-0.5">/Person</span>
                </div>
                <div 
                    title="Total nights of the trip"
                    className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-2.5 group/metric hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-help"
                >
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Nights</span>
                    <span className="block text-lg font-bold text-slate-800 leading-none">{trip.nights}</span>
                </div>
            </div>

            {/* Synopsis */}
            <div className="mb-6">
                <p className="text-sm text-slate-600 italic leading-relaxed border-l-[3px] border-emerald-500 pl-4 py-1">
                "{trip.synopsis}"
                </p>
            </div>

            {/* Tags */}
            <div className="space-y-5 mb-6">
                <div>
                    <div className="flex items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2.5">
                        <MapPin className="w-3 h-3 mr-1" /> Activities
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {trip.courses.map((c, i) => {
                            const link = getTrackingLink(c, 'course');
                            if (link) {
                                return (
                                    <a 
                                        key={i} 
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 shadow-sm hover:border-emerald-400 hover:text-emerald-700 hover:shadow-md transition-all flex items-center gap-1 group/link"
                                        title={`View details for ${c}`}
                                    >
                                        {c}
                                        <ArrowUpRight className="w-2.5 h-2.5 opacity-30 group-hover/link:opacity-100" />
                                    </a>
                                );
                            }
                            return (
                                <span key={i} className="bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200">
                                    {c}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <div className="flex items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2.5">
                        <Star className="w-3 h-3 mr-1" /> Stayed
                    </div>
                    {lodgingLink ? (
                        <a 
                            href={lodgingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all gap-1 group/link"
                        >
                            {trip.lodging}
                            <ArrowUpRight className="w-2.5 h-2.5 opacity-30 group-hover/link:opacity-100" />
                        </a>
                    ) : (
                        <span className="inline-flex items-center bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100">
                            {trip.lodging}
                        </span>
                    )}
                </div>
            </div>
            
             {/* Highlights */}
             {trip.highlights && trip.highlights.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2.5">
                        <Zap className="w-3 h-3 mr-1 text-amber-500 fill-amber-500" /> Highlights
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {trip.highlights.map((h, i) => (
                            <span key={i} className="text-xs font-medium text-slate-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {h}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Planner Insight / Pro Tip */}
            <div className={`border rounded-xl p-5 mb-2 relative overflow-hidden group/insight ${trip.rounds > 0 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/insight:opacity-20 transition-opacity pointer-events-none">
                    <Lightbulb className={`w-16 h-16 ${trip.rounds > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 rounded-md shadow-sm ${trip.rounds > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                        <Lightbulb className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${trip.rounds > 0 ? 'text-amber-800' : 'text-slate-600'}`}>
                        {trip.rounds > 0 ? "Pro Tip" : "Planner Insight"}
                    </span>
                </div>
                <p className={`text-xs leading-relaxed font-medium relative z-10 pl-1 ${trip.rounds > 0 ? 'text-amber-950/80' : 'text-slate-600'}`}>
                    "{trip.whyItWorked}"
                </p>
            </div>
        </div>

        {/* LOGISTICS & MANIFEST SECTION (Revealed on Expand) */}
        {isExpanded && (
            <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="my-6 border-t border-slate-100 border-dashed"></div>
                
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                    Logistics & Manifest
                </h4>
                
                {/* Transport Header */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex items-start gap-4 shadow-sm">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-700">
                        <Bus className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Vehicle</span>
                        <span className="text-sm font-bold text-slate-900">{trip.logistics?.transportType || 'Transport Not Specified'}</span>
                    </div>
                </div>

                {/* Itinerary Timeline */}
                <div className="ml-3 pl-8 border-l-2 border-slate-200 space-y-8 py-2">
                    {trip.dailyItinerary?.map((day, idx) => (
                        <div key={idx} className="relative group/day">
                            <div className="absolute -left-[39px] top-1 h-5 w-5 rounded-full bg-white border-2 border-emerald-500 shadow-sm z-10 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-800">
                                        Day {day.day} <span className="text-slate-300 mx-1">·</span> {day.activity}
                                    </span>
                                    <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        {day.time}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-600 pl-0">
                                    <p className="mb-2 font-medium">{day.location}</p>
                                    {day.notes && (
                                        <div className="text-slate-500 italic text-[11px] leading-relaxed">
                                            "{day.notes}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                 {/* Special Requests */}
                 {trip.logistics?.specialRequests?.length > 0 && (
                     <div className="mt-8 bg-rose-50 rounded-xl p-5 border border-rose-100">
                         <h4 className="text-[10px] font-bold uppercase text-rose-500 tracking-wider mb-3">Special Requests</h4>
                         <ul className="space-y-3">
                             {trip.logistics.specialRequests.map((req, i) => (
                                 <li key={i} className="text-xs text-slate-700 flex items-start gap-3">
                                    <div className="min-w-[4px] h-[4px] rounded-full bg-rose-400 mt-2"></div>
                                    <span className="opacity-90 font-medium leading-relaxed">{req}</span>
                                 </li>
                             ))}
                         </ul>
                     </div>
                 )}
            </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-white z-10 space-y-3">
        {/* Expand Toggle */}
        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-xs font-bold uppercase tracking-wide text-slate-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1.5 pb-2"
        >
            {isExpanded ? (
                <>
                    <ChevronUp className="w-3.5 h-3.5" /> Close Logistics
                </>
            ) : (
                <>
                    <ChevronDown className="w-3.5 h-3.5" /> View Logistics & Itinerary
                </>
            )}
        </button>

        <div className="grid grid-cols-6 gap-3">
            <button 
                onClick={() => onClone(trip)}
                className={`py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all duration-300 shadow-md shadow-emerald-200 hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-[0.98] ${isAdmin ? 'col-span-3' : 'col-span-5'}`}
            >
                <Trophy className="w-3.5 h-3.5" />
                Get Similar Quote
            </button>
            <button 
                onClick={() => onShare(trip)}
                className="col-span-1 py-3 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm"
                title="Share Trip"
            >
                <Share2 className="w-4 h-4" />
            </button>
            
            {isAdmin && (
                <>
                    <button 
                        onClick={() => onWebExport(trip)}
                        className="col-span-1 py-3 bg-white hover:bg-slate-50 text-slate-400 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm"
                        title="Export for Website"
                    >
                        <Globe className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(trip.id)}
                        className="col-span-1 py-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-200 hover:border-rose-200 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm"
                        title="Delete Package"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;