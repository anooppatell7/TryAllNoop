
import React, { useState } from 'react';
import { Github, Copy, Check, Terminal as TerminalIcon, Info, ExternalLink } from 'lucide-react';
import Tooltip from '../components/Tooltip';

const GithubOnboarding: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'my-awesome-project';
  
  const commands = [
    `# 1. Initialize local repository`,
    `git init`,
    ``,
    `# 2. Add all files to staging`,
    `git add .`,
    ``,
    `# 3. Create initial commit`,
    `git commit -m "chore: initial commit via AllNoop"`,
    ``,
    `# 4. Branch and Remote setup`,
    `git branch -M main`,
    `git remote add origin ${repoUrl || 'https://github.com/YOUR_USER/YOUR_REPO.git'}`,
    ``,
    `# 5. Push to GitHub`,
    `git push -u origin main`
  ].join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(commands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Github className="text-slate-900 dark:text-white" />
          GitHub Repo Pusher
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Generate the exact commands to push your project to GitHub in seconds.
        </p>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
            GitHub Repository URL
            <Tooltip text="Copy the HTTPS or SSH URL from your newly created GitHub repository." />
          </label>
          <div className="relative">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository.git"
              className="w-full bg-dark-950 border border-dark-600 rounded-xl px-5 py-4 text-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-noop-500 outline-none transition-all placeholder:text-slate-600 dark:placeholder:text-dark-600"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
               <ExternalLink size={20} />
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-noop-600 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-[#0d1117] border border-dark-600 rounded-2xl overflow-hidden flex flex-col h-[400px]">
            <div className="px-4 py-3 bg-dark-700 border-b border-dark-600 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TerminalIcon size={16} className="text-noop-400" />
                <span className="text-xs font-mono text-slate-400">Terminal Script</span>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs font-bold text-noop-400 hover:text-noop-300 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy Commands'}
              </button>
            </div>
            <pre className="p-6 text-sm font-mono text-slate-300 overflow-auto whitespace-pre leading-relaxed selection:bg-noop-500/30">
              {commands}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-noop-500/5 border border-noop-500/20 p-6 rounded-2xl flex gap-4">
        <Info className="text-noop-500 shrink-0" size={24} />
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Prerequisites</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            1. Create a <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-noop-500 hover:underline">New Repository</a> on GitHub first.<br />
            2. Open your terminal in the root folder of this project.<br />
            3. Ensure you have Git installed (`git --version`).
          </p>
        </div>
      </div>
    </div>
  );
};

export default GithubOnboarding;
