import React from 'react';
import { motion } from 'motion/react';
import { User } from 'firebase/auth';
import { Settings, Lock, Bell, ChevronRight, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  onOpenSettings: (view: 'account' | 'privacy' | 'terms' | 'developer') => void;
}

export function UserProfile({ onOpenSettings }: UserProfileProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <img 
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=6366f1&color=fff`} 
            alt="Profile" 
            className="w-16 h-16 rounded-2xl border-2 border-white dark:border-slate-800 object-cover shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
            BETA
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user.displayName || 'Photographer'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
        </div>
      </div>

      {/* Storage Indicator */}
      <div className="mb-8 bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-100 dark:border-slate-700/50">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-gray-700 dark:text-slate-300">Storage</span>
          <span className="text-indigo-600 dark:text-indigo-400">1.2 GB / 5 GB</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full rounded-full" 
            style={{ width: '24%' }}
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2 mb-8">
        <button 
          onClick={() => onOpenSettings('account')}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-gray-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
              <Settings className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Edit Profile</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </button>

        <button 
          onClick={() => onOpenSettings('account')}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-gray-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Change Password</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </button>

        <button 
          onClick={() => onOpenSettings('privacy')}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-gray-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Privacy & Security</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </button>
      </div>

      {/* Logout */}
      <button 
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </button>
    </div>
  );
}
