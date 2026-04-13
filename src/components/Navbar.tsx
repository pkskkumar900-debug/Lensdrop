import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileMenu } from './ProfileMenu';

export function Navbar() {
  const { user, login } = useAuth();

  return (
    <nav className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            <Camera className="w-6 h-6" />
            <span className="font-semibold text-xl tracking-tight text-gray-900 dark:text-white">LensDrop</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="h-8 w-px bg-gray-200 dark:bg-slate-800 mx-2"></div>
                <ProfileMenu />
              </>
            ) : (
              <button
                onClick={login}
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm"
              >
                Photographer Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
