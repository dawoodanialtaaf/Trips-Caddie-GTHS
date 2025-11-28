
import React, { useState, useEffect } from 'react';
import { TripRecap } from '../types';
import { COURSES, LODGING } from '../constants';
import { Calendar, MapPin, Bus, ChevronDown, ChevronUp, Zap, Lightbulb, Trash2, Share2, ArrowUpRight, Trophy, Edit, Star, Clock } from 'lucide-react';

interface TripCardProps {
  trip: TripRecap;
  onClone: (trip: TripRecap) => void;
  onWebExport: (trip: TripRecap) => void;
  onShare: (trip: TripRecap) => void;
  onDelete: (id: string) => void;
  onEdit: (trip: TripRecap) => void;
  isAdmin?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onClone, onWebExport, onShare, onDelete, onEdit, isAdmin = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);

  const badgeColors: Record<string, string> = {
    'Budget': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Value': 'bg-blue-50 text-blue-700 border-blue-100',
    'Premium': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Bucket List': 'bg-amber-50 text-amber-700 border-amber-100',
    'Bachelor Party': 'bg-rose-50 text-rose-700 border-rose-100',
    'Corporate': 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const getTripImage = (trip: TripRecap) => {
    // Priority: Custom Image URL -> Logic
    if (trip.imageUrl && trip.imageUrl.trim() !== '') {
        return trip.imageUrl;
    }

    // Combine fields for keyword search
    const text = `${trip.groupName} ${trip.synopsis} ${trip.lodging} ${trip.courses.join(' ')} ${trip.vibe}`.toLowerCase();
    
    // Use trip ID to deterministically select an image from a set
    const seed = trip.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Image Collections (High Quality Unsplash)
    // Expanded for variety in infinite scroll
    const collections: Record<string, string[]> = {
        bus: [
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=800"
        ],
        tahoe: [
            "https://images.unsplash.com/photo-1552945432-a279769cbc2e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1563299796-b729d0af54a5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1548232979-6c557ee14752?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1573059882283-433b9b472266?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1623880846882-9657099f6974?auto=format&fit=crop&q=80&w=800"
        ],
        mountain: [
            "https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1605118287313-2d259e83897c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519331379826-f947873e307d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&q=80&w=800"
        ],
        winter: [
            "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800"
        ],
        reno_fun: [
             "https://images.unsplash.com/photo-1596726672322-25e1a38c2054?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1514525253440-b39345208668?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1583908064973-19614777d0a1?auto=format&fit=crop&q=80&w=800", // Neon
             "https://images.unsplash.com/photo-1558280417-1335b2a36b9e?auto=format&fit=crop&q=80&w=800"
        ],
        reno_city: [
             "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1549495577-c37632684563?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1559437225-b1d61882d03a?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1629864222045-8164082dc572?auto=format&fit=crop&q=80&w=800"
        ],
        coastal: [
             "https://images.unsplash.com/photo-1533241249764-167882dc8104?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1473442240418-452f03b7ae40?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1534008778619-a939268f7d98?auto=format&fit=crop&q=80&w=800"
        ],
        golf: [
             "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1593111774240-d529f12db464?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1622396345636-65b1d5754593?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1628488321434-583eb4233075?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1592919505780-30395071e229?auto=format&fit=crop&q=80&w=800"
        ],
        desert: [
             "https://images.unsplash.com/photo-1489436969537-cf0c1dc49c90?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80&w=800"
        ],
        luxury: [
             "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800"
        ]
    };

    // Intelligent Grouping Logic
    let category = 'golf';
    if (trip.rounds === 0 || text.includes('charter') || text.includes('bus') || text.includes('school') || text.includes('team') || text.includes('transport') || text.includes('airport')) {
        category = 'bus';
    } else if (text.includes('winter') || trip.month.includes('Dec') || trip.month.includes('Jan') || trip.month.includes('Feb')) {
        category = 'winter';
    } else if (text.includes('tahoe') || text.includes('edgewood') || text.includes('hyatt') || text.includes('beach')) {
        category = 'tahoe';
    } else if (text.includes('graeagle') || text.includes('truckee') || text.includes('cabin') || text.includes('pines') || text.includes('nakoma')) {
        category = 'mountain';
    } else if (text.includes('monterey') || text.includes('carmel') || text.includes('bayonet')) {
        category = 'coastal';
    } else if (trip.vibe === 'Bachelor Party' || text.includes('bachelor') || text.includes('party')) {
        category = 'reno_fun';
    } else if (trip.vibe === 'Premium' || trip.vibe === 'Bucket List') {
        category = 'luxury';
    } else if (text.includes('reno') || text.includes('casino') || text.includes('silver legacy') || text.includes('atlantis')) {
        category = 'reno_city';
    } else if (text.includes('desert') || text.includes('valley')) {
        category = 'desert';
    }

    const set = collections[category];
    return set[seed % set.length];
  };

  useEffect(() => {
    setImgSrc(getTripImage(trip));
  }, [trip]);

  const handleImageError = () => {
    // Robust fallback image (General Golf Course)
    setImgSrc("https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800");
  };

  const getTrackingLink = (name: string, type: 'course' | 'lodging') => {
    if (!name) return null;
    
    let url = '';
    const cleanName = name.toLowerCase();

    if (type === 'course') {
        const found = COURSES.find(c => cleanName.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(cleanName));
        url = found?.url || '';
    } else {
        const found = LODGING.find(l => cleanName.includes(l.name.toLowerCase()) || l.name.toLowerCase().includes(cleanName));
        url = found?.url || '';
    }

    if (!url || url === '#' || url === '') return null;
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}utm_source=caddie_archive&utm_medium=referral&utm_campaign=trip_card`;
  };

  const lodgingLink = getTrackingLink(trip.lodging, 'lodging');

  return (
    <div 
        className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group/card ${isExpanded ? 'row-span-2' : 'h-[640px]'}`}
    >
      
      {/* Header Image */}
      <div className="h-40 bg-slate-900 relative shrink-0 overflow-hidden">
        {/* Skeleton/Placeholder while loading */}
        <div className={`absolute inset-0 bg-slate-800 animate-pulse z-0 ${imageLoaded ? 'hidden' : 'block'}`} />
        
        <img 
            src={imgSrc} 
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            alt="Trip Destination" 
            className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out ${imageLoaded ? 'opacity-90 scale-100 group-hover/card:scale-110' : 'opacity-0 scale-105'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none"></div>
        
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
                    <span className="block text-lg font-bold text-emerald-800 leading-none">
                        ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(trip.pricePerPerson)}
                    </span>
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
                {trip.lodging && (
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
                )}
            </div>
            
             {/* Highlights */}
             {trip.highlights && trip.highlights.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2.5">
                        <Zap className="w-3 h-3 mr-1 text-amber-500 fill-amber-500" /> Highlights
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {trip.highlights.map((h, i) => {
                            // Try to match highlights to links (e.g. "Whitehawk Ranch")
                            const link = getTrackingLink(h, 'course') || getTrackingLink(h, 'lodging');
                            if (link) {
                                return (
                                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-slate-600 flex items-center gap-2 hover:text-emerald-700 hover:underline">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                                        {h} <ArrowUpRight className="w-2.5 h-2.5" />
                                    </a>
                                );
                            }
                            return (
                                <span key={i} className="text-xs font-medium text-slate-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {h}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Planner Insight / Pro Tip - Only render if content exists */}
            {trip.whyItWorked && (
                <div className={`border rounded-xl p-5 mb-2 relative overflow-hidden group/insight ${trip.rounds > 0 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/insight:opacity-20 transition-opacity pointer-events-none">
                        <Lightbulb className={`w-16 h-16 ${trip.rounds > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded-md shadow-sm ${trip.rounds > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                            <Lightbulb className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${trip.rounds > 0 ? 'text-amber-800' : 'text-slate-600'}`}>
                            {trip.rounds > 0 ? "Pro Tip" : "Package Insight"}
                        </span>
                    </div>
                    <p className={`text-xs leading-relaxed font-medium relative z-10 pl-1 ${trip.rounds > 0 ? 'text-amber-950/80' : 'text-slate-600'}`}>
                        "{trip.whyItWorked}"
                    </p>
                </div>
            )}
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

                {/* Itinerary Timeline - Refined Visuals */}
                <div className="relative pl-8 space-y-8 py-2 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    {trip.dailyItinerary?.map((day, idx) => {
                        // Check for links in activity/location
                        const activityLink = getTrackingLink(day.activity, 'course') || getTrackingLink(day.activity, 'lodging');
                        const locationLink = getTrackingLink(day.location, 'course') || getTrackingLink(day.location, 'lodging');

                        return (
                        <div key={idx} className="relative z-0">
                            {/* Visual Node */}
                            <div className="absolute -left-[29px] top-1 h-6 w-6 rounded-full bg-white border-2 border-emerald-500 z-10 flex items-center justify-center shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                {/* Header Row */}
                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-sm font-bold text-slate-800 leading-tight">
                                        Day {day.day} <span className="text-slate-300 mx-1">·</span> 
                                        {activityLink ? (
                                            <a href={activityLink} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 hover:underline">
                                                {day.activity} <ArrowUpRight className="inline w-3 h-3 mb-0.5" />
                                            </a>
                                        ) : (
                                            <span>{day.activity}</span>
                                        )}
                                    </span>
                                    {day.time && (
                                         <span className="shrink-0 text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                            {day.time}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Location */}
                                {day.location && (
                                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 -mt-0.5">
                                        {locationLink ? (
                                            <a href={locationLink} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 hover:underline flex items-center gap-1">
                                                {day.location} <ArrowUpRight className="w-2.5 h-2.5" />
                                            </a>
                                        ) : (
                                            day.location
                                        )}
                                    </div>
                                )}

                                {/* Notes */}
                                {day.notes && (
                                    <div className="text-xs text-slate-500 italic leading-relaxed border-l-2 border-slate-200 pl-3 py-1 mt-1">
                                        "{day.notes}"
                                    </div>
                                )}
                            </div>
                        </div>
                    )})}
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
            className="w-full text-sm font-bold uppercase tracking-wide text-rose-600 hover:text-rose-700 transition-colors flex items-center justify-center gap-1.5 pb-2"
        >
            {isExpanded ? (
                <>
                    <ChevronUp className="w-4 h-4" /> Close Logistics
                </>
            ) : (
                <>
                    <ChevronDown className="w-4 h-4" /> View Logistics & Itinerary
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
                        onClick={() => onEdit(trip)}
                        className="col-span-1 py-3 bg-white hover:bg-amber-50 text-slate-400 hover:text-amber-600 border border-slate-200 hover:border-amber-200 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm"
                        title="Edit Trip Details"
                    >
                        <Edit className="w-4 h-4" />
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
