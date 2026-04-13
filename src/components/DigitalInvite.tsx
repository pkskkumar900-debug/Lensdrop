import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface DigitalInviteProps {
  title: string;
  invite: {
    date: string;
    time: string;
    location: string;
    message: string;
    theme: string;
  };
}

const THEMES: Record<string, { bg: string, text: string, accent: string, border: string }> = {
  classic: { bg: 'bg-white dark:bg-slate-900', text: 'text-gray-900 dark:text-white', accent: 'text-indigo-600 dark:text-indigo-400', border: 'border-gray-200 dark:border-slate-800' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-900 dark:text-rose-100', accent: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-900/50' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-900 dark:text-emerald-100', accent: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900/50' },
  midnight: { bg: 'bg-slate-900', text: 'text-white', accent: 'text-blue-400', border: 'border-slate-700' },
};

export function DigitalInvite({ title, invite }: DigitalInviteProps) {
  const activeTheme = THEMES[invite.theme] || THEMES.classic;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-2xl mx-auto rounded-3xl shadow-xl border p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden mb-12 ${activeTheme.bg} ${activeTheme.border}`}
    >
      {/* Decorative elements */}
      <div className={`absolute top-0 left-0 w-full h-3 ${activeTheme.accent} bg-current opacity-20`}></div>
      <div className={`absolute bottom-0 left-0 w-full h-3 ${activeTheme.accent} bg-current opacity-20`}></div>
      
      <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-6 ${activeTheme.text}`}>
        {title}
      </h2>
      
      <p className={`text-lg md:text-xl mb-10 leading-relaxed ${activeTheme.text} opacity-90 max-w-lg`}>
        {invite.message}
      </p>
      
      <div className="space-y-5 w-full max-w-md">
        {invite.date && (
          <div className={`flex items-center justify-center gap-4 ${activeTheme.text}`}>
            <Calendar className={`w-6 h-6 ${activeTheme.accent}`} />
            <span className="text-lg font-medium">{new Date(invite.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        )}
        
        {invite.time && (
          <div className={`flex items-center justify-center gap-4 ${activeTheme.text}`}>
            <Clock className={`w-6 h-6 ${activeTheme.accent}`} />
            <span className="text-lg font-medium">{invite.time}</span>
          </div>
        )}
        
        {invite.location && (
          <div className={`flex items-center justify-center gap-4 ${activeTheme.text}`}>
            <MapPin className={`w-6 h-6 shrink-0 ${activeTheme.accent}`} />
            <span className="text-lg font-medium">{invite.location}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
