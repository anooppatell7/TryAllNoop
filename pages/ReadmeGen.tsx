
import React, { useState } from 'react';
import { FileText, PenTool, ArrowRight } from 'lucide-react';
import OutputDisplay from '../components/OutputDisplay';
import Tooltip from '../components/Tooltip';
import { generateReadme } from '../services/geminiService';

const ReadmeGen: React.FC = () => {
  const [projectInfo, setProjectInfo] = useState('');
  const [style, setStyle] = useState('Standard');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = ['Standard', 'Minimal', 'Corporate', 'Open Source (Fun)', 'Technical / API Docs'];

  const handleGenerate = async () => {
    if (!projectInfo.trim()) return;
    setLoading(true);
    try {
      const data = await generateReadme(projectInfo, style);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="text-green-400" />
            Readme Architect
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Describe your project, get a documentation masterpiece.</p>
        </div>
        
        <div className="flex items-center gap-3">
             <div className="flex items-center">
                 <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">Tone:</span>
                 <Tooltip text="Selects the professional style and structure of the generated documentation." />
            </div>
            <select 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="bg-dark-800 border border-dark-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg p-2.5 outline-none focus:border-green-500"
            >
                {styles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
                onClick={handleGenerate}
                disabled={loading || !projectInfo}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
                {loading ? "Architecting..." : "Generate Docs"} <PenTool size={16} />
            </button>
        </div>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col rounded-xl overflow-hidden border border-dark-600 bg-dark-800">
            <div className="px-4 py-3 bg-dark-700 border-b border-dark-600 text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center">
                Project Details
                <Tooltip text="Include key features, tech stack, intended audience, and any specific installation steps." />
            </div>
            <textarea
                value={projectInfo}
                onChange={(e) => setProjectInfo(e.target.value)}
                placeholder="E.g. A React Native app that tracks water intake. Uses Firebase for backend and Redux for state management. Features include reminders and historical charts."
                className="flex-1 w-full bg-[#0d1117] p-4 text-sm font-mono text-slate-300 outline-none resize-none focus:ring-1 focus:ring-green-500/50 placeholder:text-slate-600 dark:placeholder:text-dark-600"
                spellCheck={false}
            />
        </div>

        <div className="flex flex-col h-full relative">
             <div className="absolute left-0 top-1/2 -translate-x-1/2 z-10 hidden md:block">
                <div className="bg-dark-700 rounded-full p-2 border border-dark-500 text-slate-400">
                    <ArrowRight size={16} />
                </div>
             </div>
             <OutputDisplay 
                title="README.md" 
                content={result} 
                language="markdown" 
                isLoading={loading} 
             />
        </div>
      </div>
    </div>
  );
};

export default ReadmeGen;
