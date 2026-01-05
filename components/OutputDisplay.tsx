import React, { useState } from 'react';
import { Copy, Check, Terminal, Download } from 'lucide-react';

interface OutputDisplayProps {
  title?: string;
  content: string;
  language?: string;
  isLoading?: boolean;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ title = "Result", content, language = "text", isLoading = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!content) return;
    
    // Determine extension
    let ext = 'txt';
    if (language.includes('script') || language === 'ts' || language === 'js') ext = 'ts';
    else if (language.includes('json')) ext = 'json';
    else if (language.includes('markdown') || language === 'md') ext = 'md';
    else if (language.includes('python')) ext = 'py';
    else if (language.includes('go')) ext = 'go';
    else if (language.includes('rust')) ext = 'rs';
    else if (language.includes('java')) ext = 'java';
    else if (language.includes('sql')) ext = 'sql';
    else if (language.includes('csv')) ext = 'csv';

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `allnoop_result.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-dark-600 bg-dark-800 shadow-2xl flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-dark-700 border-b border-dark-600">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal size={16} />
          <span className="text-sm font-mono font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={handleDownload}
                disabled={!content || isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50"
                title="Download as file"
            >
                <Download size={14} />
            </button>
            <div className="w-px h-4 bg-dark-600 mx-1"></div>
            <button
            onClick={handleCopy}
            disabled={!content || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50"
            >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
            </button>
        </div>
      </div>
      
      <div className="relative flex-1 bg-[#0d1117] overflow-auto min-h-[200px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-noop-500/20 border-t-noop-500 rounded-full animate-spin"></div>
            <p className="text-noop-400 text-sm animate-pulse font-mono">Generative Processing...</p>
          </div>
        ) : (
            <pre className="p-4 text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                {content || <span className="text-slate-600 italic">// Output will appear here...</span>}
            </pre>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;