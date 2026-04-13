import React, { useState } from 'react';
import { X, Shield, FileText, Code, Lock, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { updatePassword } from 'firebase/auth';

export type ModalView = 'account' | 'privacy' | 'terms' | 'developer' | null;

interface SettingsModalProps {
  view: ModalView;
  onClose: () => void;
}

export function SettingsModal({ view, onClose }: SettingsModalProps) {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!view) return null;

  const isPasswordProvider = user?.providerData.some(p => p.providerId === 'password');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await updatePassword(user, newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password. You may need to re-authenticate.' });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'account':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 rounded-lg cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Your email address cannot be changed.</p>
              </div>

              {isPasswordProvider ? (
                <form onSubmit={handleUpdatePassword} className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
                  
                  {message && (
                    <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                      {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {message.text}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !newPassword || !confirmPassword}
                    className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg text-sm flex items-start gap-3">
                    <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>You are logged in using a third-party provider (e.g., Google). Password management is handled by your provider.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-slate-300 space-y-4 text-sm leading-relaxed">
              <p>We value your privacy and are committed to protecting your personal data. This platform collects only the necessary information required to provide services such as authentication, image uploads, and event access.</p>
              <p>We do not sell, rent, or share your personal data with third parties without your consent, except where required by law.</p>
              <p>Uploaded images are stored securely using trusted cloud storage providers and are accessible only through unique, private links or QR-based access.</p>
              <p>We implement industry-standard security practices to protect your data from unauthorized access, misuse, or disclosure.</p>
              <p>By using this platform, you agree to the collection and use of information in accordance with this policy.</p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Terms & Conditions</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-slate-300 space-y-4 text-sm leading-relaxed">
              <p>By accessing and using this platform, you agree to comply with all applicable laws and regulations.</p>
              <p>Users are responsible for the content they upload, including images and event data. Any misuse, illegal content, or violation of rights may result in account suspension.</p>
              <p>This platform is provided "as is" without warranties of any kind. We are not responsible for any data loss, service interruptions, or misuse of shared links.</p>
              <p>QR codes and event links should be shared responsibly. We are not liable for unauthorized access caused by public sharing.</p>
              <p>We reserve the right to update or modify these terms at any time without prior notice.</p>
            </div>
          </div>
        );

      case 'developer':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Code className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Developer & Support</h2>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">This platform is developed and maintained by:</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  PR
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Prince Raj</h3>
                  <a href="mailto:developer@imprince.me" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-1">
                    <Mail className="w-4 h-4" /> developer@imprince.me
                  </a>
                </div>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600 dark:text-slate-300">
                <p>If you face any issues, bugs, or need support, feel free to contact the developer via email.</p>
                <p>We are continuously improving the system to provide a better and more secure experience.</p>
              </div>
              
              <a 
                href="mailto:developer@imprince.me?subject=LensDrop%20Support%20Request"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden z-10"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
