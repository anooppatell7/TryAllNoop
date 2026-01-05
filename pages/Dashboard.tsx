
import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Terminal, Code, ArrowRight, Clock, FileJson, FileText, GitCommit, DatabaseZap, Image, Zap, ShieldCheck } from 'lucide-react';

const DASHBOARD_TOOLS = [
  { title: "Mock Data Gen", desc: "Realistic datasets for testing in JSON, CSV, or SQL.", path: "/mock-data", icon: Database, color: "blue" },
  { title: "Regex Builder", desc: "Natural language to perfect Regex patterns.", path: "/regex", icon: Terminal, color: "purple" },
  { title: "Commit Msg Pro", desc: "Generate professional Git commit messages instantly.", path: "/commit-msg", icon: GitCommit, color: "red" },
  { title: "SQL to NoSQL", desc: "Convert tables to MongoDB, Firestore, or JSON.", path: "/sql-nosql", icon: DatabaseZap, color: "orange" },
  { title: "Dev OG Image", desc: "Beautiful social images for your GitHub repos.", path: "/og-image", icon: Image, color: "pink" },
  { title: "Code Simplifier", desc: "Refactor spaghetti into elegant code.", path: "/simplify", icon: Code, color: "noop" },
  { title: "Cron Traveler", desc: "Human language to Cron expressions.", path: "/cron", icon: Clock, color: "amber" },
  { title: "Type-Caster", desc: "JSON to TypeScript, Go, or Python types.", path: "/json-types", icon: FileJson, color: "indigo" },
  { title: "Readme Architect", desc: "Standardized docs for your projects in seconds.", path: "/readme", icon: FileText, color: "green" }
];

const COLOR_VARIANTS: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-blue-500/10",
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-purple-500/10",
  red: "bg-red-500/10 text-red-600 dark:text-red-400 shadow-red-500/10",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-orange-500/10",
  pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 shadow-pink-500/10",
  noop: "bg-noop-500/10 text-noop-600 dark:text-noop-400 shadow-noop-500/10",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-amber-500/10",
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-indigo-500/10",
  green: "bg-green-500/10 text-green-600 dark:text-green-400 shadow-green-500/10",
  dark: "bg-slate-500/10 text-slate-600 dark:text-slate-400 shadow-slate-500/10",
};

const TEXT_VARIANTS: Record<string, string> = {
  blue: "text-blue-600 dark:text-blue-400",
  purple: "text-purple-600 dark:text-purple-400",
  red: "text-red-600 dark:text-red-400",
  orange: "text-orange-600 dark:text-orange-400",
  pink: "text-pink-600 dark:text-pink-400",
  noop: "text-noop-600 dark:text-noop-400",
  amber: "text-amber-600 dark:text-amber-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
  green: "text-green-600 dark:text-green-400",
  dark: "text-slate-600 dark:text-slate-400",
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div className="text-center space-y-4 py-6">
        <div className="flex justify-center mb-6">
           <div className="px-4 py-1.5 rounded-full border border-noop-500/20 bg-noop-500/5 text-noop-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="animate-pulse" />
              Next-Gen AI Productivity
           </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
          Automate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-noop-500">All</span>.
          <br />
          Embrace the <span className="text-slate-400 dark:text-slate-500 font-mono">NoOp</span>.
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          The ultimate AI-powered productivity suite for modern developers. 
          Stop writing boilerplate, start building.
        </p>

        <div className="pt-4 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-xl border border-dark-700 text-xs text-slate-500">
                <ShieldCheck size={14} className="text-green-500" />
                <span>Fully powered by your <strong>Gemini API Key</strong>. No other setup needed.</span>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DASHBOARD_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
              key={tool.path}
              to={tool.path} 
              className="group relative p-8 rounded-2xl bg-dark-800 border border-dark-700 hover:border-noop-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${COLOR_VARIANTS[tool.color]}`}>
                <Icon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{tool.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">{tool.desc}</p>
              <div className={`flex items-center font-medium text-sm transition-all gap-1 ${TEXT_VARIANTS[tool.color]}`}>
                Open Tool <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
