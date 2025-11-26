
import React, { useState } from 'react';
import { Wand2, Save, Loader2 } from 'lucide-react';
import { parseTripNotes } from '../services/geminiService';
import { TripRecap, ItineraryItem, LogisticsDetails } from '../types';

interface TripFormProps {
  onSave: (trip: TripRecap) => void;
  onCancel: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSave, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Form State
  const [groupName, setGroupName] = useState('');
  const [groupSize, setGroupSize] = useState<number>(4);
  const [month, setMonth] = useState('June');
  const [year, setYear] = useState(2024);
  const [courses, setCourses] = useState<string>('');
  const [lodging, setLodging] = useState('');
  const [pricePerPerson, setPricePerPerson] = useState<number>(0);
  const [vibe, setVibe] = useState('Value');
  const [synopsis, setSynopsis] = useState('');
  const [whyItWorked, setWhyItWorked] = useState('');
  const [highlights, setHighlights] = useState<string>('');
  
  // Complex Objects (stored as state for submission, simplified viewing in MVP)
  const [dailyItinerary, setDailyItinerary] = useState<ItineraryItem[]>([]);
  const [logistics, setLogistics] = useState<LogisticsDetails | null>(null);

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
      setVibe(data.vibe || 'Value');
      setSynopsis(data.synopsis || '');
      setWhyItWorked(data.whyItWorked || '');
      setHighlights(data.highlights?.join('\n') || '');
      
      // Handle new detailed fields
      if (data.dailyItinerary) setDailyItinerary(data.dailyItinerary);
      if (data.logistics) setLogistics(data.logistics);

    } catch (e) {
      alert("Failed to parse notes using Gemini. Please check API Key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip: TripRecap = {
      id: Date.now().toString(),
      groupName,
      groupSize,
      month,
      year,
      courses: courses.split(',').map(s => s.trim()).filter(Boolean),
      lodging,
      nights: dailyItinerary.length || 3,
      rounds: courses.split(',').length,
      pricePerPerson,
      vibe: vibe as any,
      synopsis,
      whyItWorked,
      highlights: highlights.split('\n').filter(Boolean),
      dailyItinerary: dailyItinerary,
      logistics: logistics || {
          transportType: 'Unknown',
          passengerCount: groupSize,
          specialRequests: []
      }
    };
    onSave(newTrip);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-slate-800">New Trip Recap</h2>
            <p className="text-sm text-slate-500">Add a past trip to the archive.</p>
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-sm font-medium">Cancel</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Left Column: AI Input */}
        <div className="p-6 bg-emerald-50/50 border-r border-slate-100 flex flex-col h-full">
            <label className="block text-sm font-semibold text-emerald-900 mb-2">
                Step 1: Paste Manifest / Notes
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
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Group Name</label>
                        <input type="text" required value={groupName} onChange={e => setGroupName(e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900" />
                    </div>
                    <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Total Pax</label>
                         <input type="number" value={groupSize} onChange={e => setGroupSize(parseInt(e.target.value))} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900" />
                     </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Lodging</label>
                        <input type="text" value={lodging} onChange={e => setLodging(e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price Per Person ($)</label>
                        <input type="number" value={pricePerPerson} onChange={e => setPricePerPerson(parseInt(e.target.value))} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900" />
                    </div>
                    <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Vibe</label>
                         <select value={vibe} onChange={e => setVibe(e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none bg-white text-slate-900">
                            {['Budget', 'Value', 'Premium', 'Bucket List', 'Bachelor Party', 'Corporate'].map(v => <option key={v} value={v}>{v}</option>)}
                         </select>
                    </div>
                </div>

                {/* AI Parsed Details Preview */}
                {logistics && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                             <Wand2 className="w-4 h-4 text-emerald-600" /> Parsed Logistics (Read Only)
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                            <div>
                                <span className="font-bold">Transport:</span> {logistics.transportType}
                            </div>
                            <div className="col-span-2">
                                <span className="font-bold">Itinerary:</span> {dailyItinerary.length} days found
                                <ul className="list-disc list-inside mt-1 pl-2 space-y-1 text-slate-500">
                                    {dailyItinerary.map((d, i) => (
                                        <li key={i}>Day {d.day}: {d.time} @ {d.activity}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Marketing Synopsis</label>
                    <textarea rows={2} value={synopsis} onChange={e => setSynopsis(e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none text-sm bg-white text-slate-900" />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Planner Note</label>
                    <textarea rows={2} value={whyItWorked} onChange={e => setWhyItWorked(e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none text-sm bg-white text-slate-900" />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save to Archive
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default TripForm;
