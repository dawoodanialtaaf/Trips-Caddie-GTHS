
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import TripForm from './components/TripForm';
import TripCard from './components/TripCard';
import QuoteGenerator from './components/QuoteGenerator';
import WebExportModal from './components/WebExportModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminSettingsModal from './components/AdminSettingsModal';
import AdminRequestLogModal from './components/AdminRequestLogModal';
import ShareModal from './components/ShareModal';
import TaskManagerModal from './components/TaskManagerModal';
import ConfirmationModal from './components/ConfirmationModal';
import FilterBar from './components/FilterBar';
import { TripRecap, Region, SmtpConfig, QuoteRequestLog, Task } from './types';
import { MOCK_RECAPS, COURSES, LODGING } from './constants';
import { Plus, LayoutGrid, Lock, LogOut, Share2, Settings, ClipboardList, CheckSquare, Loader2 } from 'lucide-react';

const DEFAULT_ADMIN_EMAILS = [
  'sean@golfthehighsierra.com',
  'mike@zoomaway.com',
  'MEskuchen@zoomaway.com',
  'ifyougetlockedout@protonmail.com'
];

const ITEMS_PER_PAGE = 12;

const App: React.FC = () => {
  const [view, setView] = useState<'gallery' | 'form'>('gallery');
  const [recaps, setRecaps] = useState<TripRecap[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef(null);
  
  // Admin Settings
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [adminEmails, setAdminEmails] = useState<string[]>(DEFAULT_ADMIN_EMAILS);
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig | null>(null);
  
  // Request Logs
  const [requestLogs, setRequestLogs] = useState<QuoteRequestLog[]>([]);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTasksModal, setShowTasksModal] = useState(false);

  // Modals
  const [selectedRecapForQuote, setSelectedRecapForQuote] = useState<TripRecap | null>(null);
  const [selectedRecapForWeb, setSelectedRecapForWeb] = useState<TripRecap | null>(null);
  const [selectedRecapForShare, setSelectedRecapForShare] = useState<TripRecap | null>(null);
  const [showPageShare, setShowPageShare] = useState(false);
  
  // Deletion Confirmation State
  const [recapToDelete, setRecapToDelete] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    regions: [] as string[],
    vibes: [] as string[],
    logistics: [] as string[],
    lodgingTypes: [] as string[],
    months: [] as string[],
    minPrice: '' as number | '',
    maxPrice: '' as number | '',
    minPax: '' as number | '',
    maxPax: '' as number | '',
    minNights: '' as number | '',
    maxNights: '' as number | '',
    minRounds: '' as number | '',
    maxRounds: '' as number | '',
    tripType: 'all' as 'all' | 'golf' | 'charter'
  });

  // Load initial data (Simulating DB)
  useEffect(() => {
    const saved = localStorage.getItem('gths_recaps');
    if (saved) {
      setRecaps(JSON.parse(saved));
    } else {
      setRecaps(MOCK_RECAPS);
      localStorage.setItem('gths_recaps', JSON.stringify(MOCK_RECAPS));
    }
    
    // Check admin session
    const adminSession = sessionStorage.getItem('gths_admin');
    if (adminSession === 'true') setIsAdmin(true);

    // Load admin emails
    const savedEmails = localStorage.getItem('gths_admin_emails');
    if (savedEmails) {
        setAdminEmails(JSON.parse(savedEmails));
    }

    // Load SMTP Config
    const savedSmtp = localStorage.getItem('gths_smtp_config');
    if (savedSmtp) {
        setSmtpConfig(JSON.parse(savedSmtp));
    }

    // Load Request Logs
    const savedLogs = localStorage.getItem('gths_request_logs');
    if (savedLogs) {
        setRequestLogs(JSON.parse(savedLogs));
    }

    // Load Tasks
    const savedTasks = localStorage.getItem('gths_tasks');
    if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    sessionStorage.setItem('gths_admin', 'true');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('gths_admin');
  };

  const handleSaveEmails = (emails: string[]) => {
      setAdminEmails(emails);
      localStorage.setItem('gths_admin_emails', JSON.stringify(emails));
  };

  const handleSaveSmtp = (config: SmtpConfig) => {
      setSmtpConfig(config);
      localStorage.setItem('gths_smtp_config', JSON.stringify(config));
  };

  const handleSaveRecap = (newRecap: TripRecap) => {
    const updated = [newRecap, ...recaps];
    setRecaps(updated);
    localStorage.setItem('gths_recaps', JSON.stringify(updated));
    setView('gallery');
  };

  // Trigger Modal
  const handleDeleteRecap = (id: string) => {
    setRecapToDelete(id);
  };

  // Actual Delete Logic
  const confirmDeleteRecap = () => {
    if (recapToDelete) {
        const updated = recaps.filter(r => r.id !== recapToDelete);
        setRecaps(updated);
        localStorage.setItem('gths_recaps', JSON.stringify(updated));
        setRecapToDelete(null);
    }
  };
  
  // LOGGING HANDLERS
  const handleQuoteSent = (log: QuoteRequestLog) => {
      // Prepend new log and keep only the last 50
      const updatedLogs = [log, ...requestLogs].slice(0, 50);
      setRequestLogs(updatedLogs);
      localStorage.setItem('gths_request_logs', JSON.stringify(updatedLogs));
  };

  const handleDeleteLog = (id: string) => {
      if (window.confirm('Delete this log entry?')) {
          const updatedLogs = requestLogs.filter(l => l.id !== id);
          setRequestLogs(updatedLogs);
          localStorage.setItem('gths_request_logs', JSON.stringify(updatedLogs));
      }
  };

  // TASK HANDLERS
  const handleAddTask = (text: string) => {
      const newTask: Task = {
          id: Date.now().toString(),
          text,
          completed: false,
          createdAt: new Date().toISOString()
      };
      const updated = [newTask, ...tasks];
      setTasks(updated);
      localStorage.setItem('gths_tasks', JSON.stringify(updated));
  };

  const handleToggleTask = (id: string) => {
      const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      setTasks(updated);
      localStorage.setItem('gths_tasks', JSON.stringify(updated));
  };

  const handleDeleteTask = (id: string) => {
      const updated = tasks.filter(t => t.id !== id);
      setTasks(updated);
      localStorage.setItem('gths_tasks', JSON.stringify(updated));
  };

  const pendingTaskCount = tasks.filter(t => !t.completed).length;

  // Helper to determine region of a recap
  const getRecapRegions = (recap: TripRecap): string[] => {
      const regions = new Set<string>();
      
      // Check lodging
      const lodgingObj = LODGING.find(l => l.name === recap.lodging || recap.lodging.includes(l.name));
      if (lodgingObj) regions.add(lodgingObj.region);

      // Check courses
      for (const courseName of recap.courses) {
          const courseObj = COURSES.find(c => c.name === courseName || courseName.includes(c.name));
          if (courseObj) regions.add(courseObj.region);
      }

      // If no match found via constant lookup, try string matching against Region enum values
      if (regions.size === 0) {
          const combinedText = (recap.lodging + ' ' + recap.courses.join(' ')).toLowerCase();
          Object.values(Region).forEach(r => {
              if (combinedText.includes(r.toLowerCase())) regions.add(r);
          });
      }

      return Array.from(regions);
  };

  // Helper to determine lodging type of a recap
  const getRecapLodgingType = (recap: TripRecap): string | undefined => {
      const lodgingObj = LODGING.find(l => l.name === recap.lodging || recap.lodging.includes(l.name));
      return lodgingObj?.type;
  };

  // Helper to get available options (regions/vibes/logistics/etc) for a specific trip type
  const getOptionsForType = (type: 'all' | 'golf' | 'charter') => {
      let activeRecaps = recaps;
      if (type === 'golf') {
          activeRecaps = recaps.filter(r => r.rounds > 0);
      } else if (type === 'charter') {
          activeRecaps = recaps.filter(r => r.rounds === 0);
      }

      const regions = new Set<string>();
      const vibes = new Set<string>();
      const logistics = new Set<string>();
      const lodgingTypes = new Set<string>();
      const months = new Set<string>();

      activeRecaps.forEach(r => {
          getRecapRegions(r).forEach(reg => regions.add(reg));
          vibes.add(r.vibe);
          if (r.logistics?.transportType) {
              logistics.add(r.logistics.transportType);
          }
          
          const lType = getRecapLodgingType(r);
          if (lType) lodgingTypes.add(lType);

          if (r.month) months.add(r.month);
      });

      return {
          regions: Array.from(regions),
          vibes: Array.from(vibes),
          logistics: Array.from(logistics),
          lodgingTypes: Array.from(lodgingTypes),
          months: Array.from(months)
      };
  };

  // Dynamic Filter Lists based on existing recaps AND current Trip Type selection
  const availableRegions = useMemo(() => {
      const { regions } = getOptionsForType(filters.tripType);
      return regions.sort();
  }, [recaps, filters.tripType]);

  const availableVibes = useMemo(() => {
      const { vibes } = getOptionsForType(filters.tripType);
      return vibes.sort();
  }, [recaps, filters.tripType]);

  const availableLogistics = useMemo(() => {
      const { logistics } = getOptionsForType(filters.tripType);
      return logistics.sort();
  }, [recaps, filters.tripType]);

  const availableLodgingTypes = useMemo(() => {
      const { lodgingTypes } = getOptionsForType(filters.tripType);
      return lodgingTypes.sort();
  }, [recaps, filters.tripType]);

  const availableMonths = useMemo(() => {
      const { months } = getOptionsForType(filters.tripType);
      return months;
  }, [recaps, filters.tripType]);

  const handleFilterChange = (newFilters: typeof filters) => {
    // When changing filters, reset the infinite scroll count
    setVisibleCount(ITEMS_PER_PAGE);
    
    // Check which options are valid for the NEW trip type
    if (newFilters.tripType !== filters.tripType) {
        const { 
            regions: allowedRegions, 
            vibes: allowedVibes, 
            logistics: allowedLogistics,
            lodgingTypes: allowedLodgingTypes,
            months: allowedMonths
        } = getOptionsForType(newFilters.tripType);
        
        // Keep only selected options that exist in the new type's allowed list
        const validRegions = newFilters.regions.filter(r => allowedRegions.includes(r));
        const validVibes = newFilters.vibes.filter(v => allowedVibes.includes(v));
        const validLogistics = newFilters.logistics.filter(l => allowedLogistics.includes(l));
        const validLodgingTypes = newFilters.lodgingTypes.filter(t => allowedLodgingTypes.includes(t));
        const validMonths = newFilters.months.filter(m => allowedMonths.includes(m));

        setFilters({
            ...newFilters,
            regions: validRegions,
            vibes: validVibes,
            logistics: validLogistics,
            lodgingTypes: validLodgingTypes,
            months: validMonths
        });
    } else {
        setFilters(newFilters);
    }
  };

  // Advanced Filtering Logic
  const filteredRecaps = useMemo(() => {
    return recaps.filter(r => {
        // 1. Text Search
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
            r.groupName.toLowerCase().includes(searchLower) ||
            r.vibe.toLowerCase().includes(searchLower) ||
            r.courses.some(c => c.toLowerCase().includes(searchLower)) ||
            r.lodging.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;

        // 2. Trip Type (Golf vs Charter)
        if (filters.tripType === 'golf' && r.rounds === 0) return false;
        if (filters.tripType === 'charter' && r.rounds > 0) return false;

        // 3. Price Range
        if (filters.minPrice !== '' && !isNaN(Number(filters.minPrice)) && r.pricePerPerson < filters.minPrice) return false;
        if (filters.maxPrice !== '' && !isNaN(Number(filters.maxPrice)) && r.pricePerPerson > filters.maxPrice) return false;

        // 4. Pax Range
        if (filters.minPax !== '' && !isNaN(Number(filters.minPax)) && r.groupSize < filters.minPax) return false;
        if (filters.maxPax !== '' && !isNaN(Number(filters.maxPax)) && r.groupSize > filters.maxPax) return false;

        // 5. Nights Range
        if (filters.minNights !== '' && !isNaN(Number(filters.minNights)) && r.nights < filters.minNights) return false;
        if (filters.maxNights !== '' && !isNaN(Number(filters.maxNights)) && r.nights > filters.maxNights) return false;

        // 6. Rounds Range
        if (filters.minRounds !== '' && !isNaN(Number(filters.minRounds)) && r.rounds < filters.minRounds) return false;
        if (filters.maxRounds !== '' && !isNaN(Number(filters.maxRounds)) && r.rounds > filters.maxRounds) return false;

        // 7. Vibe Filter
        if (filters.vibes.length > 0 && !filters.vibes.includes(r.vibe)) return false;

        // 8. Logistics Filter
        if (filters.logistics.length > 0) {
            if (!r.logistics?.transportType || !filters.logistics.includes(r.logistics.transportType)) return false;
        }

        // 9. Lodging Type Filter
        if (filters.lodgingTypes.length > 0) {
            const lType = getRecapLodgingType(r);
            if (!lType || !filters.lodgingTypes.includes(lType)) return false;
        }

        // 10. Month Filter
        if (filters.months.length > 0 && !filters.months.includes(r.month)) return false;

        // 11. Region Filter
        if (filters.regions.length > 0) {
            const tripRegions = getRecapRegions(r);
            const hasOverlap = filters.regions.some(filterReg => tripRegions.includes(filterReg));
            
            // Fallback for Manual Data text match
            let textMatch = false;
            if (!hasOverlap) {
                 const combinedText = (r.lodging + ' ' + r.courses.join(' ')).toLowerCase();
                 textMatch = filters.regions.some(reg => combinedText.includes(reg.toLowerCase()));
            }

            if (!hasOverlap && !textMatch) return false;
        }

        return true;
    });
  }, [recaps, filters]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
            // Load more if we haven't reached the end
            if (visibleCount < filteredRecaps.length) {
                setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
            }
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [visibleCount, filteredRecaps.length]);

  // Only render the visible subset of recaps
  const visibleRecaps = filteredRecaps.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-emerald-900 border-b border-emerald-800 sticky top-0 z-30 shadow-lg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-4 relative">
          
          {/* Left: Logo */}
          <div className="flex items-center justify-start min-w-0">
            <div className="flex-shrink-0 cursor-pointer group w-fit" onClick={() => setView('gallery')}>
                <div className="h-16 w-auto flex items-center justify-center transition-all transform group-hover:scale-105">
                    <img 
                        src="https://golfthehighsierra.com/wp-content/uploads/2025/07/gths_logo-removebg-preview.webp" 
                        alt="Golf the High Sierra" 
                        className="w-full h-full object-contain drop-shadow-sm"
                    />
                </div>
            </div>
          </div>

          {/* Center: Title (Grid Auto) */}
          <div className="hidden md:flex flex-col items-center justify-center min-w-0 mx-auto px-2">
            <h1 className="font-extrabold text-2xl tracking-tight leading-none text-white whitespace-nowrap truncate max-w-full">
                The Caddie <span className="text-emerald-400">Archive</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-bold truncate max-w-full">Golf the High Sierra</p>
          </div>
          
          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 min-w-0">
             {!isAdmin && (
                 <a href="https://golfthehighsierra.com/contact-custom-golf-package/" target="_blank" rel="noreferrer" className="text-sm font-medium text-emerald-100 hover:text-white transition-colors hidden xl:block whitespace-nowrap">
                    Get Custom Quote
                 </a>
             )}

             {!isAdmin && (
                 <button 
                    onClick={() => setShowTasksModal(true)}
                    className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 transition-all backdrop-blur-sm relative whitespace-nowrap"
                 >
                    <CheckSquare className="w-3.5 h-3.5" /> Tasks
                    {pendingTaskCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold border border-emerald-900 shadow-sm">
                            {pendingTaskCount}
                        </span>
                    )}
                 </button>
             )}
             
             <button 
                onClick={() => setShowPageShare(true)}
                className="hidden sm:flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 transition-all backdrop-blur-sm whitespace-nowrap"
             >
                <Share2 className="w-3.5 h-3.5" /> Share Page
             </button>

             {isAdmin ? (
                <div className="flex items-center gap-2 sm:gap-3">
                    <button 
                        onClick={() => setShowLogsModal(true)}
                        className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded-full transition-colors relative"
                        title="View Request Logs"
                    >
                        <ClipboardList className="w-5 h-5" />
                        {requestLogs.length > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-emerald-900"></span>
                        )}
                    </button>
                    <button 
                        onClick={() => setShowSettingsModal(true)}
                        className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded-full transition-colors"
                        title="Admin Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-400 px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap hidden sm:inline-block">Admin Active</span>
                    <button onClick={handleLogout} className="text-emerald-300 hover:text-white transition-colors" title="Logout">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
             ) : (
                <button 
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-2 text-xs font-bold text-emerald-200 hover:text-white transition-colors whitespace-nowrap"
                >
                    <Lock className="w-3.5 h-3.5" /> Login
                </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {view === 'gallery' && (
          <div className="space-y-8">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col xl:flex-row items-center justify-between gap-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-extrabold text-emerald-950 mb-4 tracking-tight">Past Trips Recaps</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            These are just some of the trips that we’ve booked for actual customers all over the world. Please be advised that rates vary depending on many factors, so please use this tool to find the trip that fits your budget and the destination you’d like to play in and then call us to for an updated quote.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full xl:w-auto">
                        {!isAdmin && (
                            <a 
                                href="tel:+18885861475"
                                className="flex-1 xl:flex-none bg-white border-2 border-blue-400 text-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500 px-8 py-6 rounded-xl text-xl sm:text-2xl font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center text-center whitespace-nowrap"
                            >
                            Toll Free: +1 (888) 586-1475
                            </a>
                        )}

                        {isAdmin && (
                            <button 
                                onClick={() => setView('form')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-emerald-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" />
                                Create Trip Recap
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Advanced Filtering */}
                <FilterBar 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    resultCount={filteredRecaps.length}
                    availableRegions={availableRegions}
                    availableVibes={availableVibes}
                    availableLogistics={availableLogistics}
                    availableLodgingTypes={availableLodgingTypes}
                    availableMonths={availableMonths}
                />

            </div>

            {filteredRecaps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 p-4 rounded-full mb-4">
                        <LayoutGrid className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">No trips found</h3>
                    <p className="text-slate-500 text-sm mt-1 mb-6">Try adjusting your filters to see more results.</p>
                    <button 
                        onClick={() => setFilters({
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
                        })}
                        className="px-6 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-sm transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min grid-flow-dense">
                        {visibleRecaps.map(recap => (
                            <TripCard 
                                key={recap.id} 
                                trip={recap} 
                                onClone={(trip) => setSelectedRecapForQuote(trip)} 
                                onWebExport={(trip) => setSelectedRecapForWeb(trip)}
                                onShare={(trip) => setSelectedRecapForShare(trip)}
                                onDelete={(id) => handleDeleteRecap(id)}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </div>

                    {/* Infinite Scroll Sentinel */}
                    <div ref={observerTarget} className="h-20 flex items-center justify-center w-full">
                        {visibleCount < filteredRecaps.length && (
                             <div className="flex flex-col items-center text-slate-400 gap-2">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="text-xs font-medium">Loading more trips...</span>
                             </div>
                        )}
                        {visibleCount >= filteredRecaps.length && filteredRecaps.length > 0 && (
                             <div className="text-xs text-slate-400 italic">You've reached the end of the list.</div>
                        )}
                    </div>
                </>
            )}
          </div>
        )}

        {view === 'form' && (
            <TripForm 
                onSave={handleSaveRecap} 
                onCancel={() => setView('gallery')} 
            />
        )}
      </main>

      {/* Modals */}
      {selectedRecapForQuote && (
          <QuoteGenerator 
            recap={selectedRecapForQuote} 
            onClose={() => setSelectedRecapForQuote(null)}
            recipients={adminEmails}
            smtpConfig={smtpConfig}
            onQuoteSent={handleQuoteSent}
          />
      )}

      {selectedRecapForWeb && isAdmin && (
          <WebExportModal 
            recap={selectedRecapForWeb} 
            onClose={() => setSelectedRecapForWeb(null)} 
          />
      )}
      
      {(selectedRecapForShare || showPageShare) && (
          <ShareModal 
            recap={selectedRecapForShare}
            onClose={() => { setSelectedRecapForShare(null); setShowPageShare(false); }}
          />
      )}
      
      {showTasksModal && (
          <TaskManagerModal 
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onClose={() => setShowTasksModal(false)}
          />
      )}

      {showLoginModal && (
          <AdminLoginModal
            onLogin={handleAdminLogin}
            onClose={() => setShowLoginModal(false)}
          />
      )}

      {showSettingsModal && isAdmin && (
          <AdminSettingsModal
            emails={adminEmails}
            smtpConfig={smtpConfig}
            onSaveEmails={handleSaveEmails}
            onSaveSmtp={handleSaveSmtp}
            onClose={() => setShowSettingsModal(false)}
          />
      )}

      {showLogsModal && isAdmin && (
          <AdminRequestLogModal
            logs={requestLogs}
            onDeleteLog={handleDeleteLog}
            onClose={() => setShowLogsModal(false)}
          />
      )}

      {recapToDelete && (
          <ConfirmationModal
            title="Delete Trip Recap"
            message="Are you sure you want to delete this trip recap? This action cannot be undone and the data will be permanently lost."
            onConfirm={confirmDeleteRecap}
            onCancel={() => setRecapToDelete(null)}
            confirmText="Delete Recap"
            isDestructive={true}
          />
      )}
    </div>
  );
};

export default App;
