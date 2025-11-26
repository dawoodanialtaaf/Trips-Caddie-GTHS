
import React from 'react';
import { TripRecap } from '../types';
import { X, Copy, Facebook, Linkedin, Twitter, Link, Share2 } from 'lucide-react';

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

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
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
            <p className="text-sm font-semibold text-slate-700 mb-3">Share via Social Media</p>
            <p className="text-xs text-slate-500 mb-3">
                These buttons open your browser's native sharing dialogs. You may need to log in to the respective platform.
            </p>
            <div className="flex gap-3 justify-center">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} ${social.hover} text-white p-3 rounded-lg transition-colors flex items-center justify-center w-full shadow-sm`}
                  title={`Share on ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
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
