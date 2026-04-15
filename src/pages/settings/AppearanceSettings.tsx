import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Appearance</h1>
      <p className="text-gray-600 dark:text-slate-400 mb-8">Customize how LensDrop looks on your device.</p>

      <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Theme Preference</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              theme === 'light' 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-600 dark:text-slate-400'
            }`}
          >
            <Sun className="w-8 h-8" />
            <span className="font-medium">Light</span>
          </button>
          
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              theme === 'dark' 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-600 dark:text-slate-400'
            }`}
          >
            <Moon className="w-8 h-8" />
            <span className="font-medium">Dark</span>
          </button>
          
          <button
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              theme === 'system' 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-600 dark:text-slate-400'
            }`}
          >
            <Monitor className="w-8 h-8" />
            <span className="font-medium">System</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
