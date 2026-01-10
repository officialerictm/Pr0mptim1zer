import React, { useState } from 'react';
import { Copy, Check, Save, Sparkles, Loader2, ExternalLink, BrainCircuit, MessageSquareText } from 'lucide-react';
import { TARGET_MODELS } from '../constants';

interface OutputAreaProps {
  prompt: string;
  explanation?: string;
  onChange: (text: string) => void;
  targetModelName: string;
  onOptimize: () => void;
  isLoading: boolean;
  isDeepMode: boolean;
  generationId?: number;
}

export const OutputArea: React.FC<OutputAreaProps> = ({ 
  prompt, 
  explanation, 
  onChange, 
  targetModelName,
  onOptimize,
  isLoading,
  isDeepMode,
  generationId = 0
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedExplanation, setCopiedExplanation] = useState(false);

  // Find the full model object to access sources
  const currentModel = TARGET_MODELS.find(m => m.name === targetModelName);

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyExplanation = async () => {
    if (!explanation) return;
    await navigator.clipboard.writeText(explanation);
    setCopiedExplanation(true);
    setTimeout(() => setCopiedExplanation(false), 2000);
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
      {/* Animation Styles */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-result {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes borderPulse {
          0% { border-color: rgba(168, 85, 247, 0.3); box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
          50% { border-color: rgba(168, 85, 247, 0.6); box-shadow: 0 0 15px 1px rgba(168, 85, 247, 0.15); }
          100% { border-color: rgba(168, 85, 247, 0.3); box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
        }
        .deep-mode-active {
          animation: borderPulse 3s infinite ease-in-out;
        }
      `}</style>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
        <div className="flex flex-col">
            <div className="text-sm font-medium text-zinc-400 flex items-center">
            Editor <span className="text-zinc-600 px-2">•</span> <span className={`font-semibold ${currentModel?.color || 'text-zinc-200'}`}>{targetModelName}</span>
            </div>
            {currentModel && currentModel.sources && currentModel.sources.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Source:</span>
                {currentModel.sources.map((source, index) => (
                    <a 
                        key={index}
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 text-[10px] text-zinc-500 hover:text-zinc-300 px-2 py-0.5 rounded-full transition-all duration-200"
                    >
                        {source.title} <ExternalLink size={8} className="opacity-50 group-hover:opacity-100" />
                    </a>
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
                onClick={handleCopyExplanation}
                disabled={!explanation}
                className={`flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md text-sm transition-colors ${!explanation ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Copy explanation"
            >
                {copiedExplanation ? <Check size={14} /> : <MessageSquareText size={14} />}
            </button>

            <button 
                onClick={handleCopyPrompt}
                className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md text-sm transition-colors"
                title="Copy prompt"
            >
                {copiedPrompt ? <Check size={14} /> : <Copy size={14} />}
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
      <div className={`
        flex-grow relative rounded-xl overflow-hidden flex flex-col transition-all duration-500 border
        ${isDeepMode 
          ? 'bg-[#0e0e11] border-purple-500/30 deep-mode-active' 
          : 'bg-[#121214] border-zinc-800 focus-within:border-zinc-700 focus-within:shadow-2xl shadow-lg'
        }
      `}>
        <div 
           key={generationId} 
           className={`flex flex-col h-full w-full ${generationId > 0 ? 'animate-result' : ''}`}
        >
          {explanation && (
              <div className={`border-b px-5 py-3 text-xs font-mono transition-colors flex items-start gap-2 ${
                  isDeepMode 
                  ? 'bg-purple-900/10 border-purple-500/20 text-purple-300' 
                  : 'bg-emerald-900/10 border-emerald-500/20 text-emerald-400'
              }`}>
                  <div className="shrink-0 mt-0.5">
                     {isDeepMode ? <BrainCircuit size={12} /> : <Sparkles size={12} />}
                  </div>
                  <span className="leading-relaxed">{explanation}</span>
              </div>
          )}
          <textarea
            value={prompt}
            onChange={(e) => onChange(e.target.value)}
            className={`
                w-full h-full bg-transparent p-6 text-zinc-100 font-mono text-sm sm:text-base resize-none focus:outline-none leading-loose placeholder-zinc-700
                ${isDeepMode ? 'selection:bg-purple-500/30 selection:text-purple-100' : 'selection:bg-emerald-500/30 selection:text-emerald-100'}
            `}
            placeholder={`Paste your prompt here, add any specific instructions, then click "${isDeepMode ? 'Deep Optimize' : 'Optimize'}" above.\n\nOr use the bar below to describe a new use case from scratch.`}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};