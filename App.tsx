import React, { useState } from 'react';
import { TARGET_MODELS } from './constants';
import { TargetModel } from './types';
import { ModelSelector } from './components/ModelSelector';
import { FloatingInput } from './components/FloatingInput';
import { OutputArea } from './components/OutputArea';
import { optimizePrompt } from './services/geminiService';
import { Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [selectedModel, setSelectedModel] = useState<TargetModel>(TARGET_MODELS[0]); // Default to Gemini
  const [optimizedPrompt, setOptimizedPrompt] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOptimization = async (inputPrompt: string) => {
    if (!inputPrompt.trim()) return;
    
    setIsLoading(true);
    setExplanation(''); // Clear previous explanation
    try {
      const result = await optimizePrompt(inputPrompt, selectedModel.id);
      setOptimizedPrompt(result.optimizedPrompt);
      setExplanation(result.explanation);
    } catch (error) {
      console.error(error);
      // In a real app, toast notification here
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
             <span>Pr0mptim1zer</span>
          </div>
          <div className="h-4 w-px bg-zinc-700 mx-2 hidden sm:block"></div>
          <ModelSelector 
            selectedModel={selectedModel} 
            onSelect={setSelectedModel} 
          />
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