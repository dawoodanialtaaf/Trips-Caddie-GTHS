
import React, { useState, useEffect } from 'react';
import { TripRecap, SmtpConfig, QuoteRequestLog, UserMetadata } from '../types';
import { fetchUserMetadata } from '../services/trackingService';
import { Mail, X, ExternalLink, Info, CheckCircle2, Copy, ArrowRight, Check, AlertCircle } from 'lucide-react';

interface QuoteGeneratorProps {
  recap: TripRecap;
  onClose: () => void;
  recipients: string[];
  smtpConfig: SmtpConfig | null;
  onQuoteSent: (log: QuoteRequestLog) => void;
}

const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ recap, onClose, recipients, onQuoteSent }) => {
  // Flow State: details -> method -> success
  const [viewState, setViewState] = useState<'details' | 'method' | 'success'>('details');
  
  // Customer Details State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [constraints, setConstraints] = useState('');
  
  // Metadata Tracking
  const [metadata, setMetadata] = useState<UserMetadata | null>(null);

  // Copy Feedback State
  const [copiedField, setCopiedField] = useState<'subject' | 'body' | null>(null);

  useEffect(() => {
    // Fetch tracking data silently when modal opens
    fetchUserMetadata().then(data => setMetadata(data));
  }, []);

  const getPlainTextBody = () => {
      const requestTime = new Date().toLocaleString();
      
      const metaText = metadata ? `\n\n--------------------------------\nDIGITAL FOOTPRINT:\nRequest Time: ${requestTime}\nLocation: ${metadata.city}, ${metadata.region}, ${metadata.country}\nTimezone: ${metadata.timezone}\nDevice: ${metadata.deviceType}\nSource Page: ${metadata.landingPage}` : '';
      
      // Construct detailed itinerary text
      const itineraryText = recap.dailyItinerary?.map(d => `Day ${d.day}: ${d.activity} (${d.time}) - ${d.location}\n   Note: ${d.notes || 'N/A'}`).join('\n');
      const highlightsText = recap.highlights?.join(', ');
      const specialReqsText = recap.logistics?.specialRequests?.join('\n- ');

      return `INTERNAL QUOTE REQUEST

CUSTOMER CONTACT:
Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
Company: ${customerCompany || 'N/A'}

TRIP SPECIFICATIONS:
Base Template: ${recap.groupName}
Pax: ${recap.groupSize}
Vehicle: ${recap.logistics?.transportType || 'Standard'}
Duration: ${recap.nights} Nights
Budget Ref: $${recap.pricePerPerson}/pp
Lodging: ${recap.lodging}

ITINERARY SNAPSHOT:
${itineraryText}

HIGHLIGHTS:
${highlightsText}

SPECIAL REQ (FROM TEMPLATE):
- ${specialReqsText || 'None'}

SPECIFIC REQUESTS / NOTES:
${constraints || 'None provided.'}${metaText}

Ref ID: ${recap.id} | Source: The Caddie Archive`;
  }

  const getSubject = () => {
      return `Trip Caddie Quote Request: ${recap.groupName} - ${customerName}`;
  };

  const handleSendAction = (type: 'default' | 'gmail') => {
    // 1. Log the Request in Admin Dashboard
    const logEntry: QuoteRequestLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            company: customerCompany
        },
        tripId: recap.id,
        tripName: recap.groupName,
        tripSnapshot: recap,
        constraints: constraints,
        metadata: metadata || {
            ip: 'Unknown', city: 'Unknown', region: 'Unknown', country: 'Unknown', timezone: 'Unknown', userAgent: navigator.userAgent, deviceType: 'Unknown', landingPage: window.location.href
        }
    };
    onQuoteSent(logEntry);

    const recipientsStr = recipients.join(',');
    const subject = getSubject();
    const body = getPlainTextBody();
    
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    // 2. Open Email Client with BODY included
    // Note: mailto links have a length limit (often 2000 chars). If it fails, the Success screen allows copying.
    if (type === 'default') {
        window.location.href = `mailto:${recipientsStr}?subject=${encodedSubject}&body=${encodedBody}`;
    } else {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientsStr}&su=${encodedSubject}&body=${encodedBody}`;
        window.open(gmailUrl, '_blank');
    }

    // 3. Move to Success View
    setViewState('success');
  };

  const handleCopy = (text: string, field: 'subject' | 'body') => {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
  };

  const isFormValid = customerName && customerEmail && customerPhone;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <h3 className="font-bold text-slate-800">Custom Quote</h3>
                    <p className="text-xs text-slate-500">Send a structured request to the admin team.</p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            <div className="p-6 overflow-y-auto">
                {/* VIEW 1: DETAILS FORM */}
                {viewState === 'details' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Customer Details Form */}
                        <div className="space-y-3">
                             <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Full Name <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Email <span className="text-rose-500">*</span></label>
                                        <input 
                                            type="email" 
                                            value={customerEmail}
                                            onChange={e => setCustomerEmail(e.target.value)}
                                            className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Phone <span className="text-rose-500">*</span></label>
                                        <input 
                                            type="tel" 
                                            value={customerPhone}
                                            onChange={e => setCustomerPhone(e.target.value)}
                                            className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-xs font-bold text-slate-500">Company (Optional)</label>
                                        <span className="text-[10px] text-slate-400 italic">Useful for corporate billing</span>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={customerCompany}
                                        onChange={e => setCustomerCompany(e.target.value)}
                                        className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400"
                                        placeholder="Acme Corp"
                                    />
                                </div>
                             </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1 mt-2">
                                <label className="block text-xs font-bold text-slate-500">Specific Requests / Changes?</label>
                                <div className="group relative">
                                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-emerald-500" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-800 text-white text-[11px] leading-tight rounded-lg shadow-xl hidden group-hover:block z-10">
                                        Tip: Mention preferred dates, alternate courses, dietary restrictions, or special occasions like birthdays.
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                    </div>
                                </div>
                            </div>
                            <textarea 
                                value={constraints}
                                onChange={(e) => setConstraints(e.target.value)}
                                className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none resize-none placeholder:text-slate-400"
                                placeholder="e.g. 'Same trip but for 50 people on June 10th...'"
                            />
                        </div>

                        <button 
                            onClick={() => setViewState('method')}
                            disabled={!isFormValid}
                            className={`w-full py-4 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-2 ${isFormValid ? 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200' : 'bg-slate-300 cursor-not-allowed'}`}
                        >
                            Next: Select Email App <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* VIEW 2: METHOD SELECTION */}
                {viewState === 'method' && (
                    <div className="space-y-6 py-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 items-start">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">Ready to Review & Send</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    We have generated a complete quote request. 
                                    Click below to open your preferred email app with the message <b>pre-filled</b>.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button 
                                onClick={() => handleSendAction('default')}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-[0.98] shadow-md"
                            >
                                <Mail className="w-5 h-5" />
                                Open Default Email App
                            </button>
                            
                            <button 
                                onClick={() => handleSendAction('gmail')}
                                className="w-full py-4 bg-white border-2 border-slate-100 hover:border-red-200 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Open Gmail (Web)
                            </button>
                        </div>

                        <button 
                            onClick={() => setViewState('details')}
                            className="w-full text-xs text-slate-400 hover:text-slate-600 underline text-center"
                        >
                            Back to Edit
                        </button>
                    </div>
                )}

                {/* VIEW 3: SUCCESS & FALLBACK */}
                {viewState === 'success' && (
                    <div className="space-y-6 py-2 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                             <Check className="w-8 h-8" />
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Email Draft Opened</h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                Please check your email client. Review the drafted message and hit send!
                            </p>
                        </div>

                        {/* Fallback Section */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left">
                            <div className="flex items-start gap-2 mb-3">
                                <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5" />
                                <p className="text-xs text-slate-600">
                                    <strong>Did nothing happen?</strong> Your browser might block automatic emails or the text was too long. You can copy the info manually below:
                                </p>
                            </div>

                            <div className="grid gap-3">
                                <button 
                                    onClick={() => handleCopy(getSubject(), 'subject')}
                                    className="w-full flex justify-between items-center bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 p-3 rounded-lg text-xs font-medium transition-all group"
                                >
                                    <span>1. Copy Subject Line</span>
                                    {copiedField === 'subject' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />}
                                </button>
                                <button 
                                    onClick={() => handleCopy(getPlainTextBody(), 'body')}
                                    className="w-full flex justify-between items-center bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 p-3 rounded-lg text-xs font-medium transition-all group"
                                >
                                    <span>2. Copy Email Body</span>
                                    {copiedField === 'body' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />}
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
                        >
                            Done / Close Window
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default QuoteGenerator;