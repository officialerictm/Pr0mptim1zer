import React, { useState } from 'react';
import { ModelSelector } from './components/ModelSelector';
import { FloatingInput } from './components/FloatingInput';
import { OutputArea } from './components/OutputArea';
import { AmbientBackground } from './components/AmbientBackground';
import { optimizePrompt } from './services/geminiService';
import { TARGET_MODELS } from './constants';
import { TargetModel } from './types';
import { Zap, BrainCircuit } from 'lucide-react';

export default function App() {
  // State
  const [selectedModel, setSelectedModel] = useState<TargetModel>(
    TARGET_MODELS.find(m => m.isDefault && m.brand === 'ChatGPT') || TARGET_MODELS[0]
  );
  const [prompt, setPrompt] = useState(''); // Current prompt (being edited or result)
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false); // Mode switch: Input vs Editor
  const [isDeepMode, setIsDeepMode] = useState(false);
  const [generationId, setGenerationId] = useState(0);

  // Determine Ambient Mode
  const ambientMode = isLoading 
    ? 'processing' 
    : hasOptimized 
      ? 'resolved' 
      : 'idle';

  // Core Optimization Logic
  const runOptimization = async (input: string, model: TargetModel, deep: boolean) => {
    setIsLoading(true);
    try {
      const response = await optimizePrompt(input, model.id, deep);
      
      setPrompt(response.optimizedPrompt);
      setExplanation(response.explanation);
      setHasOptimized(true);
      setGenerationId(prev => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Optimization failed. Please check your API key and connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleInitialSubmit = (text: string) => {
    setPrompt(text); // Keep the draft
    runOptimization(text, selectedModel, isDeepMode);
  };

  const handleReOptimize = () => {
    runOptimization(prompt, selectedModel, isDeepMode);
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans flex flex-col selection:bg-sage selection:text-white relative overflow-hidden">
      
      {/* Background Layer */}
      <AmbientBackground mode={ambientMode} />

      {/* --- Header --- */}
      <header className="flex-none border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 sm:py-0 sm:h-24 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          
          {/* Brand Wordmark */}
          <div className="flex flex-col items-center sm:items-start">
            <a 
              href="https://ericmartin.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-2xl text-text tracking-[-0.01em] font-normal hover:text-sage transition-colors duration-300"
            >
              Eric Martin
            </a>
            <button 
              onClick={() => setHasOptimized(false)}
              className="font-sans text-xs uppercase tracking-[0.08em] text-muted mt-1 hover:text-text transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Systems Builder
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-6 sm:gap-8 w-full sm:w-auto">
            
            {/* Deep Mode Toggle - Minimalist Text */}
            <button
              onClick={() => setIsDeepMode(!isDeepMode)}
              className={`text-xs uppercase tracking-widest font-medium transition-colors duration-300 flex items-center gap-2 ${
                isDeepMode ? 'text-sage' : 'text-muted hover:text-text'
              }`}
            >
              <span>{isDeepMode ? 'Deep Analysis' : 'Fast Mode'}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${isDeepMode ? 'bg-sage animate-pulse' : 'bg-border'}`} />
            </button>

            {/* Model Selector */}
            <ModelSelector 
              selectedModel={selectedModel} 
              onSelect={setSelectedModel} 
            />
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-grow flex flex-col relative w-full max-w-7xl mx-auto px-6 sm:px-12 z-10">
        
        {/* View Switcher */}
        {!hasOptimized ? (
          <div className="flex-grow flex flex-col items-center justify-center animate-in pb-12">
            
            <div className="mb-12 mt-12 sm:mt-20 text-center max-w-2xl mx-auto">
              <h2 className="text-5xl sm:text-7xl font-serif italic text-text mb-6 leading-tight">
                Refine your intent.
              </h2>
              <p className="text-muted text-lg font-light leading-relaxed max-w-lg mx-auto">
                Select a target architecture and describe your objective. 
                We will engineer the precise syntax required.
              </p>
            </div>
            
            <FloatingInput onSubmit={handleInitialSubmit} isLoading={isLoading} />
            
            <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4">
               {['Reasoning', 'Coding', 'Creative', 'Data Extraction'].map((tag, i) => (
                 <span key={i} className="text-[10px] uppercase tracking-[0.2em] text-sage font-semibold opacity-80 cursor-default select-none">
                   {tag}
                 </span>
               ))}
            </div>
          </div>
        ) : (
          <OutputArea 
            prompt={prompt}
            explanation={explanation}
            onChange={setPrompt}
            targetModelName={selectedModel.name}
            onOptimize={handleReOptimize}
            isLoading={isLoading}
            isDeepMode={isDeepMode}
            generationId={generationId}
          />
        )}
      </main>
      
      {/* Footer / Copyright */}
      <footer className="py-8 text-center border-t border-border mt-auto z-10 relative">
         <p className="text-[10px] uppercase tracking-widest text-muted">
           © 2026 Eric Martin. Based in Fairborn, Ohio. <span className="mx-2 text-border">|</span> System: Nominal.
         </p>
      </footer>
    </div>
  );
}