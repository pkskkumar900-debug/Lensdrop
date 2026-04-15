import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Key, Mail } from 'lucide-react';
import { notify } from '../../lib/toast';

export function SecuritySettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isGoogleAuth = user?.providerData.some(provider => provider.providerId === 'google.com');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      notify.error('Passwords do not match');
      return;
    }
    // Password change logic would go here
    notify.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Security Settings</h1>
      <p className="text-gray-600 dark:text-slate-400 mb-8">Manage your account security and authentication methods.</p>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Authentication Method
          </h2>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
            {isGoogleAuth ? (
              <>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Google Account</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Connected to {user?.email}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email & Password</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Signed in as {user?.email}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {!isGoogleAuth && (
          <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" />
              Change Password
            </h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Current Password
                </label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
}
