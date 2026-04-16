import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { Save, Share2, Copy, CircleCheck, Calendar, MapPin, Clock, Edit3 } from 'lucide-react';
import { notify } from '../lib/toast';

interface InvitationGeneratorProps {
  eventId: string;
  eventTitle: string;
  initialData?: any;
}

const THEMES = [
  { id: 'classic', name: 'Classic Elegance', bg: 'bg-white dark:bg-slate-900', text: 'text-gray-900 dark:text-white', accent: 'text-indigo-600 dark:text-indigo-400', border: 'border-gray-200 dark:border-slate-800' },
  { id: 'rose', name: 'Rose Gold', bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-900 dark:text-rose-100', accent: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-900/50' },
  { id: 'emerald', name: 'Emerald Forest', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-900 dark:text-emerald-100', accent: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900/50' },
  { id: 'midnight', name: 'Midnight Blue', bg: 'bg-slate-900', text: 'text-white', accent: 'text-blue-400', border: 'border-slate-700' },
];

export function InvitationGenerator({ eventId, eventTitle, initialData }: InvitationGeneratorProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date || '',
    time: initialData?.time || '',
    location: initialData?.location || '',
    message: initialData?.message || `You are joyfully invited to celebrate the wedding of ${eventTitle}.`,
    theme: initialData?.theme || 'classic'
  });

  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeTheme = THEMES.find(t => t.id === formData.theme) || THEMES[0];
  const inviteUrl = `${window.location.origin}/event/${eventId}?invite=true`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'events', eventId), {
        invite: formData
      });
      notify.success('Invitation saved successfully!');
    } catch (error) {
      console.error("Error saving invite to Firebase:", error);
      
      // Fallback to localStorage
      const savedEvents = localStorage.getItem('lensdrop_events');
      if (savedEvents) {
        try {
          const parsedEvents = JSON.parse(savedEvents);
          const eventIndex = parsedEvents.findIndex((e: any) => e.id === eventId);
          if (eventIndex !== -1) {
            parsedEvents[eventIndex].invite = formData;
            localStorage.setItem('lensdrop_events', JSON.stringify(parsedEvents));
            notify.success('Invitation saved locally!');
          } else {
            notify.error('Failed to save invitation.');
          }
        } catch (e) {
          console.error('Failed to update local storage', e);
          notify.error('Failed to save invitation.');
        }
      } else {
        notify.error('Failed to save invitation.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `You're invited to ${eventTitle}!`,
          text: formData.message,
          url: inviteUrl,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Editor */}
      <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-indigo-500" /> Customize Invitation
        </h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setFormData({ ...formData, theme: theme.id })}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    formData.theme === theme.id 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20' 
                      : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Location / Venue</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. The Grand Plaza Hotel"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Personal Message</label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
            >
              <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Invitation'}
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 bg-transparent text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-4 py-3 rounded-xl font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" /> Share
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 bg-transparent text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-4 py-3 rounded-xl font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors flex items-center justify-center gap-2"
                title="Copy Link"
              >
                {copied ? <CircleCheck className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />} Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900/30 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 overflow-hidden">
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Live Preview</p>
        
        <motion.div 
          key={formData.theme}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full max-w-sm aspect-[3/4] rounded-2xl shadow-2xl border p-8 flex flex-col items-center justify-center text-center relative overflow-hidden ${activeTheme.bg} ${activeTheme.border}`}
        >
          {/* Decorative elements */}
          <div className={`absolute top-0 left-0 w-full h-2 ${activeTheme.accent} bg-current opacity-20`}></div>
          <div className={`absolute bottom-0 left-0 w-full h-2 ${activeTheme.accent} bg-current opacity-20`}></div>
          
          <h2 className={`text-3xl font-serif font-bold mb-6 ${activeTheme.text}`}>
            {eventTitle}
          </h2>
          
          <p className={`text-sm mb-8 leading-relaxed ${activeTheme.text} opacity-90`}>
            {formData.message}
          </p>
          
          <div className="space-y-4 w-full">
            {formData.date && (
              <div className={`flex items-center justify-center gap-3 ${activeTheme.text}`}>
                <Calendar className={`w-5 h-5 ${activeTheme.accent}`} />
                <span className="font-medium">{new Date(formData.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            
            {formData.time && (
              <div className={`flex items-center justify-center gap-3 ${activeTheme.text}`}>
                <Clock className={`w-5 h-5 ${activeTheme.accent}`} />
                <span className="font-medium">{formData.time}</span>
              </div>
            )}
            
            {formData.location && (
              <div className={`flex items-center justify-center gap-3 ${activeTheme.text}`}>
                <MapPin className={`w-5 h-5 shrink-0 ${activeTheme.accent}`} />
                <span className="font-medium">{formData.location}</span>
              </div>
            )}
          </div>
          
          <div className="mt-10">
            <div className={`inline-block px-6 py-2 rounded-full border border-current text-sm font-medium ${activeTheme.accent}`}>
              View Gallery
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
