import React, { useState } from 'react';
import { ModelSelector } from './components/ModelSelector';
import { FloatingInput } from './components/FloatingInput';
import { OutputArea } from './components/OutputArea';
import { optimizePrompt } from './services/geminiService';
import { TARGET_MODELS } from './constants';
import { TargetModel } from './types';
import { BrainCircuit, Sparkles, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col">
      {/* --- Header --- */}
      <header className="flex-none h-16 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group" 
            onClick={() => setHasOptimized(false)}
          >
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shadow-lg shadow-white/5 transition-transform group-hover:scale-105">
              <span className="font-serif font-bold text-black text-xl italic">P</span>
            </div>
            <span className="font-serif font-semibold text-lg tracking-tight hidden sm:inline-block">Pr0mptim1zer</span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            
            {/* Deep Mode Toggle */}
            <button
              onClick={() => setIsDeepMode(!isDeepMode)}
              className={`flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${
                isDeepMode 
                  ? 'bg-purple-900/20 border-purple-500/50 text-purple-300' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
              title={isDeepMode ? "Deep Mode: On (Two-pass critique)" : "Deep Mode: Off (Fast)"}
            >
              {isDeepMode ? <BrainCircuit size={14} /> : <Zap size={14} />}
              <span className="hidden sm:inline">{isDeepMode ? 'Deep Mode' : 'Fast Mode'}</span>
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
      <main className="flex-grow flex flex-col relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
           <div className={`absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 transition-colors duration-700 ${isDeepMode ? 'bg-purple-600' : 'bg-emerald-600'}`} />
           <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        {/* View Switcher */}
        {!hasOptimized ? (
          <div className="flex-grow flex flex-col items-center justify-center p-4 animate-enter">
            <div className="mb-8 text-center max-w-xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-serif font-medium mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
                Refine your intent.
              </h1>
              <p className="text-zinc-500 text-lg">
                Select a target model and describe what you need. <br className="hidden sm:block"/>
                We'll engineer the perfect prompt.
              </p>
            </div>
            
            <FloatingInput onSubmit={handleInitialSubmit} isLoading={isLoading} />
            
            <div className="mt-12 flex flex-wrap justify-center gap-6 opacity-40">
               {['Reasoning', 'Coding', 'Creative', 'Data Extraction'].map((tag, i) => (
                 <span key={i} className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">{tag}</span>
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
    </div>
  );
}
