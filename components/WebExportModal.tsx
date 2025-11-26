import React, { useState, useEffect } from 'react';
import { TripRecap } from '../types';
import { generateWebContent } from '../services/geminiService';
import { Loader2, Copy, X, Code, Eye } from 'lucide-react';

interface WebExportModalProps {
  recap: TripRecap;
  onClose: () => void;
}

const WebExportModal: React.FC<WebExportModalProps> = ({ recap, onClose }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  useEffect(() => {
    const generate = async () => {
        try {
            const content = await generateWebContent(recap);
            setHtmlContent(content || "<p>Error generating content.</p>");
        } catch (e) {
            setHtmlContent("<p>Failed to generate content.</p>");
        } finally {
            setIsLoading(false);
        }
    };
    generate();
  }, [recap]);

  // Safety function to render potentially mixed markdown/HTML as clean HTML
  const getPreviewHtml = (content: string) => {
      // Replace double asterisks with strong tags if model failed to use HTML
      let clean = content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/## (.*?)\n/g, '<h2>$1</h2>')
          .replace(/### (.*?)\n/g, '<h3>$1</h3>');
      return clean;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col h-[80vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <div>
                    <h3 className="font-bold text-slate-800">Export for Web</h3>
                    <p className="text-xs text-slate-500">Generate AEO-optimized HTML for golfthehighsierra.com</p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                    <p className="text-sm text-slate-500">Writing blog post...</p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex border-b border-slate-200 px-4">
                        <button 
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'preview' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <Eye className="w-4 h-4" /> Preview
                        </button>
                        <button 
                            onClick={() => setActiveTab('code')}
                            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'code' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <Code className="w-4 h-4" /> HTML Code
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                        {activeTab === 'preview' ? (
                            <div 
                                className="prose prose-sm max-w-none bg-white p-8 rounded-lg shadow-sm border border-slate-200"
                                dangerouslySetInnerHTML={{ __html: getPreviewHtml(htmlContent) }} 
                            />
                        ) : (
                            <div className="relative">
                                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                                    {htmlContent}
                                </pre>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(htmlContent)}
                                    className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                                    title="Copy HTML"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl flex justify-end">
                <button 
                    onClick={() => navigator.clipboard.writeText(htmlContent)}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm"
                >
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                </button>
            </div>
        </div>
    </div>
  );
};

export default WebExportModal;