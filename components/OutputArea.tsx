import React, { useState } from 'react';
import { Copy, Check, Save, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { TARGET_MODELS } from '../constants';

interface OutputAreaProps {
  prompt: string;
  explanation?: string;
  onChange: (text: string) => void;
  targetModelName: string;
  onOptimize: () => void;
  isLoading: boolean;
}

export const OutputArea: React.FC<OutputAreaProps> = ({ 
  prompt, 
  explanation, 
  onChange, 
  targetModelName,
  onOptimize,
  isLoading
}) => {
  const [copied, setCopied] = useState(false);

  // Find the full model object to access sources
  const currentModel = TARGET_MODELS.find(m => m.name === targetModelName);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm
                ${!prompt.trim() || isLoading 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                }`}
            >
               {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
               <span>Optimize</span>
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
                className="flex items-center space-x-2 bg-transparent hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded-md text-sm transition-colors"
                title="Save to history"
            >
                <Save size={14} />
            </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-grow relative bg-surface border border-zinc-800 rounded-lg overflow-hidden flex flex-col shadow-inner focus-within:ring-1 focus-within:ring-zinc-700 transition-all">
        {explanation && (
             <div className="bg-emerald-900/20 border-b border-emerald-900/50 px-4 py-2 text-xs text-emerald-400 font-mono">
                Running optimization: {explanation}
             </div>
        )}
        <textarea
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent p-6 text-zinc-200 font-mono text-sm sm:text-base resize-none focus:outline-none leading-relaxed placeholder-zinc-600"
          placeholder={`Paste your prompt here, add any specific instructions, then click "Optimize" above.\n\nOr use the bar below to describe a new use case from scratch.`}
          spellCheck={false}
        />
      </div>
    </div>
  );
};