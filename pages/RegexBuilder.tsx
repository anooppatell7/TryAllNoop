
import React, { useState, useEffect } from 'react';
import { Terminal, Wand2, Info, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import OutputDisplay from '../components/OutputDisplay';
import Tooltip from '../components/Tooltip';
import { generateRegex } from '../services/geminiService';

const RegexBuilder: React.FC = () => {
  const [description, setDescription] = useState('');
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState<{ regex: string; explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setValidationError(null);
    setError(null);
    if (!description.trim()) return;
    
    if (!testString.trim()) {
      setValidationError("Please provide a test string to ensure the pattern matches your needs.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const data = await generateRegex(description, testString);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Failed to generate regex. Check your API key or quota.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!result?.regex || !testString) {
      setIsMatch(null);
      return;
    }

    try {
      const re = new RegExp(result.regex);
      setIsMatch(re.test(testString));
    } catch (e) {
      setIsMatch(null);
    }
  }, [result, testString]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Terminal className="text-purple-500" />
          Regex Builder
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Turn natural language into perfect Regular Expressions.
        </p>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center">
              Pattern Description
              <Tooltip text="Describe what you want to match in plain English." />
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="e.g. A 10-digit phone number with optional dashes"
                    className="w-full bg-dark-950 border border-dark-600 rounded-xl px-5 py-4 text-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-dark-600"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading || !description}
                    className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold gap-2"
                >
                    {loading ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
                    <span className="hidden sm:inline">{loading ? 'Thinking...' : 'Build'}</span>
                </button>
            </div>
            
            {validationError && (
              <p className="text-red-500 text-xs flex items-center gap-1.5 mt-2 animate-fade-in">
                <AlertCircle size={14} /> {validationError}
              </p>
            )}

            {error && (
              <div className="p-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-500 text-sm animate-fade-in">
                <AlertCircle className="shrink-0" size={18} />
                <p>{error}</p>
              </div>
            )}
        </div>

        <div className="space-y-2 pt-2 border-t border-dark-700">
             <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  Live Validation
                </label>
                {isMatch !== null && (
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${isMatch ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {isMatch ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {isMatch ? 'MATCHES' : 'NO MATCH'}
                    </span>
                )}
             </div>
             <input 
                type="text"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Paste test text here to verify the regex..."
                className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-slate-800 dark:text-slate-300 text-sm outline-none transition-all ${
                    isMatch === true ? 'border-green-500/50 bg-green-500/5' : isMatch === false ? 'border-red-500/50 bg-red-500/5' : 'border-dark-600'
                }`}
             />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 min-h-[150px]">
            <OutputDisplay 
                title="Regex Pattern" 
                content={result?.regex || ''} 
                isLoading={loading} 
            />
          </div>
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 mb-4 pb-2 border-b border-dark-700">
                <Info size={16} className="text-purple-500" />
                <span className="font-mono text-sm font-bold">Explanation</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {result?.explanation || "A detailed breakdown of how the pattern works will appear here."}
            </p>
          </div>
      </div>
    </div>
  );
};

export default RegexBuilder;
