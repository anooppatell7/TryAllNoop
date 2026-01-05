
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Code, Database, Terminal, Menu, X, Clock, FileJson, FileText, GitCommit, DatabaseZap, Image, Github, Twitter, Sun, Moon, BookOpen, AlertTriangle } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  // Check for API Key presence
  useEffect(() => {
    const key = typeof process !== 'undefined' ? process.env.API_KEY : (window as any).VITE_API_KEY;
    if (!key) {
      setIsApiKeyMissing(true);
    }
  }, []);

  // Initialize theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('allnoop-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('allnoop-theme', 'light');
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <Activity size={20} /> },
    { label: 'Documentation', path: '/docs', icon: <BookOpen size={20} /> },
    { label: 'Mock Data', path: '/mock-data', icon: <Database size={20} /> },
    { label: 'Regex Builder', path: '/regex', icon: <Terminal size={20} /> },
    { label: 'Code Simplifier', path: '/simplify', icon: <Code size={20} /> },
    { label: 'Commit Message', path: '/commit-msg', icon: <GitCommit size={20} /> },
    { label: 'SQL to NoSQL', path: '/sql-nosql', icon: <DatabaseZap size={20} /> },
    { label: 'OG Image Gen', path: '/og-image', icon: <Image size={20} /> },
    { label: 'GitHub Pusher', path: '/github-push', icon: <Github size={20} /> },
    { label: 'Cron Traveler', path: '/cron', icon: <Clock size={20} /> },
    { label: 'JSON Type-Caster', path: '/json-types', icon: <FileJson size={20} /> },
    { label: 'Readme Architect', path: '/readme', icon: <FileText size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className="min-h-screen flex bg-dark-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-noop-500 selection:text-white transition-colors duration-300">
      {/* API Warning Banner */}
      {isApiKeyMissing && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-lg animate-pulse">
          <AlertTriangle size={14} />
          <span>Configuration Required: Please set your API_KEY in Vercel environment variables to enable AI features.</span>
          <Link to="/docs#introduction" className="underline hover:opacity-80">Learn how</Link>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-dark-800 border-r border-dark-700 fixed h-full z-20 transition-all ${isApiKeyMissing ? 'pt-10' : ''}`}>
        <header className="p-6 flex items-center gap-3 border-b border-dark-700">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-noop-500/20 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-gradient-to-br from-noop-400 to-noop-600">
              <img 
                src="https://raw.githubusercontent.com/ai-studio-images/logos/main/allnoop_bolt.png" 
                alt="AllNoop Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AllNoop</span>
          </Link>
        </header>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-noop-500/10 text-noop-500 dark:text-noop-400 border border-noop-500/20 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-dark-700 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <span className={isActive(item.path) ? 'text-noop-500 dark:text-noop-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 space-y-4">
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-600 text-slate-600 dark:text-slate-400 hover:text-noop-500 transition-all group"
           >
             <span className="text-sm font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
             {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
           </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className={`md:hidden fixed w-full bg-dark-800 border-b border-dark-700 z-30 px-4 py-3 flex items-center justify-between transition-colors ${isApiKeyMissing ? 'mt-8' : ''}`}>
         <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-noop-400 to-noop-600">
                <img src="https://raw.githubusercontent.com/ai-studio-images/logos/main/allnoop_bolt.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">AllNoop</span>
            </Link>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-500 dark:text-slate-300">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
      </header>

      {/* Main Content */}
      <main className={`flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto min-h-screen ${isApiKeyMissing ? 'pt-24 md:pt-16' : 'pt-20 md:pt-8'}`}>
        <article className="max-w-5xl mx-auto">
            <Outlet />
        </article>
      </main>
    </div>
  );
};

export default Layout;
