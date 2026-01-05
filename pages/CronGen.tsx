
import React, { useState } from 'react';
import { Clock, CheckCircle2, History } from 'lucide-react';
import OutputDisplay from '../components/OutputDisplay';
import Tooltip from '../components/Tooltip';
import { generateCron } from '../services/geminiService';

const CronGen: React.FC = () => {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<{ cron: string; explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const data = await generateCron(description);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Clock className="text-amber-400" />
          Cron Time-Traveler
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Never memorize <code>* * * * *</code> again. Just say when.
        </p>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center">
              Schedule Description
              <Tooltip text="Describe the frequency in plain English (e.g., 'every 15 minutes', 'first Monday of the month')." />
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Every Tuesday at 4:30 PM, or every 5 minutes during working hours"
                    className="w-full bg-dark-950 border border-dark-600 rounded-xl px-5 py-4 text-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-dark-600"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading || !description}
                    className="absolute right-2 top-2 bottom-2 px-6 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Computing..." : "Get Cron"}
                </button>
            </div>
        </div>
      </div>

      {result && (
        <div className="animate-fade-in grid md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
                 <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-dark-900 border border-dark-600 p-8 rounded-2xl text-center space-y-4">
                         <div className="text-5xl md:text-7xl font-mono font-bold text-slate-800 dark:text-white tracking-wider break-all">
                             {result.cron}
                         </div>
                         <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium uppercase tracking-widest">
                             <CheckCircle2 size={16} /> Valid Expression
                         </div>
                    </div>
                 </div>
            </div>

            <div className="md:col-span-3 bg-dark-800 border border-dark-700 rounded-xl p-6 flex items-start gap-4">
                <div className="mt-1">
                    <History className="text-slate-500" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-slate-200">Human Readable</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {result.explanation}
                    </p>
                </div>
            </div>
        </div>
      )}

      {!result && !loading && (
          <div className="text-center p-12 text-slate-400 dark:text-slate-600 italic">
              "Every second Friday of the month at midnight"
          </div>
      )}
    </div>
  );
};

export default CronGen;
