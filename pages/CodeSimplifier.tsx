
import React, { useState } from 'react';
import { Code, FastForward, ArrowRight, Wand2 } from 'lucide-react';
import OutputDisplay from '../components/OutputDisplay';
import Tooltip from '../components/Tooltip';
import { simplifyCode, detectLanguage } from '../services/geminiService';

const CodeSimplifier: React.FC = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [language, setLanguage] = useState('JavaScript');
  const [languages, setLanguages] = useState(['JavaScript', 'TypeScript', 'Python', 'React TSX', 'Java', 'Go', 'Rust', 'C++', 'PHP']);

  const handleSimplify = async () => {
    if (!inputCode.trim()) return;
    setLoading(true);
    try {
      const result = await simplifyCode(inputCode, language);
      setOutputCode(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    if (!inputCode.trim()) return;
    setDetecting(true);
    try {
      const detected = await detectLanguage(inputCode);
      const normalized = detected.trim();
      
      if (!languages.includes(normalized)) {
        setLanguages(prev => [normalized, ...prev]);
      }
      setLanguage(normalized);
    } catch (e) {
      console.error("Detection failed", e);
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Code className="text-noop-400" />
            Code Simplifier
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Convert spaghetti into elegant, maintainable logic.</p>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="flex items-center">
                <button
                    onClick={handleAutoDetect}
                    disabled={detecting || !inputCode}
                    className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-slate-300 p-2.5 rounded-lg transition-colors disabled:opacity-50"
                    title="Auto-detect language"
                >
                    {detecting ? <Wand2 size={18} className="animate-spin text-purple-400" /> : <Wand2 size={18} className="text-purple-400" />}
                </button>
                <Tooltip text="Auto-detect the programming language of your snippet." />
            </div>

            <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-dark-800 border border-dark-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg p-2.5 outline-none focus:border-noop-500"
            >
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <button
                onClick={handleSimplify}
                disabled={loading || !inputCode}
                className="bg-noop-600 hover:bg-noop-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-noop-500/20"
            >
                {loading ? "Optimizing..." : "Simplify"} <FastForward size={16} />
            </button>
        </div>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col rounded-xl overflow-hidden border border-dark-600 bg-dark-800">
            <div className="px-4 py-3 bg-dark-700 border-b border-dark-600 text-sm font-medium text-slate-600 dark:text-slate-300">
                Input Code
            </div>
            <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="// Paste your complex code here..."
                className="flex-1 w-full bg-[#0d1117] p-4 text-sm font-mono text-slate-300 outline-none resize-none focus:ring-1 focus:ring-noop-500/50"
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
                title="Zen Mode Result" 
                content={outputCode} 
                language={language.toLowerCase()} 
                isLoading={loading} 
             />
        </div>
      </div>
    </div>
  );
};

export default CodeSimplifier;
