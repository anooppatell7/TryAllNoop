
import React, { useState, useRef, useEffect } from 'react';
import { FileJson, FileType, ArrowRight, Upload, AlertTriangle, ShieldCheck, AlertCircle, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import OutputDisplay from '../components/OutputDisplay';
import Tooltip from '../components/Tooltip';
import { convertJsonToTypes, QuotaError } from '../services/geminiService';

const JsonToTypes: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('TypeScript');
  const [isValidJson, setIsValidJson] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = ['TypeScript', 'Go', 'Rust', 'Python (Pydantic)', 'Java (Lombok)', 'Swift', 'Kotlin'];

  useEffect(() => {
    const check = () => {
      const key = (process?.env?.API_KEY) || ((window as any).API_KEY) || (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY);
      setIsApiConnected(!!key);
    };
    check();
    const inv = setInterval(check, 2000);
    return () => clearInterval(inv);
  }, []);

  useEffect(() => {
    if (!jsonInput.trim()) {
        setIsValidJson(true);
        return;
    }
    try {
        JSON.parse(jsonInput);
        setIsValidJson(true);
    } catch (e) {
        setIsValidJson(false);
    }
  }, [jsonInput]);

  const handleConvert = async () => {
    if (!jsonInput.trim() || !isValidJson) return;
    
    setLoading(true);
    setError(null);
    setIsQuotaError(false);
    setOutputCode('');
    
    try {
      const result = await convertJsonToTypes(jsonInput, language);
      if (!result) throw new Error("AI returned empty result. Try simplifying your JSON.");
      setOutputCode(result);
    } catch (e: any) {
      if (e instanceof QuotaError) {
        setIsQuotaError(true);
      } else {
        setError(e.message || "An unexpected error occurred during conversion.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProMode = () => {
    if ((window as any).aistudio?.openSelectKey) {
      (window as any).aistudio.openSelectKey();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileJson className="text-indigo-400" />
            JSON Type-Caster
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Paste Raw JSON, Get Strict Types.</p>
        </div>
        
        <div className="flex items-center gap-2">
            <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-dark-800 border border-dark-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg p-2.5 outline-none focus:border-indigo-500"
            >
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <button
                onClick={handleConvert}
                disabled={loading || !jsonInput || !isValidJson}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <FileType size={16} />}
                <span className="hidden sm:inline">{loading ? "Casting..." : "Convert"}</span>
            </button>
        </div>
      </div>

      {isQuotaError && (
        <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-1">
                 <h3 className="font-bold text-slate-900 dark:text-white">Shared Quota Exhausted</h3>
                 <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                    Too many people are using the free shared key right now. Connect your own private key to get <strong>unlimited personal use</strong> instantly.
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-3 shrink-0">
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                className="text-xs text-slate-500 hover:text-white flex items-center gap-1 underline underline-offset-4"
              >
                Learn about keys <ExternalLink size={12} />
              </a>
              <button 
                onClick={handleOpenProMode}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                <Sparkles size={16} /> Enable Pro Mode
              </button>
           </div>
        </div>
      )}

      {error && !isQuotaError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-500 text-sm animate-fade-in shadow-sm">
            <AlertCircle className="shrink-0" size={18} />
            <div className="space-y-1">
                <p className="font-bold">Conversion Error</p>
                <p>{error}</p>
            </div>
        </div>
      )}

      <div className="flex-1 grid md:grid-cols-2 gap-4 min-h-0">
        <div className={`flex flex-col rounded-xl overflow-hidden border bg-dark-800 transition-colors ${isValidJson ? 'border-dark-600' : 'border-red-500/50'}`}>
            <div className="px-4 py-3 bg-dark-700 border-b border-dark-600 text-sm font-medium text-slate-600 dark:text-slate-300 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="flex items-center">
                        Input JSON
                        <Tooltip text="Paste valid JSON object here." />
                    </span>
                    {!isValidJson && (
                        <span className="flex items-center gap-1 text-xs text-red-400 bg-red-950/30 px-2 py-0.5 rounded-full border border-red-500/20">
                            <AlertTriangle size={12} /> Invalid Syntax
                        </span>
                    )}
                </div>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs bg-dark-600 hover:bg-dark-500 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md transition-colors border border-dark-500"
                >
                    <Upload size={14} /> Upload
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />
            </div>
            <div className="flex-1 relative">
                <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{ "user": { "id": 1, "name": "Noop" } }'
                    className="absolute inset-0 w-full h-full bg-[#0d1117] p-4 text-sm font-mono text-slate-300 outline-none resize-none focus:ring-1 focus:ring-indigo-500/50"
                    spellCheck={false}
                />
            </div>
            {isApiConnected && (
              <div className="px-4 py-2 border-t border-dark-600 bg-dark-900 flex items-center gap-2 text-[9px] font-bold text-green-500 uppercase tracking-widest">
                  <ShieldCheck size={12} /> Live API Status: Active
              </div>
            )}
        </div>

        <div className="flex flex-col h-full relative">
             <div className="absolute left-0 top-1/2 -translate-x-1/2 z-10 hidden md:block">
                <div className="bg-dark-700 rounded-full p-2 border border-dark-500 text-slate-400 shadow-xl">
                    <ArrowRight size={16} />
                </div>
             </div>
             <OutputDisplay 
                title={`${language} Definitions`} 
                content={outputCode} 
                language={language.toLowerCase().split(' ')[0]} 
                isLoading={loading} 
             />
        </div>
      </div>
    </div>
  );
};

export default JsonToTypes;
