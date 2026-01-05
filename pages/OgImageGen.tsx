
import React, { useState } from 'react';
import { Image, Download, RefreshCw, Send, Github } from 'lucide-react';
import { generateOgImage } from '../services/geminiService';
import Tooltip from '../components/Tooltip';

const OgImageGen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tech, setTech] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title) return;
    setLoading(true);
    setImageUrl('');
    try {
      const url = await generateOgImage(title, subtitle, tech);
      setImageUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `og_image_${title.toLowerCase().replace(/\s+/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-3">
          <Image className="text-pink-400" />
          Dev OG Image Gen
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Generate stunning social media preview images for your developer projects.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                Project Title
                <Tooltip text="The main name of your repository or app." />
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AllNoop"
                className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                Tagline / Subtitle
                <Tooltip text="A short description of what it does." />
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Automate the boring parts of dev life."
                className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                Tech Stack
                <Tooltip text="Key technologies to highlight (React, Go, AI)." />
              </label>
              <input
                type="text"
                value={tech}
                onChange={(e) => setTech(e.target.value)}
                placeholder="e.g. React, Tailwind, Gemini AI"
                className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !title}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Image size={20} />}
              {loading ? "Generating Image..." : "Generate OG Image"}
            </button>
          </div>

          <div className="p-4 bg-dark-950/50 border border-dark-700 rounded-xl flex items-center gap-3">
             <Github className="text-slate-500" />
             <p className="text-xs text-slate-500 italic">
               Perfect for <code>og:image</code> tags in your <code>index.html</code>.
             </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[300px]">
            <div className="px-4 py-3 bg-dark-700 border-b border-dark-600 flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Preview (16:9)</span>
              {imageUrl && (
                <button 
                  onClick={handleDownload}
                  className="text-xs flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <Download size={14} /> Download PNG
                </button>
              )}
            </div>
            <div className="flex-1 bg-dark-950 flex items-center justify-center p-4 relative">
              {loading ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-pink-400 font-mono animate-pulse">Rendering Pixel Perfection...</p>
                </div>
              ) : imageUrl ? (
                <img src={imageUrl} alt="Generated OG Image" className="max-w-full h-auto rounded-lg shadow-2xl" />
              ) : (
                <div className="text-center space-y-2">
                   <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto text-dark-600 border border-dark-700">
                     <Image size={40} />
                   </div>
                   <p className="text-slate-600 italic">Your masterpiece will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OgImageGen;
