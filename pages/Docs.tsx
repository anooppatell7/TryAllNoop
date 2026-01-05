
import React from 'react';
import { 
  BookOpen, 
  Database, 
  Terminal, 
  Code, 
  GitCommit, 
  DatabaseZap, 
  Image, 
  Clock, 
  FileJson, 
  FileText,
  ChevronRight,
  Lightbulb,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Cpu,
  Globe,
  Lock,
  Github
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DOCS_SECTIONS = [
  { id: 'introduction', title: 'Introduction', icon: BookOpen },
  { id: 'mock-data', title: 'Mock Data Gen', icon: Database },
  { id: 'regex', title: 'Regex Builder', icon: Terminal },
  { id: 'simplify', title: 'Code Simplifier', icon: Code },
  { id: 'github-push', title: 'GitHub Pusher', icon: Github },
  { id: 'commit-msg', title: 'Commit Msg Pro', icon: GitCommit },
  { id: 'sql-nosql', title: 'SQL to NoSQL', icon: DatabaseZap },
  { id: 'og-image', title: 'Dev OG Image', icon: Image },
  { id: 'cron', title: 'Cron Traveler', icon: Clock },
  { id: 'json-types', title: 'Type-Caster', icon: FileJson },
  { id: 'readme', title: 'Readme Architect', icon: FileText },
];

const INTRO_FEATURES = [
  { icon: Lock, color: "text-noop-500", title: "Zero Data Persistence", desc: "We never store your code or data. Everything happens in-flight via secure AI channels." },
  { icon: Globe, color: "text-purple-500", title: "Schema Agnostic", desc: "Whether you're using SQL, NoSQL, or flat JSON, our models adapt to your standards." },
  { icon: Cpu, color: "text-blue-500", title: "AI-First Logic", desc: "Powered by Gemini 3 for semantic understanding, not just regex matching." }
];

const OTHER_TOOLS_DOCS = [
  { 
    id: 'github-push', 
    title: 'GitHub Pusher', 
    icon: Github,
    iconColor: "text-slate-900 dark:text-white",
    how: "Enter your repository URL. Copy the generated CLI commands and run them in your project's root terminal.",
    pro: "Perfect for quickly bootstrapping local projects to the cloud without looking up git syntax."
  },
  { 
    id: 'commit-msg', 
    title: 'Commit Msg Pro', 
    icon: GitCommit,
    iconColor: "text-red-500",
    how: "Paste a diff or a list of bullet points of what you changed. Choose 'Conventional' for team standards or 'Angry' for Friday afternoon pushes.",
    pro: "Use detailed mode if you need a body description to explain the 'Why' behind the change."
  },
  { 
    id: 'sql-nosql', 
    title: 'SQL to NoSQL', 
    icon: DatabaseZap,
    iconColor: "text-orange-500",
    how: "Provide a standard CREATE TABLE statement. Select MongoDB, Firestore, or DynamoDB. The AI will suggest a denormalized structure.",
    pro: "The tool automatically detects Join patterns and suggests whether to embed or reference documents."
  },
  { 
    id: 'og-image', 
    title: 'Dev OG Image Gen', 
    icon: Image,
    iconColor: "text-pink-500",
    how: "Enter your project title and tech stack. The AI will render a 16:9 developer-themed image with neon accents and high contrast.",
    pro: "Ideal for GitHub social previews to make your repositories stand out in the feed."
  }
];

const BEST_PRACTICES = [
  { title: "1. Prompt Specificity", desc: "When using NLP tools (Regex, Mock Data, Readme), precision is key. Instead of 'users', say 'users with encrypted password hashes and last login timestamps'." },
  { title: "2. Contextual Selection", desc: "For the Code Simplifier, select the specific language for better results. The 'Auto-Detect' is great, but explicit selection helps the AI use language-specific shorthand." },
  { title: "3. Format Awareness", desc: "Remember that SQL exports include INSERT statements by default. Always verify your table names match the exported data before running in production." },
  { title: "4. Output Verification", desc: "While our Gemini 3 models are state-of-the-art, always perform a quick visual diff on refactored code to ensure business logic remains intact." }
];

const Docs: React.FC = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 animate-fade-in pb-24">
      {/* Sidebar TOC */}
      <aside className="lg:w-64 lg:sticky lg:top-8 h-fit space-y-2 hidden lg:block">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">Documentation</h4>
        {DOCS_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-noop-500/10 hover:text-noop-600 dark:hover:text-noop-400 transition-all text-left border border-transparent hover:border-noop-500/20 group"
            >
              <span className="group-hover:scale-110 transition-transform"><Icon size={20} /></span>
              {section.title}
            </button>
          );
        })}
        
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-noop-600/20 to-purple-600/20 border border-noop-500/20">
            <p className="text-xs text-noop-600 dark:text-noop-400 font-bold mb-2 uppercase tracking-tight">Pro Features</p>
            <p className="text-[11px] text-slate-500 leading-normal">All tools are powered by Gemini 3 models for maximum accuracy.</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-32">
        {/* Introduction */}
        <section id="introduction" className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-noop-500/10 text-noop-600 dark:text-noop-400 text-xs font-bold border border-noop-500/20 uppercase tracking-wider">
            <Zap size={14} /> Documentation Guide
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            The Developer's <span className="text-transparent bg-clip-text bg-gradient-to-r from-noop-500 to-purple-500">Mastery Suite</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            AllNoop handles repetitive, context-switching tasks so you can stay in your creative flow state.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INTRO_FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-dark-800 border border-dark-700 space-y-3 hover:border-noop-500/30 transition-colors">
                  <div className={`mb-2 ${feature.color}`}><Icon size={24} /></div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mock Data Gen */}
        <section id="mock-data" className="space-y-8 scroll-mt-24">
          <header className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <Database size={32} />
             </div>
             <div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Mock Data Generator</h2>
                <div className="flex gap-2 mt-1">
                   <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase">Testing</span>
                   <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase">SQL/JSON</span>
                </div>
             </div>
          </header>
          <div className="grid md:grid-cols-2 gap-12 items-start">
             <div className="space-y-6">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                   Synthetic data at scale. Define your entities and AllNoop generates realistic, context-aware datasets in JSON, CSV, or SQL format.
                </p>
                <div className="space-y-4">
                   <h4 className="font-bold text-slate-900 dark:text-white underline decoration-blue-500 decoration-2 underline-offset-4">Workflow</h4>
                   <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                      <li>1. Describe your data topic (e.g., "Patients for a clinical trial").</li>
                      <li>2. Choose your output format and row count.</li>
                      <li>3. Use Complexity for nested objects or relational keys.</li>
                   </ol>
                </div>
             </div>
             <div className="space-y-4">
                <div className="p-1 rounded-xl bg-dark-950 border border-dark-700 shadow-2xl">
                   <div className="flex items-center justify-between px-3 py-2 border-b border-dark-700">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">output_preview.json</span>
                   </div>
                   <pre className="p-4 text-[11px] font-mono text-blue-400 overflow-x-auto">
{`[
  {
    "id": "uuid-v4",
    "name": "Jane Doe",
    "status": "Active"
  }
]`}
                   </pre>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl flex gap-3">
                   <Lightbulb className="text-blue-500 shrink-0" size={20} />
                   <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                     Pro Tip: Mention specific field types like "realistic IBAN numbers" for high-fidelity mocks.
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* Short Docs Grid */}
        <section className="grid md:grid-cols-2 gap-8 scroll-mt-24 pt-16 border-t border-dark-700">
           {OTHER_TOOLS_DOCS.map(tool => {
             const Icon = tool.icon;
             return (
               <div key={tool.id} id={tool.id} className="p-8 rounded-3xl bg-dark-800 border border-dark-700 space-y-4 hover:border-noop-500/30 transition-all group">
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-dark-900 border border-dark-700 group-hover:scale-110 transition-transform">
                        <Icon className={tool.iconColor} size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tool.title}</h3>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Guide</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tool.how}</p>
                     </div>
                     <div className="p-4 bg-dark-950/50 rounded-xl border border-dark-700/50">
                        <p className="text-[11px] text-slate-500 italic"><span className="font-bold text-noop-500 not-italic">Pro Tip: </span>{tool.pro}</p>
                     </div>
                  </div>
               </div>
             );
           })}
        </section>

        {/* Best Practices */}
        <section className="bg-dark-800 rounded-3xl border border-dark-700 p-8 md:p-12 space-y-8">
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <ShieldCheck className="text-noop-500" />
              Developer Mastery
           </h2>
           <div className="grid md:grid-cols-2 gap-8">
              {BEST_PRACTICES.map((bp, i) => (
                <div key={i} className="space-y-2">
                   <h4 className="font-bold text-slate-900 dark:text-white">{bp.title}</h4>
                   <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{bp.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* CTA */}
        <section className="relative rounded-3xl p-12 text-center border border-noop-500/20 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-noop-600/10 to-purple-600/10 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Master Your Workflow</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-noop-600 hover:bg-noop-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-noop-500/20 hover:-translate-y-1">
                 Return to Dashboard <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Docs;
