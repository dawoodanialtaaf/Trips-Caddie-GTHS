
import React, { useState } from 'react';
import { Lock, X, ChevronRight } from 'lucide-react';

interface AdminLoginModalProps {
  onLogin: () => void;
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side gatekeeping for the prototype
    if (password === 'gths2025') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" /> 
            Admin Access
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-slate-600 mb-4">
            Enter the admin password to add/delete trips and access web export tools.
          </p>
          
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              className={`w-full p-3 border rounded-lg outline-none transition-all bg-white text-slate-900 ${
                error 
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-200 bg-rose-50' 
                  : 'border-slate-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-500 mt-2 font-medium">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Login <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
