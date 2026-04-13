import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { EventAdmin } from './pages/EventAdmin';
import { EventGallery } from './pages/EventGallery';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30 selection:text-indigo-800 dark:selection:text-indigo-200 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '11s' }} />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/upload/:id" element={<EventAdmin />} />
              <Route path="/event/:id" element={<EventGallery />} />
            </Routes>
          </main>
          
          <footer className="w-full py-6 text-center text-sm text-gray-500 dark:text-slate-400 border-t border-gray-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm mt-auto">
            <p>Copyright &copy; {new Date().getFullYear()} LensDrop. Developed by Prince.</p>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
