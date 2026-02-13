import React, { useState } from 'react';
import { Copy, Check, Save, Sparkles, Loader2, ExternalLink, ArrowRight, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  // Find the full model object to access sources
  const currentModel = TARGET_MODELS.find(m => m.name === targetModelName);

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = () => {
    if (!prompt.trim()) return;
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `ericmartin-prompt-${dateStr}.txt`;
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

  return (
    <div className="flex flex-col flex-1 w-full pt-8 pb-12 h-full animate-in">
      
      {/* Header / Meta */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 border-b border-border pb-4 gap-4">
        <div>
            <h3 className="font-serif italic text-2xl text-text mb-2">Operational Syntax</h3>
            <div className="flex items-center gap-3 text-xs text-muted font-sans">
                <span className="uppercase tracking-widest">Target:</span>
                <span className="text-sage font-medium">{targetModelName}</span>
                <span className="text-border">|</span>
                <span className="uppercase tracking-widest">{isDeepMode ? 'Deep Analysis' : 'Fast Mode'}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-6">
             <button
                onClick={onOptimize}
                disabled={isLoading}
                className="text-[10px] uppercase tracking-widest font-semibold text-muted hover:text-sage transition-colors flex items-center gap-2"
            >
                {isLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCcw size={12} />}
                <span>Regenerate</span>
            </button>

            <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="text-[10px] uppercase tracking-widest font-semibold text-muted hover:text-text transition-colors"
            >
                {isPreviewMode ? 'View Raw' : 'View Preview'}
            </button>
            
            <button 
                onClick={handleCopyPrompt}
                className="text-[10px] uppercase tracking-widest font-semibold text-sage hover:text-white transition-colors flex items-center gap-2"
            >
                {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
                <span>Copy to Clipboard</span>
            </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-[500px]">
          
          {/* Main Content (Prompt) */}
          <div className="flex-1 flex flex-col">
            <div className={`flex-1 relative border border-border bg-surface/50 p-8 overflow-hidden transition-all duration-500 ${isDeepMode ? 'border-sage/20' : ''}`}>
                 {/* Decorative Line */}
                 <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-sage to-transparent opacity-50"></div>
                 
                 <div className="h-full w-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {isPreviewMode ? (
                        <div className="prose prose-invert prose-p:font-light prose-p:leading-loose prose-headings:font-serif prose-headings:font-normal prose-code:text-sage prose-pre:bg-background prose-pre:border prose-pre:border-border max-w-none">
                            <ReactMarkdown>{prompt}</ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            value={prompt}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full h-full bg-transparent text-text font-mono text-sm leading-relaxed resize-none focus:outline-none"
                            spellCheck={false}
                        />
                    )}
                 </div>
            </div>
            
            {/* Action Footer for Main Content */}
            <div className="mt-4 flex justify-between items-center">
                 <div className="flex gap-4">
                     {currentModel?.sources?.map((source, i) => (
                         <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-muted hover:text-sage transition-colors uppercase tracking-wider">
                             Documentation <ExternalLink size={8} />
                         </a>
                     ))}
                 </div>
                 <button onClick={handleDownload} className="text-muted hover:text-text transition-colors">
                     <Save size={14} />
                 </button>
            </div>
          </div>

          {/* Sidebar (Explanation) */}
          {explanation && (
              <div className="lg:w-80 shrink-0 border-l border-border pl-8 py-2 flex flex-col">
                  <h4 className="font-serif italic text-lg text-text mb-4">Analysis</h4>
                  <div className="text-sm font-light text-muted leading-relaxed space-y-4">
                      <ReactMarkdown 
                        components={{
                            p: ({node, ...props}) => <p className="mb-4" {...props} />,
                            strong: ({node, ...props}) => <span className="text-sage font-medium" {...props} />
                        }}
                      >
                          {explanation}
                      </ReactMarkdown>
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-border/50">
                      <div className="text-[10px] uppercase tracking-widest text-muted mb-2">System Status</div>
                      <div className="flex items-center gap-2 text-xs text-sage">
                          <div className="w-1.5 h-1.5 bg-sage rounded-full"></div>
                          <span>Optimization Complete</span>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};