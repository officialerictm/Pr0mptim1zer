import React, { useState } from 'react';
import { Copy, Check, Save, Sparkles, Loader2, ExternalLink, BrainCircuit } from 'lucide-react';
import { TARGET_MODELS } from '../constants';

interface OutputAreaProps {
  prompt: string;
  explanation?: string;
  onChange: (text: string) => void;
  targetModelName: string;
  onOptimize: () => void;
  isLoading: boolean;
  isDeepMode: boolean;
}

export const OutputArea: React.FC<OutputAreaProps> = ({ 
  prompt, 
  explanation, 
  onChange, 
  targetModelName,
  onOptimize,
  isLoading,
  isDeepMode
}) => {
  const [copied, setCopied] = useState(false);

  // Find the full model object to access sources
  const currentModel = TARGET_MODELS.find(m => m.name === targetModelName);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!prompt.trim()) return;
    
    // Create a descriptive filename: prompt-[model]-[date]-[snippet].txt
    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanModel = targetModelName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    // Take first 20 chars of prompt, sanitizing for filename safety
    const snippet = prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
    
    const fileName = `prompt-${cleanModel}-${dateStr}-${snippet}.txt`;
    
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Dynamic button styles based on Deep Mode
  const buttonBaseClass = "flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm";
  const buttonActiveState = isDeepMode 
    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20' 
    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20';
    
  const buttonDisabledState = 'bg-zinc-800 text-zinc-500 cursor-not-allowed';

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto pt-4 pb-4 px-4 sm:px-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
        <div className="flex flex-col">
            <div className="text-sm font-medium text-zinc-400 flex items-center">
            Editor <span className="text-zinc-600 px-2">•</span> <span className={`font-semibold ${currentModel?.color || 'text-zinc-200'}`}>{targetModelName}</span>
            </div>
            {currentModel && currentModel.sources && currentModel.sources.length > 0 && (
            <div className="text-[10px] text-zinc-600 mt-1 flex flex-wrap items-center gap-1">
                Optimization parameters derived from
                {currentModel.sources.map((source, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span>,</span>}
                        <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-zinc-300 hover:underline flex items-center gap-0.5 ml-1 transition-colors"
                        >
                            {source.title} <ExternalLink size={8} />
                        </a>
                    </React.Fragment>
                ))}
            </div>
            )}
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onOptimize}
              disabled={!prompt.trim() || isLoading}
              className={`${buttonBaseClass} ${!prompt.trim() || isLoading ? buttonDisabledState : buttonActiveState}`}
            >
               {isLoading ? (
                  <Loader2 size={14} className="animate-spin" />
               ) : isDeepMode ? (
                  <BrainCircuit size={14} /> 
               ) : (
                  <Sparkles size={14} />
               )}
               <span>{isDeepMode ? 'Deep Optimize' : 'Optimize'}</span>
            </button>

            <div className="h-4 w-px bg-zinc-700 mx-1"></div>

            <button 
                onClick={handleCopy}
                className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md text-sm transition-colors"
                title="Copy to clipboard"
            >
                {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
             <button 
                onClick={handleDownload}
                disabled={!prompt.trim()}
                className={`flex items-center space-x-2 bg-transparent hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded-md text-sm transition-colors ${!prompt.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Save to txt file"
            >
                <Save size={14} />
            </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-grow relative bg-surface border border-zinc-800 rounded-lg overflow-hidden flex flex-col shadow-inner focus-within:ring-1 focus-within:ring-zinc-700 transition-all">
        {explanation && (
             <div className={`border-b px-4 py-2 text-xs font-mono transition-colors ${
                 isDeepMode 
                 ? 'bg-purple-900/20 border-purple-900/50 text-purple-300' 
                 : 'bg-emerald-900/20 border-emerald-900/50 text-emerald-400'
             }`}>
                {explanation}
             </div>
        )}
        <textarea
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent p-6 text-zinc-200 font-mono text-sm sm:text-base resize-none focus:outline-none leading-relaxed placeholder-zinc-600"
          placeholder={`Paste your prompt here, add any specific instructions, then click "${isDeepMode ? 'Deep Optimize' : 'Optimize'}" above.\n\nOr use the bar below to describe a new use case from scratch.`}
          spellCheck={false}
        />
      </div>
    </div>
  );
};