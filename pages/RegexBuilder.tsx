
import React, { useState, useEffect } from 'react';
import { Terminal, Wand2, Info, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import OutputDisplay from '../components/OutputDisplay';
import Tooltip from '../components/Tooltip';
import { generateRegex } from '../services/geminiService';

const RegexBuilder: React.FC = () => {
  const [description, setDescription] = useState('');
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState<{ regex: string; explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [regexError, setRegexError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setValidationError(null);
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!result?.regex || !testString) {
      setIsMatch(null);
      setRegexError(null);
      return;
    }

    try {
      const re = new RegExp(result.regex);
      setIsMatch(re.test(testString));
      setRegexError(null);
    } catch (e) {
      setIsMatch(null);
      setRegexError("Invalid Regex syntax generated (JS incompatible)");
    }
  }, [result, testString]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Terminal className="text-purple-500" />
          Regex "No-Brainer"
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Stop struggling with hieroglyphics. Describe it, match it.
        </p>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center">
              I want to match...
              <Tooltip text="Describe the pattern logic." />
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="e.g. A valid email address ending in .edu"
                    className="w-full bg-dark-950 border border-dark-600 rounded-xl px-5 py-4 text-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-dark-600"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading || !description}
                    className="absolute right-2 top-2 bottom-2 aspect-square rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? <Wand2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                </button>
            </div>
            {validationError && (
              <p className="text-red-500 text-sm flex items-center gap-2 mt-2">
                <AlertCircle size={14} /> {validationError}
              </p>
            )}
        </div>

        <div className="space-y-2">
             <div className="flex items-center justify-between">
                <label className={`text-sm font-medium flex items-center ${validationError ? 'text-red-500' : 'text-slate-500'}`}>
                  Test String & Validation
                </label>
                {isMatch !== null && (
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${isMatch ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                        {isMatch ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {isMatch ? 'MATCH' : 'NO MATCH'}
                    </span>
                )}
             </div>
             <input 
                type="text"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Paste a string here..."
                className={`w-full bg-dark-900 border rounded-lg px-4 py-2 text-slate-800 dark:text-slate-300 text-sm outline-none transition-colors ${
                    isMatch === true ? 'border-green-500/50' : isMatch === false ? 'border-red-500/50' : 'border-dark-600'
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
                {result?.explanation || "Breakdown will appear here."}
            </p>
          </div>
      </div>
    </div>
  );
};

export default RegexBuilder;
