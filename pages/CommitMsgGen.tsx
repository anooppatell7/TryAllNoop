
import React, { useState, useEffect } from 'react';
import { GitCommit, Copy, Check, RefreshCw, Send } from 'lucide-react';
import { generateCommitMessage } from '../services/geminiService';
import Tooltip from '../components/Tooltip';

const CommitMsgGen: React.FC = () => {
  const [changes, setChanges] = useState('');
  const [style, setStyle] = useState('Conventional Commits');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const styles = ['Conventional Commits', 'Emoji / Gitmoji', 'Short & Sweet', 'Detailed', 'Angry Developer'];

  const handleGenerate = async () => {
    if (!changes.trim()) return;
    setLoading(true);
    try {
      const msg = await generateCommitMessage(changes, style);
      setResult(msg);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleGenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changes, style]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <GitCommit className="text-red-500" />
          Commit Message Pro
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Describe your changes, get a perfect commit message. No more "fixed things".
        </p>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
            What did you change?
          </label>
          <textarea
            value={changes}
            onChange={(e) => setChanges(e.target.value)}
            placeholder="e.g. Added user profile editing..."
            className="w-full h-32 bg-dark-900 border border-dark-600 rounded-xl p-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-red-500 outline-none resize-none transition-all"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Commit Style</label>
            <select 
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 text-slate-800 dark:text-slate-300 rounded-lg p-3 outline-none"
            >
              {styles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !changes}
              className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
              Generate
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-dark-950 border border-dark-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in group">
          <code className="text-xl font-mono text-red-600 dark:text-red-400 break-all">{result}</code>
          <button
            onClick={handleCopy}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-slate-600 dark:text-slate-300 transition-all hover:bg-dark-700"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      <div className="text-center text-xs text-slate-500">
        Pro tip: Press <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-dark-800 text-slate-400">Ctrl + Enter</kbd> to generate.
      </div>
    </div>
  );
};

export default CommitMsgGen;
