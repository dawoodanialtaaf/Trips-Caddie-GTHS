import React from 'react';
import { TripRecap } from '../types';
import { X, Copy, Facebook, Linkedin, Twitter, Share2, FileText } from 'lucide-react';

interface ShareModalProps {
  recap: TripRecap | null; // Null means sharing the whole page
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ recap, onClose }) => {
  const getShareUrl = () => {
    // Correct Base URL for the application
    const baseUrl = 'https://golfthehighsierra.com/trips-caddie/';
    const params = new URLSearchParams();
    
    // UTM Parameters
    params.append('utm_source', 'caddie_archive_share');
    params.append('utm_medium', 'social');
    
    if (recap) {
        params.append('utm_campaign', `trip_${recap.id}`);
        params.append('trip_id', recap.id);
    } else {
        params.append('utm_campaign', 'general_archive');
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const shareUrl = getShareUrl();
  
  const shareTitle = recap 
    ? `Check out this ${recap.vibe} trip: ${recap.groupName}` 
    : 'Explore the Golf the High Sierra Trip Archive';

  const shareBody = recap
    ? `Here is a trip recap I wanted to share with you:\n\nTRIP: ${recap.groupName}\nVIBE: ${recap.vibe}\n\n"${recap.synopsis}"\n\nView full details here:\n${shareUrl}`
    : `Check out the Golf the High Sierra Trip Archive. It's a great tool for planning trips.\n\n${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const handlePrintPDF = () => {
    if (!recap) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>${recap.groupName} - Trip Recap</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 40px; }
            h1 { font-size: 24px; font-weight: 800; margin-bottom: 8px; color: #0f172a; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #ecfdf5; color: #047857; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 24px; border: 1px solid #d1fae5; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
            .metric { background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
            .metric-label { display: block; font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px; }
            .metric-value { display: block; font-size: 20px; font-weight: 800; color: #0f172a; }
            h2 { font-size: 18px; font-weight: 700; margin-top: 32px; margin-bottom: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; color: #0f172a; }
            h3 { font-size: 14px; font-weight: 700; margin-top: 24px; margin-bottom: 8px; color: #334155; }
            p { margin-bottom: 16px; font-size: 14px; color: #334155; }
            ul { padding-left: 20px; margin-bottom: 16px; }
            li { margin-bottom: 6px; font-size: 14px; color: #334155; }
            .synopsis { font-style: italic; border-left: 3px solid #10b981; padding-left: 16px; color: #475569; margin-bottom: 24px; }
            .itinerary-item { margin-bottom: 20px; padding-left: 16px; border-left: 3px solid #cbd5e1; }
            .itinerary-header { font-weight: 700; font-size: 14px; color: #0f172a; }
            .itinerary-meta { font-size: 12px; color: #64748b; margin-bottom: 4px; font-family: monospace; }
            .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
            @media print {
                body { padding: 20px; }
                button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${recap.groupName}</h1>
          <span class="badge">${recap.vibe} Vibe</span>
          
          <div class="grid">
            <div class="metric">
              <span class="metric-label">Group Size</span>
              <span class="metric-value">${recap.groupSize} Pax</span>
            </div>
            <div class="metric">
              <span class="metric-label">Duration</span>
              <span class="metric-value">${recap.nights} Nights</span>
            </div>
            <div class="metric">
              <span class="metric-label">Est. Price</span>
              <span class="metric-value">$${recap.pricePerPerson}/pp</span>
            </div>
          </div>

          <h2>Trip Overview</h2>
          <p class="synopsis">"${recap.synopsis}"</p>
          
          <p><strong>Lodging:</strong> ${recap.lodging}</p>
          <p><strong>Courses / Activities:</strong> ${recap.courses.join(', ')}</p>
          
          <h3>Why It Worked (Planner Insight)</h3>
          <p>${recap.whyItWorked}</p>

          ${recap.highlights && recap.highlights.length > 0 ? `
            <h3>Highlights</h3>
            <ul>
              ${recap.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          ` : ''}

          <h2>Itinerary</h2>
          ${recap.dailyItinerary.map(day => `
            <div class="itinerary-item">
              <div class="itinerary-header">Day ${day.day}: ${day.activity}</div>
              <div class="itinerary-meta">${day.time} @ ${day.location}</div>
              ${day.notes ? `<p style="margin:0; font-size:13px; color:#475569;">${day.notes}</p>` : ''}
            </div>
          `).join('')}

          ${recap.logistics ? `
            <h2>Logistics</h2>
            <p><strong>Transport:</strong> ${recap.logistics.transportType}</p>
            ${recap.logistics.specialRequests && recap.logistics.specialRequests.length > 0 ? `
              <h3>Special Requests</h3>
              <ul>${recap.logistics.specialRequests.map(r => `<li>${r}</li>`).join('')}</ul>
            ` : ''}
          ` : ''}

          <div class="footer">
            Generated by The Caddie Archive • Golf the High Sierra<br/>
            ${shareUrl}
          </div>

          <script>
            window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1877F2]',
      hover: 'hover:bg-[#166fe5]'
    },
    {
      name: 'Twitter (X)',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-black',
      hover: 'hover:bg-slate-800'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
      color: 'bg-[#0A66C2]',
      hover: 'hover:bg-[#0958a8]'
    }
  ];

  // Add PDF download if sharing a specific recap
  type SocialLink = typeof socialLinks[0] & { action?: () => void };
  const linksToRender: SocialLink[] = [...socialLinks];

  if (recap) {
      linksToRender.unshift({
          name: 'Download PDF',
          icon: FileText,
          url: '',
          action: handlePrintPDF,
          color: 'bg-rose-600',
          hover: 'hover:bg-rose-700'
      });
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-600" /> 
            {recap ? 'Share Trip Recap' : 'Share Archive Page'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">Share via...</p>
            <div className="flex gap-3 justify-center">
              {linksToRender.map((social) => (
                social.action ? (
                    <button
                        key={social.name}
                        onClick={social.action}
                        className={`${social.color} ${social.hover} text-white p-3 rounded-lg transition-colors flex items-center justify-center w-full shadow-sm`}
                        title={social.name}
                    >
                        <social.icon className="w-5 h-5" />
                    </button>
                ) : (
                    <a
                        key={social.name}
                        href={social.url}
                        target={social.name === 'Email' ? undefined : "_blank"}
                        rel={social.name === 'Email' ? undefined : "noopener noreferrer"}
                        className={`${social.color} ${social.hover} text-white p-3 rounded-lg transition-colors flex items-center justify-center w-full shadow-sm`}
                        title={`Share via ${social.name}`}
                    >
                        <social.icon className="w-5 h-5" />
                    </a>
                )
              ))}
            </div>
          </div>

          <div className="relative">
             <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Direct Link (with tracking)</label>
            <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 truncate font-mono select-all">
                    {shareUrl}
                </div>
                <button 
                    onClick={handleCopy}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-3 rounded-lg border border-emerald-100 transition-colors"
                    title="Copy Link"
                >
                    <Copy className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;