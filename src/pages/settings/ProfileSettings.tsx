import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Camera, Save } from 'lucide-react';
import { notify } from '../../lib/toast';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export function ProfileSettings() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedProfile = localStorage.getItem('lensdrop_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.displayName) setDisplayName(parsed.displayName);
        if (parsed.avatarBase64) {
          setAvatarPreview(parsed.avatarBase64);
          setBase64Image(parsed.avatarBase64);
        }
      } catch (e) {
        console.error('Failed to parse saved profile');
      }
    } else if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        notify.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBase64Image(base64String);
        setAvatarPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Save to localStorage
      const profileData = {
        displayName,
        avatarBase64: base64Image
      };
      localStorage.setItem('lensdrop_user_profile', JSON.stringify(profileData));

      // Also attempt to save to Firebase if possible, but don't block on it for the avatar
      await updateProfile(user, { displayName });
      await updateDoc(doc(db, 'users', user.uid), { displayName });
      
      notify.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      notify.error('Failed to update profile in database, but saved locally.');
    } finally {
      setSaving(false);
    }
  };

  if (!isMounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
      <p className="text-gray-600 dark:text-slate-400 mb-8">Manage your public profile and avatar.</p>

      <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
          <div className="relative group">
            <img 
              src={avatarPreview || user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=6366f1&color=fff`} 
              alt="Profile" 
              className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 object-cover shadow-lg transition-opacity group-hover:opacity-80"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-lg border-2 border-white dark:border-slate-800"
              title="Change Avatar"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Full Name
            </label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-slate-800">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
