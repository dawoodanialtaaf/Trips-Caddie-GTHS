
import React, { useState, useRef } from 'react';
import { Wand2, Save, Loader2, Edit, Trash2, Plus, Image, Upload, X } from 'lucide-react';
import { parseTripNotes } from '../services/geminiService';
import { TripRecap, ItineraryItem, LogisticsDetails } from '../types';

interface TripFormProps {
  onSave: (trip: TripRecap) => void;
  onCancel: () => void;
  initialData?: TripRecap;
}

const TripForm: React.FC<TripFormProps> = ({ onSave, onCancel, initialData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Form State initialized from initialData or defaults
  const [groupName, setGroupName] = useState(initialData?.groupName || '');
  const [groupSize, setGroupSize] = useState<number>(initialData?.groupSize || 4);
  const [month, setMonth] = useState(initialData?.month || 'June');
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [courses, setCourses] = useState<string>(initialData?.courses?.join(', ') || '');
  const [lodging, setLodging] = useState(initialData?.lodging || '');
  const [transportType, setTransportType] = useState(initialData?.logistics?.transportType || '');
  const [pricePerPerson, setPricePerPerson] = useState<number>(initialData?.pricePerPerson || 0);
  const [vibe, setVibe] = useState<TripRecap['vibe']>(initialData?.vibe || 'Value');
  const [synopsis, setSynopsis] = useState(initialData?.synopsis || '');
  const [whyItWorked, setWhyItWorked] = useState(initialData?.whyItWorked || '');
  const [highlights, setHighlights] = useState<string>(initialData?.highlights?.join('\n') || '');
  
  // Special Requests editable state
  const [specialRequests, setSpecialRequests] = useState<string>(initialData?.logistics?.specialRequests?.join('\n') || '');

  // Complex Objects (stored as state for submission, simplified viewing in MVP)
  const [dailyItinerary, setDailyItinerary] = useState<ItineraryItem[]>(initialData?.dailyItinerary || []);
  const [logistics, setLogistics] = useState<LogisticsDetails | null>(initialData?.logistics || null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialData;

  const handleMagicFill = async () => {
    if (!notes.trim()) return;
    setIsProcessing(true);
    try {
      const data = await parseTripNotes(notes);
      
      setGroupName(data.groupName || '');
      setGroupSize(data.groupSize || 4);
      setCourses(data.courses?.join(', ') || '');
      setLodging(data.lodging || '');
      setPricePerPerson(data.pricePerPersonEstimate || 0);
      setVibe((data.vibe as TripRecap['vibe']) || 'Value');
      setSynopsis(data.synopsis || '');
      setWhyItWorked(data.whyItWorked || '');
      setHighlights(data.highlights?.join('\n') || '');
      
      // Handle new detailed fields
      if (data.dailyItinerary) setDailyItinerary(data.dailyItinerary);
      if (data.logistics) {
          setLogistics(data.logistics);
          // specific fields extracted for editing
          setTransportType(data.logistics.transportType || '');
          setSpecialRequests(data.logistics.specialRequests?.join('\n') || '');
      }

    } catch (e) {
      alert("Failed to parse notes using Gemini. Please check API Key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateItineraryItem = (index: number, field: keyof ItineraryItem, value: string | number) => {
    const newItems = [...dailyItinerary];
    // @ts-ignore
    newItems[index] = { ...newItems[index], [field]: value };
    setDailyItinerary(newItems);
  };

  const addItineraryDay = () => {
    setDailyItinerary([...dailyItinerary, {
        day: dailyItinerary.length + 1,
        date: '',
        time: '',
        activity: '',
        location: '',
        notes: ''
    }]);
  };

  const removeItineraryDay = (index: number) => {
    const newItems = dailyItinerary.filter((_, i) => i !== index);
    setDailyItinerary(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip: TripRecap = {
      id: initialData?.id || Date.now().toString(), // Preserve ID if editing
      groupName,
      groupSize,
      month,
      year,
      imageUrl,
      courses: courses.split(',').map(s => s.trim()).filter(Boolean),
      lodging,
      nights: dailyItinerary.length || 3,
      rounds: courses.split(',').length,
      pricePerPerson,
      vibe,
      synopsis,
      whyItWorked,
      highlights: highlights.split('\n').filter(Boolean),
      dailyItinerary: dailyItinerary,
      logistics: {
          transportType: transportType || 'Unknown',
          passengerCount: groupSize, // Sync with the main pax input
          specialRequests: specialRequests.split('\n').filter(Boolean)
      }
    };
    onSave(newTrip);
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {isEditing ? <Edit className="w-5 h-5 text-emerald-600" /> : <Wand2 className="w-5 h-5 text-emerald-600" />}
                {isEditing ? "Edit Trip Recap" : "New Trip Recap"}
            </h2>
            <p className="text-sm text-slate-500">
                {isEditing ? "Update existing trip details." : "Add a past trip to the archive."}
            </p>
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-sm font-medium">Cancel</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Left Column: AI Input */}
        <div className="p-6 bg-emerald-50/50 border-r border-slate-100 flex flex-col h-full">
            <label className="block text-sm font-semibold text-emerald-900 mb-2">
                Step 1: Paste Manifest / Notes / Emails
            </label>
            <p className="text-xs text-emerald-700 mb-4">
                Paste the full manifest including bus schedules and special requests. Personal contact info will be ignored.
            </p>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste the manifest text here..."
                className="w-full flex-1 p-3 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs font-mono mb-4 resize-none bg-white text-slate-900"
            />
            <button
                onClick={handleMagicFill}
                disabled={isProcessing || !notes}
                className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${isProcessing ? 'bg-slate-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-md hover:shadow-lg'}`}
            >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                {isProcessing ? 'Analyzing Manifest...' : 'Auto-Fill Details'}
            </button>
        </div>

        {/* Right Column: Structured Form */}
        <div className="p-6 col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Row 1: Basic Info */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Group Name</label>
                        <input type="text" required value={groupName} onChange={e => setGroupName(e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900" />
                    </div>
                    <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Total Pax</label>
                         <input type="number" value={groupSize} onChange={e => setGroupSize(parseInt(e.target.value))} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900" />
                     </div>
                    <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price/Person ($)</label>
                         <input type="number" value={pricePerPerson} onChange={e => setPricePerPerson(parseFloat(e.target.value))} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900" />
                     </div>
                </div>

                {/* Row 2: Date & Vibe */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Month</label>
                         <select value={month} onChange={e => setMonth(e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900">
                             {months.map(m => <option key={m} value={m}>{m}</option>)}
                         </select>
                    </div>
                    <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Year</label>
                         <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900" />
                    </div>
                    <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Vibe</label>
                         <select value={vibe} onChange={e => setVibe(e.target.value as TripRecap['vibe'])} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900">
                            {['Budget', 'Value', 'Premium', 'Bucket List', 'Bachelor Party', 'Corporate'].map(v => <option key={v} value={v}>{v}</option>)}
                         </select>
                    </div>
                </div>

                {/* Row 3: Lodging & Transport */}
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Lodging</label>
                        <input type="text" value={lodging} onChange={e => setLodging(e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Transport Type</label>
                        <input type="text" value={transportType} onChange={e => setTransportType(e.target.value)} placeholder="e.g. 56 Pax Coach" className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900" />
                    </div>
                </div>

                {/* Row 4: Image URL & Courses */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 flex flex-col gap-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                            <Image className="w-3 h-3" /> Cover Image
                        </label>
                        
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={imageUrl} 
                                onChange={e => setImageUrl(e.target.value)} 
                                placeholder="https://..." 
                                className="flex-1 p-2 border border-slate-300 rounded outline-none bg-white text-slate-900 text-xs" 
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded border border-slate-300 transition-colors flex items-center justify-center"
                                title="Upload Image"
                            >
                                <Upload className="w-4 h-4" />
                            </button>
                            <input 
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        {imageUrl && (
                            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-200 group mt-1">
                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setImageUrl(''); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                                    className="absolute top-1 right-1 bg-black/60 hover:bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                    title="Remove Image"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Courses / Activities (Comma Separated)</label>
                        <input type="text" value={courses} onChange={e => setCourses(e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900" />
                    </div>
                </div>

                {/* AI Parsed Details Preview -> NOW EDITABLE */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Wand2 className="w-4 h-4 text-emerald-600" /> Itinerary Details
                        </h3>
                        <button 
                            type="button" 
                            onClick={addItineraryDay}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-white border border-emerald-200 px-2 py-1 rounded shadow-sm flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Add Day
                        </button>
                    </div>
                   
                    <div className="space-y-3">
                        {dailyItinerary.length > 0 ? (
                            dailyItinerary.map((d, i) => (
                                <div key={i} className="bg-white p-3 rounded border border-slate-200 relative group transition-all hover:shadow-sm">
                                    <button 
                                        type="button" 
                                        onClick={() => removeItineraryDay(i)}
                                        className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove Day"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    
                                    <div className="grid grid-cols-6 gap-2 mb-2">
                                        <div className="col-span-1">
                                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Day</label>
                                            <input 
                                                type="number" 
                                                value={d.day} 
                                                onChange={e => updateItineraryItem(i, 'day', parseInt(e.target.value) || 0)}
                                                className="w-full p-1 text-xs border border-slate-200 rounded outline-none focus:border-emerald-500 bg-white text-slate-900"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Date</label>
                                             <input 
                                                type="text" 
                                                value={d.date} 
                                                onChange={e => updateItineraryItem(i, 'date', e.target.value)}
                                                className="w-full p-1 text-xs border border-slate-200 rounded outline-none focus:border-emerald-500 bg-white text-slate-900"
                                                placeholder="MM/DD/YYYY"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Time</label>
                                             <input 
                                                type="text" 
                                                value={d.time} 
                                                onChange={e => updateItineraryItem(i, 'time', e.target.value)}
                                                className="w-full p-1 text-xs border border-slate-200 rounded outline-none focus:border-emerald-500 bg-white text-slate-900"
                                                placeholder="e.g. 10:00 AM"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                         <div>
                                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Activity</label>
                                             <input 
                                                type="text" 
                                                value={d.activity} 
                                                onChange={e => updateItineraryItem(i, 'activity', e.target.value)}
                                                className="w-full p-1 text-xs border border-slate-200 rounded outline-none focus:border-emerald-500 bg-white text-slate-900"
                                                placeholder="Golf / Travel"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Location</label>
                                             <input 
                                                type="text" 
                                                value={d.location} 
                                                onChange={e => updateItineraryItem(i, 'location', e.target.value)}
                                                className="w-full p-1 text-xs border border-slate-200 rounded outline-none focus:border-emerald-500 bg-white text-slate-900"
                                                placeholder="Course / City"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Notes</label>
                                        <input 
                                            type="text" 
                                            value={d.notes} 
                                            onChange={e => updateItineraryItem(i, 'notes', e.target.value)}
                                            className="w-full p-1 text-xs border border-slate-200 rounded outline-none focus:border-emerald-500 bg-white text-slate-900"
                                            placeholder="Details..."
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-slate-400 text-xs italic border-2 border-dashed border-slate-200 rounded">
                                No itinerary data. Auto-fill or add manually.
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Marketing Synopsis</label>
                        <textarea rows={3} value={synopsis} onChange={e => setSynopsis(e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none text-sm bg-white text-slate-900" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Pro Tip / Package Insight</label>
                        <textarea 
                            rows={3} 
                            value={whyItWorked} 
                            onChange={e => setWhyItWorked(e.target.value)} 
                            placeholder="Why this trip worked, specific advice, or highlights..."
                            className="w-full p-2 border border-slate-300 rounded outline-none text-sm bg-white text-slate-900" 
                        />
                    </div>
                </div>

                <div>
                     <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Special Requests / Notes (One per line)</label>
                     <textarea rows={3} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="Driver wait on site..." className="w-full p-2 border border-slate-300 rounded outline-none text-sm bg-white text-slate-900" />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2">
                        <Save className="w-4 h-4" /> {isEditing ? "Update Archive" : "Save to Archive"}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default TripForm;
