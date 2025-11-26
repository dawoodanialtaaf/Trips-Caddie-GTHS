
import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Mail, Settings, Server, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { SmtpConfig } from '../types';

interface AdminSettingsModalProps {
  emails: string[];
  smtpConfig: SmtpConfig | null;
  onSaveEmails: (emails: string[]) => void;
  onSaveSmtp: (config: SmtpConfig) => void;
  onClose: () => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ emails, smtpConfig, onSaveEmails, onSaveSmtp, onClose }) => {
  const [activeTab, setActiveTab] = useState<'recipients' | 'smtp'>('recipients');
  
  // Recipients State
  const [emailList, setEmailList] = useState<string[]>(emails);
  const [newEmail, setNewEmail] = useState('');

  // SMTP State
  const [config, setConfig] = useState<SmtpConfig>(smtpConfig || {
    email: 'tripscaddie@golfthehighsierra.com',
    password: '',
    outgoingServer: 'mail.golfthehighsierra.com',
    smtpPort: '465',
    incomingServer: 'mail.golfthehighsierra.com',
    imapPort: '993'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleAddEmail = () => {
    if (newEmail && newEmail.includes('@') && !emailList.includes(newEmail)) {
      setEmailList([...emailList, newEmail]);
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailList(emailList.filter(e => e !== emailToRemove));
  };

  const handleSaveAll = () => {
    onSaveEmails(emailList);
    onSaveSmtp(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-600" /> 
            Admin Settings
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-4">
          <button 
            onClick={() => setActiveTab('recipients')}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'recipients' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Mail className="w-4 h-4" /> Quote Recipients
          </button>
          <button 
            onClick={() => setActiveTab('smtp')}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'smtp' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Server className="w-4 h-4" /> Email Server (SMTP)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* RECIPIENTS TAB */}
          {activeTab === 'recipients' && (
            <div className="space-y-4">
              <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Internal Team List</h4>
                  <p className="text-xs text-slate-500">
                    These email addresses will receive the "Internal Quote Requests".
                  </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-1 mb-4 max-h-48 overflow-y-auto">
                {emailList.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 italic">No emails configured.</div>
                )}
                <ul className="divide-y divide-slate-100">
                  {emailList.map((email) => (
                    <li key={email} className="flex justify-between items-center p-2 hover:bg-white rounded transition-colors group">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm text-slate-700">{email}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveEmail(email)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        title="Remove Email"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
                />
                <button 
                  onClick={handleAddEmail}
                  disabled={!newEmail.includes('@')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SMTP TAB */}
          {activeTab === 'smtp' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                  <div className="bg-blue-100 p-2 rounded-full h-fit text-blue-600">
                      <Server className="w-4 h-4" />
                  </div>
                  <div>
                      <h4 className="text-sm font-bold text-blue-900">Outgoing Mail Configuration</h4>
                      <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                          Configure the SMTP settings to enable direct email sending from the app. 
                          These credentials will be used to authenticate with your mail server.
                      </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Left Col: Credentials */}
                   <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Account Name (Email)</label>
                            <input 
                                type="email" 
                                value={config.email}
                                onChange={e => setConfig({...config, email: e.target.value})}
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={config.password}
                                    onChange={e => setConfig({...config, password: e.target.value})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none pr-10 bg-white text-slate-900"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                   </div>

                   {/* Right Col: Server Info (Read only info mostly based on screenshot) */}
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                        <h5 className="text-xs font-bold text-slate-700 border-b border-slate-200 pb-2">Server Details</h5>
                        
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Outgoing Server</label>
                            <div className="grid grid-cols-3 gap-2">
                                <input 
                                    type="text" 
                                    value={config.outgoingServer}
                                    onChange={e => setConfig({...config, outgoingServer: e.target.value})}
                                    className="col-span-2 w-full p-2 border border-slate-200 rounded text-xs text-slate-700 font-mono bg-white"
                                />
                                <input 
                                    type="text" 
                                    value={config.smtpPort}
                                    onChange={e => setConfig({...config, smtpPort: e.target.value})}
                                    className="col-span-1 w-full p-2 border border-slate-200 rounded text-xs text-slate-700 font-mono text-center bg-white"
                                    placeholder="Port"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Incoming Server (IMAP)</label>
                            <div className="text-xs font-mono text-slate-600">
                                {config.incomingServer} <span className="text-slate-300">|</span> Port: {config.imapPort}
                            </div>
                        </div>
                   </div>
               </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
              Cancel
          </button>
          <button 
              onClick={handleSaveAll}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm shadow-emerald-200"
          >
              <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
