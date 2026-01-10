import React, { useState } from 'react';
import { TARGET_MODELS } from './constants';
import { TargetModel } from './types';
import { ModelSelector } from './components/ModelSelector';
import { FloatingInput } from './components/FloatingInput';
import { OutputArea } from './components/OutputArea';
import { optimizePrompt } from './services/geminiService';
import { Sparkles, Terminal, BrainCircuit } from 'lucide-react';

export default function App() {
  const [selectedModel, setSelectedModel] = useState<TargetModel>(TARGET_MODELS[0]); // Default to ChatGPT
  const [optimizedPrompt, setOptimizedPrompt] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepMode, setIsDeepMode] = useState(false);

  const handleOptimization = async (inputPrompt: string) => {
    if (!inputPrompt.trim()) return;
    
    setIsLoading(true);
    setExplanation(''); // Clear previous explanation
    try {
      // Pass the deep mode flag to the service
      const result = await optimizePrompt(inputPrompt, selectedModel.id, isDeepMode);
      setOptimizedPrompt(result.optimizedPrompt);
      setExplanation(result.explanation);
    } catch (error) {
      console.error(error);
      setOptimizedPrompt((prev) => prev ? prev + `\n\nError: ${error instanceof Error ? error.message : 'Something went wrong.'}` : `Error: ${error instanceof Error ? error.message : 'Something went wrong.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-zinc-100 overflow-hidden font-sans">
      
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-zinc-800/50 flex items-center justify-between px-4 sm:px-6 bg-background/50 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-zinc-100 font-bold text-lg tracking-tight">
             <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <Sparkles size={16} className="text-white fill-white" />
             </div>
             <span className="hidden sm:inline">Pr0mptim1zer</span>
          </div>
          <div className="h-4 w-px bg-zinc-700 mx-2 hidden sm:block"></div>
          
          <ModelSelector 
            selectedModel={selectedModel} 
            onSelect={setSelectedModel} 
          />

          <div className="h-4 w-px bg-zinc-700 mx-2 hidden sm:block"></div>
          
          {/* Deep Mode Toggle */}
          <button
            onClick={() => setIsDeepMode(!isDeepMode)}
            className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
              isDeepMode 
                ? 'bg-purple-900/20 border-purple-500/50 text-purple-300 hover:bg-purple-900/30' 
                : 'bg-zinc-900/50 border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
            }`}
            title="Deep Optimization Mode (Double-pass Critique)"
          >
             <BrainCircuit size={14} className={`transition-colors ${isDeepMode ? 'text-purple-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
             <span className="text-xs font-medium">Deep Mode</span>
             <div className={`w-2 h-2 rounded-full transition-colors ${isDeepMode ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-zinc-700'}`} />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
            <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:block">
                <Terminal size={20} />
            </a>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-400">
                AI
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        
        {/* The Output/Editor Area fills the available space */}
        <div className="flex-grow overflow-y-auto">
            <OutputArea 
                prompt={optimizedPrompt} 
                explanation={explanation}
                onChange={setOptimizedPrompt}
                targetModelName={selectedModel.name}
                onOptimize={() => handleOptimization(optimizedPrompt)}
                isLoading={isLoading}
                isDeepMode={isDeepMode}
            />
        </div>

        {/* The Input Bar sits at the bottom, above the fold */}
        <div className="shrink-0 w-full z-20 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
            <FloatingInput 
                onSubmit={handleOptimization} 
                isLoading={isLoading} 
            />
        </div>
      </main>
    </div>
  );
}