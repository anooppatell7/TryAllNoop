
import React, { useState } from 'react';
import { DatabaseZap, ArrowRight, RefreshCw, Send } from 'lucide-react';
import OutputDisplay from '../components/OutputDisplay';
import Tooltip from '../components/Tooltip';
import { sqlToNoSql } from '../services/geminiService';

const SqlToNoSql: React.FC = () => {
  const [sql, setSql] = useState('');
  const [target, setTarget] = useState('MongoDB');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const targets = ['MongoDB', 'Firestore', 'DynamoDB', 'Redis (JSON)', 'Cassandra'];

  const handleConvert = async () => {
    if (!sql.trim()) return;
    setLoading(true);
    try {
      const converted = await sqlToNoSql(sql, target);
      setResult(converted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <DatabaseZap className="text-orange-400" />
            SQL to NoSQL
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Migrate schemas or queries with AI-assisted structural optimization.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <select 
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-dark-800 border border-dark-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg p-2.5 outline-none focus:border-orange-500"
            >
                {targets.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button
                onClick={handleConvert}
                disabled={loading || !sql}
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
            >
                {loading ? "Converting..." : "Convert"} <ArrowRight size={16} />
            </button>
        </div>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col rounded-xl overflow-hidden border border-dark-600 bg-dark-800">
            <div className="px-4 py-3 bg-dark-700 border-b border-dark-600 text-sm font-medium text-slate-600 dark:text-slate-300">
                SQL Schema / Query
            </div>
            <textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                placeholder="CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), ...);"
                className="flex-1 w-full bg-[#0d1117] p-4 text-sm font-mono text-slate-300 outline-none resize-none focus:ring-1 focus:ring-orange-500/50"
                spellCheck={false}
            />
        </div>

        <div className="flex flex-col h-full relative">
             <OutputDisplay 
                title={`${target} Output`} 
                content={result} 
                language="json" 
                isLoading={loading} 
             />
        </div>
      </div>
    </div>
  );
};

export default SqlToNoSql;
