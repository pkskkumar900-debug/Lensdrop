import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Settings, 
  Shield, 
  Palette, 
  FileText, 
  HelpCircle,
  LogOut,
  Camera,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile Settings', path: '/settings/profile', icon: Settings },
    { name: 'Security', path: '/settings/security', icon: Shield },
    { name: 'Appearance', path: '/settings/appearance', icon: Palette },
    { name: 'Legal', path: '/settings/legal', icon: FileText },
    { name: 'Support', path: '/settings/support', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-gray-200 dark:border-slate-800 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Camera className="w-6 h-6" />
            <span className="font-semibold text-xl tracking-tight text-gray-900 dark:text-white">LensDrop</span>
          </Link>
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=6366f1&color=fff`} 
                alt="Profile" 
                className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user.displayName || 'Photographer'}
                </h2>
                <span className="bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  BETA
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <button 
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-500 dark:text-red-400" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
