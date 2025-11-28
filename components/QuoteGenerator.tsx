import React, { useState, useEffect } from 'react';
import { TripRecap, SmtpConfig, QuoteRequestLog, UserMetadata } from '../types';
import { fetchUserMetadata } from '../services/trackingService';
import { sendEmail } from '../services/emailService';
import { Mail, X, Info, Loader2, ShieldCheck } from 'lucide-react';

interface Props {
  recap: TripRecap;
  onClose: () => void;
  recipients: string[];
  smtpConfig: SmtpConfig | null;
  onQuoteSent: (log: QuoteRequestLog) => void;
}

const QuoteGenerator: React.FC<Props> = ({
  recap,
  onClose,
  recipients,
  smtpConfig,
  onQuoteSent
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [constraints, setConstraints] = useState('');
  const [metadata, setMetadata] = useState<UserMetadata | null>(null);
  const [sending, setSending] = useState(false);
  
  // Captcha State
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  useEffect(() => {
    fetchUserMetadata().then(m => setMetadata(m || null));
    // Generate simple math problem
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePhone = (phone: string) => {
      // Basic check: at least 10 digits
      const digits = phone.replace(/\D/g, '');
      return digits.length >= 10;
  };

  const handleSend = async () => {
    // 1. Basic Field Checks
    if (!customerName || !customerEmail || !customerPhone || !constraints) {
        alert("Please fill in all required fields marked with *");
        return;
    }

    // 2. Strict Format Checks
    if (!validateEmail(customerEmail)) {
        alert("Please enter a valid email address (e.g. name@domain.com)");
        return;
    }

    if (!validatePhone(customerPhone)) {
        alert("Please enter a valid phone number (at least 10 digits)");
        return;
    }

    // 3. Captcha Check
    if (parseInt(captchaAnswer) !== num1 + num2) {
        alert(`Incorrect Security Answer. What is ${num1} + ${num2}?`);
        return;
    }

    // Default recipients if none provided + Add Customer to CC
    const adminRecipients = recipients.length > 0 ? recipients : ['info@golfthehighsierra.com'];
    // Combine admins and customer so customer gets a copy
    const allRecipients = [...adminRecipients, customerEmail];
    // Remove duplicates
    const uniqueRecipients = Array.from(new Set(allRecipients));

    const log: QuoteRequestLog = {
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
      constraints,
      metadata: metadata || {
        ip: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        timezone: 'Unknown',
        userAgent: navigator.userAgent,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        landingPage: window.location.href
      }
    };

    const subject = `Trip Caddie Quote Request: ${recap.groupName} - ${customerName}`;
    
    // Construct Professional HTML Email Body
    const emailHtmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155; line-height: 1.5;">
        <h2 style="color: #064e3b; border-bottom: 2px solid #059669; padding-bottom: 10px; font-size: 20px;">⛳ Trip Caddie Quote Request</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 10px;">Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; width: 100px; color: #64748b; font-size: 14px;">Name:</td>
              <td style="padding: 4px 0; font-weight: 600; color: #0f172a;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; width: 100px; color: #64748b; font-size: 14px;">Email:</td>
              <td style="padding: 4px 0; font-weight: 600;"><a href="mailto:${customerEmail}" style="color: #059669; text-decoration: none;">${customerEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; width: 100px; color: #64748b; font-size: 14px;">Phone:</td>
              <td style="padding: 4px 0; font-weight: 600;"><a href="tel:${customerPhone}" style="color: #059669; text-decoration: none;">${customerPhone}</a></td>
            </tr>
            ${customerCompany ? `
            <tr>
              <td style="padding: 4px 0; width: 100px; color: #64748b; font-size: 14px;">Company:</td>
              <td style="padding: 4px 0; font-weight: 600;">${customerCompany}</td>
            </tr>` : ''}
          </table>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="background-color: #0f172a; color: #fff; font-size: 14px; padding: 8px 12px; border-radius: 6px 6px 0 0; margin-bottom: 0;">Trip Reference: ${recap.groupName}</h3>
          <div style="border: 1px solid #e2e8f0; border-top: none; padding: 15px; border-radius: 0 0 6px 6px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px; font-size: 14px;"><strong>📅 Date:</strong> ${recap.month} ${recap.year}</li>
              <li style="margin-bottom: 8px; font-size: 14px;"><strong>👥 Pax:</strong> ${recap.groupSize}</li>
              <li style="margin-bottom: 8px; font-size: 14px;"><strong>💰 Reference Price:</strong> $${recap.pricePerPerson}/pp</li>
              <li style="margin-bottom: 8px; font-size: 14px;"><strong>🏨 Lodging:</strong> ${recap.lodging}</li>
              <li style="margin-bottom: 8px; font-size: 14px;"><strong>🚌 Transport:</strong> ${recap.logistics?.transportType || 'N/A'}</li>
            </ul>
          </div>
        </div>

        <div style="background-color: #fff7ed; border: 1px solid #fed7aa; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <h3 style="margin-top: 0; color: #9a3412; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Specific Requests / Changes</h3>
          <p style="margin: 0; white-space: pre-wrap; color: #431407; font-size: 14px;">${constraints}</p>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #475569; font-size: 14px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Itinerary Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            ${recap.dailyItinerary.map((day, index) => `
              <tr style="border-bottom: 1px solid #f1f5f9; background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 10px; font-weight: bold; width: 60px; vertical-align: top; color: #059669;">Day ${day.day}</td>
                <td style="padding: 10px; vertical-align: top;">
                  <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">${day.activity}</div>
                  <div style="color: #64748b;">${day.time} @ ${day.location}</div>
                  ${day.notes ? `<div style="color: #94a3b8; font-style: italic; font-size: 12px; margin-top: 2px;">"${day.notes}"</div>` : ''}
                </td>
              </tr>
            `).join('')}
          </table>
        </div>

        <div style="font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          Sent via <strong>The Caddie Archive</strong><br/>
          Trip ID: ${recap.id} • IP: ${metadata?.ip || 'Unknown'} • ${new Date().toLocaleString()}
        </div>
      </div>
    `;

    setSending(true);

    try {
      // Send via PHP API
      const success = await sendEmail(uniqueRecipients.join(','), subject, emailHtmlBody);
      
      if (success) {
          onQuoteSent(log);
          alert("Quote request sent successfully! A copy has been sent to your email.");
          onClose();
      } else {
          alert("Failed to send email. Please check your internet connection or try again.");
      }
    } catch (e) {
        console.error("Failed to send email:", e);
        alert("An unexpected error occurred while sending.");
    } finally {
        setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <h3 className="font-bold text-slate-800">Custom Quote</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          
          <p className="text-sm text-slate-500">Send a structured request to the admin team.</p>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name <span className="text-rose-500">*</span></label>
            <input 
              value={customerName} 
              onChange={e => setCustomerName(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
              placeholder="John Doe"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email <span className="text-rose-500">*</span></label>
                <input 
                  type="email"
                  value={customerEmail} 
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="name@domain.com"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone <span className="text-rose-500">*</span></label>
                <input 
                  type="tel"
                  value={customerPhone} 
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="(555) 123-4567"
                />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-500 uppercase">Company (Optional)</label>
                <span className="text-[10px] text-slate-400 italic">Useful for corporate billing</span>
            </div>
            <input 
              value={customerCompany} 
              onChange={e => setCustomerCompany(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
              placeholder="Acme Corp"
            />
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                Specific Requests / Changes? <span className="text-rose-500">*</span> <Info className="w-3.5 h-3.5 text-slate-300" />
             </label>
             <textarea 
                value={constraints}
                onChange={e => setConstraints(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white h-24 resize-none"
                placeholder="E.g. We need to add an extra day for Lake Tahoe..."
             />
          </div>

          {/* Simple Math Captcha */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Security Check
              </label>
              <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold text-slate-700 bg-white px-3 py-2 rounded border border-slate-300">
                      {num1} + {num2} = ?
                  </span>
                  <input 
                      type="number" 
                      value={captchaAnswer}
                      onChange={e => setCaptchaAnswer(e.target.value)}
                      className="w-20 p-2 border border-slate-300 rounded text-center font-mono text-sm outline-none focus:border-emerald-500"
                      placeholder="Answer"
                  />
              </div>
          </div>

          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 disabled:opacity-70"
          >
            {sending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending Request...
                </>
            ) : (
                <>
                    <Mail className="w-5 h-5" /> Send Request
                </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};

export default QuoteGenerator;