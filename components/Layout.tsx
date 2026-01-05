
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Code, Database, Terminal, Menu, X, Clock, FileJson, FileText, GitCommit, DatabaseZap, Image, Sun, Moon, BookOpen, Zap, ShieldCheck, ShieldAlert, Bug, ExternalLink, Sparkles } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
  const [isProMode, setIsProMode] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkApi = async () => {
      const key = (process?.env?.API_KEY) || 
                  ((process?.env as any)?.VITE_API_KEY) || 
                  ((window as any).API_KEY) || 
                  ((window as any).VITE_API_KEY) ||
                  // @ts-ignore
                  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY);
      
      setIsApiConnected(!!key);

      // Check for AI Studio Key Selection
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const hasSelected = await (window as any).aistudio.hasSelectedApiKey();
        setIsProMode(hasSelected);
      }
    };

    checkApi();
    const interval = setInterval(checkApi, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenSelectKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setIsProMode(true);
    }
  };

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
      <aside className="hidden md:flex flex-col w-64 bg-dark-800 border-r border-dark-700 fixed h-full z-20">
        <header className="p-6 flex items-center gap-3 border-b border-dark-700">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl shadow-lg shadow-noop-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-noop-400 to-noop-600 text-white">
              <Zap size={24} fill="currentColor" />
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

        <div className="p-4 space-y-2">
           {isProMode ? (
             <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles size={14} className="animate-pulse" />
                Pro Mode Active
             </div>
           ) : (
             <button 
               onClick={handleOpenSelectKey}
               className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-noop-500/10 text-noop-400 border border-noop-500/20 hover:bg-noop-500/20 transition-all"
             >
                <Sparkles size={14} />
                Unlock Pro Mode
             </button>
           )}

           <button 
             onClick={() => setShowDebug(!showDebug)}
             className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
             isApiConnected ? 'text-green-500 bg-green-500/5 border-green-500/10' : 'text-red-500 bg-red-500/5 border-red-500/10 animate-pulse'
           }`}>
              {isApiConnected ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
              {isApiConnected ? 'System Ready' : 'Setup Required'}
              <Bug size={10} className="ml-auto opacity-50" />
           </button>
           
           {showDebug && (
             <div className="p-4 bg-dark-950 rounded-xl border border-dark-700 text-[10px] font-mono text-slate-500 space-y-3 animate-fade-in shadow-2xl">
                <div className="flex items-center justify-between border-b border-dark-800 pb-2">
                   <span className="text-noop-500 font-bold">Connection Info</span>
                   <button onClick={() => setShowDebug(false)}><X size={12} /></button>
                </div>
                <div className="space-y-2">
                    <p className="text-slate-300">Source: <span className="text-white font-bold">{isProMode ? 'User Key (Pro)' : 'Vercel Env'}</span></p>
                    <p className="text-slate-300">Status: {isApiConnected ? 'Connected' : 'Disconnected'}</p>
                    {!isApiConnected && <p className="text-red-400 text-[8px]">Set VITE_API_KEY in Vercel or click Pro Mode.</p>}
                </div>
             </div>
           )}

           <button 
             onClick={toggleTheme}
             className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-600 text-slate-600 dark:text-slate-400 hover:text-noop-500 transition-all group"
           >
             <span className="text-sm font-medium">{isDarkMode ? 'Dark' : 'Light'}</span>
             {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
           </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed w-full bg-dark-800 border-b border-dark-700 z-30 px-4 py-3 flex items-center justify-between transition-colors">
         <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-noop-400 to-noop-600 text-white">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">AllNoop</span>
            </Link>
         </div>
         <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-500 dark:text-slate-300">
               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
         </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-16 bg-dark-900/95 backdrop-blur-sm animate-fade-in">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-medium ${
                  isActive(item.path)
                    ? 'bg-noop-500 text-white'
                    : 'text-slate-400'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-dark-700">
               <button onClick={handleOpenSelectKey} className="w-full flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-medium bg-purple-500 text-white">
                  <Sparkles size={20} /> Pro Mode (Select Key)
               </button>
            </div>
          </nav>
        </div>
      )}

      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto min-h-screen pt-20 md:pt-8">
        <article className="max-w-5xl mx-auto">
            <Outlet />
        </article>
      </main>
    </div>
  );
};

export default Layout;
