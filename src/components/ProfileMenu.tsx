import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  Moon, 
  Sun, 
  Shield, 
  FileText, 
  Code, 
  LogOut,
  ChevronDown,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SettingsModal, ModalView } from './SettingsModal';

export function ProfileMenu() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const openModal = (view: ModalView) => {
    setModalView(view);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          <img 
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=6366f1&color=fff`} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-600 object-cover"
            referrerPolicy="no-referrer"
          />
          <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden z-50"
            >
              <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.displayName || 'Photographer'}
                  {isAdmin && <span className="ml-2 text-xs bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 px-2 py-0.5 rounded-full">Admin</span>}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>

              <div className="p-2 space-y-1">
                {isAdmin && (
                  <Link 
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-500" />
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <span>Theme</span>
                  </div>
                  <span className="text-xs bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded-md">
                    {theme === 'dark' ? 'Dark' : 'Light'}
                  </span>
                </button>

                <button 
                  onClick={() => openModal('account')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </button>
              </div>

              <div className="p-2 border-t border-gray-100 dark:border-slate-800 space-y-1">
                <button 
                  onClick={() => openModal('privacy')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </button>
                <button 
                  onClick={() => openModal('terms')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Terms & Conditions
                </button>
                <button 
                  onClick={() => openModal('developer')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Code className="w-4 h-4" />
                  Developer & Support
                </button>
              </div>

              <div className="p-2 border-t border-gray-100 dark:border-slate-800">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SettingsModal view={modalView} onClose={() => setModalView(null)} />
    </>
  );
}
