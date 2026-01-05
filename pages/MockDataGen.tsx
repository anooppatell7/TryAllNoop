
import React, { useState } from 'react';
import { Database, Download, Play, RefreshCw, AlertCircle } from 'lucide-react';
import OutputDisplay from '../components/OutputDisplay';
import Tooltip from '../components/Tooltip';
import { generateMockData } from '../services/geminiService';
import { MockDataRequest } from '../types';

const MockDataGen: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState<'JSON' | 'CSV' | 'SQL'>('JSON');
  const [count, setCount] = useState(10);
  const [complexity, setComplexity] = useState<'Simple' | 'Complex'>('Simple');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await generateMockData({ topic, format, count, complexity });
      setResult(data);
    } catch (err) {
      setError("Failed to generate data. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock_data.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full">
      {/* Control Panel */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Database className="text-blue-500" />
            Mock Data Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Instantly create realistic datasets for testing. Just describe what you need.
          </p>
        </div>

        <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl space-y-6 shadow-lg">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
              Data Topic & Structure
              <Tooltip text="Describe the entities, fields, and specific formatting you need. Example: 'Users with uuid, realistic email, and a funny bio'." />
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g. Users with email, funny bio, and subscription status..."
              className="w-full h-32 bg-dark-900 border border-dark-600 rounded-xl p-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-dark-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                Format
              </label>
              <div className="grid grid-cols-3 gap-2 bg-dark-900 p-1 rounded-lg border border-dark-600">
                {['JSON', 'CSV', 'SQL'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f as any)}
                    className={`text-sm py-1.5 rounded-md transition-all font-medium ${
                      format === f ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                Complexity
              </label>
              <div className="grid grid-cols-2 gap-2 bg-dark-900 p-1 rounded-lg border border-dark-600">
                {['Simple', 'Complex'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setComplexity(c as any)}
                    className={`text-sm py-1.5 rounded-md transition-all font-medium ${
                      complexity === c ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Row Count: {count}</label>
            <input
              type="range"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
              loading || !topic
                ? 'bg-dark-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/25'
            }`}
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Play fill="currentColor" size={18} />}
            {loading ? 'Generating...' : 'Generate Data'}
          </button>
        </div>
      </div>

      <div className="flex flex-col h-full space-y-4">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Result Preview</h2>
            {result && (
                <button 
                    onClick={downloadFile}
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                >
                    <Download size={16} /> Download File
                </button>
            )}
         </div>
        <div className="flex-1 min-h-[400px]">
             <OutputDisplay content={result} language={format.toLowerCase()} isLoading={loading} title={`mock_data.${format.toLowerCase()}`} />
        </div>
      </div>
    </div>
  );
};

export default MockDataGen;
