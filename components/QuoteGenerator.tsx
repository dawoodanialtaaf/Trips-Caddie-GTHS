import React, { useState, useEffect } from 'react';
import { TripRecap, SmtpConfig, QuoteRequestLog, UserMetadata } from '../types';
import { fetchUserMetadata } from '../services/trackingService';
import { sendEmail } from '../services/emailService';
import { Mail, X, ExternalLink, Info } from 'lucide-react';

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

  useEffect(() => {
    fetchUserMetadata().then(m => setMetadata(m || null));
  }, []);

  const handleSend = async (method: 'default' | 'gmail') => {
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

    onQuoteSent(log);

    const subject = `Trip Caddie Quote Request: ${recap.groupName} - ${customerName}`;
    const body = JSON.stringify(log, null, 2);

    setSending(true);

    try {
      await sendEmail(recipients.join(','), subject, `<pre>${body}</pre>`);
    } catch {}

    setSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Custom Quote</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-4">
          
          <input placeholder="Name" className="input"
            value={customerName} onChange={e => setCustomerName(e.target.value)} />
          
          <input placeholder="Email" className="input"
            value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
          
          <input placeholder="Phone" className="input"
            value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
          
          <input placeholder="Company" className="input"
            value={customerCompany} onChange={e => setCustomerCompany(e.target.value)} />

          <textarea placeholder="Special Requests"
            className="input h-20"
            value={constraints}
            onChange={e => setConstraints(e.target.value)} />

          <button
            onClick={() => handleSend('default')}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            <Mail /> {sending ? 'Sending...' : 'Send Request'}
          </button>

        </div>

      </div>
    </div>
  );
};

export default QuoteGenerator;