import React, { useState, useEffect, useRef } from 'react';
import { optimizePrompt } from './services/geminiService';
import { TargetModelId } from './types';
import { ArrowRight, Sparkles, Copy, Check, RotateCcw, PenLine } from 'lucide-react';

// --- Types ---
type Step = 1 | 2 | 3 | 4;

interface ModelOption {
  id: TargetModelId;
  label: string;
  desc: string;
  keywords: string[];
}

// --- Configuration ---
const MODEL_OPTIONS: ModelOption[] = [
  { 
    id: TargetModelId.GPT_5_2, 
    label: 'ChatGPT', 
    desc: 'General purpose flagship. Natural conversation.',
    keywords: [] // Default fallback
  },
  { 
    id: TargetModelId.CLAUDE_SONNET_4_5, 
    label: 'Claude', 
    desc: 'Complex reasoning & clean code generation.',
    keywords: ['code', 'function', 'react', 'bug', 'typescript', 'java', 'programming'] 
  },
  { 
    id: TargetModelId.GEMINI_3_PRO, 
    label: 'Gemini', 
    desc: 'Multimodal capabilities & creative writing.',
    keywords: ['image', 'photo', 'svg', 'creative', 'story', 'write'] 
  },
  { 
    id: TargetModelId.COPILOT_PRO, 
    label: 'Copilot', 
    desc: 'Web search & Microsoft ecosystem integration.',
    keywords: ['search', 'news', 'recent', 'word', 'excel', 'outlook'] 
  }
];

export default function App() {
  // --- State ---
  const [step, setStep] = useState<Step>(1);
  const [inputPrompt, setInputPrompt] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [selectedModelId, setSelectedModelId] = useState<TargetModelId>(TargetModelId.GPT_5_2);
  const [optimizedResult, setOptimizedResult] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // --- Logic ---

  // Auto-resize textareas
  const adjustHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Step 2 Logic: Determine label based on complexity
  const getContextLabel = () => {
    const complexityCheck = inputPrompt.includes(':') || inputPrompt.includes('-') || inputPrompt.length > 100;
    return complexityCheck 
      ? "Anything you want to change or emphasize?" 
      : "Any constraints, context, or examples that would help?";
  };

  // Step 3 Logic: Smart Defaults
  useEffect(() => {
    if (step === 3) {
      const combinedText = (inputPrompt + ' ' + contextInput).toLowerCase();
      const match = MODEL_OPTIONS.find(m => m.keywords.some(k => combinedText.includes(k)));
      if (match) {
        setSelectedModelId(match.id);
      } else {
        setSelectedModelId(TargetModelId.GPT_5_2);
      }
    }
  }, [step, inputPrompt, contextInput]);

  const handleOptimization = async (isDeepMode: boolean = false) => {
    setIsLoading(true);
    try {
      const fullInput = contextInput.trim() 
        ? `${inputPrompt}\n\n[CONTEXT/CONSTRAINTS]: ${contextInput}` 
        : inputPrompt;

      const result = await optimizePrompt(fullInput, selectedModelId, isDeepMode);
      setOptimizedResult(result.optimizedPrompt);
      setExplanation(result.explanation);
      setStep(4);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimizedResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const resetFlow = () => {
    setStep(1);
    setInputPrompt('');
    setContextInput('');
    setOptimizedResult('');
    setExplanation('');
  };

  // --- Components ---

  const ButtonPrimary = ({ onClick, disabled, children, icon: Icon }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative flex items-center justify-center space-x-2 w-full py-4 px-6 rounded-[4px] font-sans font-medium text-[15px] transition-all duration-200
        ${disabled 
          ? 'bg-line text-muted cursor-not-allowed' 
          : 'bg-ink text-white hover:bg-black active:transform active:scale-[0.99] shadow-soft'}
      `}
    >
      <span>{children}</span>
      {Icon && <Icon size={16} className="transition-transform group-hover:translate-x-1" />}
    </button>
  );

  const ButtonText = ({ onClick, children }: any) => (
    <button 
      onClick={onClick}
      className="text-subtle hover:text-ink text-sm font-sans font-medium underline decoration-line hover:decoration-subtle underline-offset-4 transition-all"
    >
      {children}
    </button>
  );

  const Label = ({ children }: any) => (
    <h2 className="font-serif font-medium text-2xl text-ink leading-tight mb-6">
      {children}
    </h2>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-3 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <React.Fragment key={s}>
          <div 
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${s === step ? 'bg-ink scale-110' : s < step ? 'bg-ink' : 'bg-line'}
            `} 
          />
          {s < 4 && (
            <div 
              className={`
                w-12 h-[1px] transition-colors duration-300
                ${s < step ? 'bg-ink' : 'bg-line'}
              `} 
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // --- Render Steps ---

  const renderStep1 = () => (
    <div className="animate-enter w-full max-w-[640px]">
      <Label>Paste your prompt — or describe what you need.</Label>
      <textarea
        autoFocus
        value={inputPrompt}
        onChange={(e) => {
          setInputPrompt(e.target.value);
          adjustHeight(e);
        }}
        placeholder="What would you like to build, write, or solve today?"
        className="w-full bg-white border border-line rounded-[4px] p-6 text-lg font-sans text-ink placeholder:text-muted resize-none min-h-[160px] shadow-sm focus:border-subtle transition-colors mb-4"
      />
      <p className="text-[13px] text-[#888888] font-sans mb-8 text-center leading-relaxed">
        Paste an existing prompt to refine it, or create or describe a new one from scratch.
      </p>
      
      <StepIndicator />

      <div className="flex justify-center">
        <div className="w-full sm:w-auto min-w-[200px]">
          <ButtonPrimary 
            onClick={() => setStep(2)} 
            disabled={!inputPrompt.trim()}
            icon={ArrowRight}
          >
            Continue
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-enter w-full max-w-[640px]">
      <Label>{getContextLabel()}</Label>
      <textarea
        autoFocus
        value={contextInput}
        onChange={(e) => {
          setContextInput(e.target.value);
          adjustHeight(e);
        }}
        placeholder="Optional. Add context, tone preferences, or specific constraints..."
        className="w-full bg-white border border-line rounded-[4px] p-6 text-lg font-sans text-ink placeholder:text-muted resize-none min-h-[160px] mb-8 shadow-sm focus:border-subtle transition-colors"
      />
      
      <StepIndicator />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <ButtonText onClick={() => setStep(3)}>Skip this step</ButtonText>
        <div className="w-full sm:w-auto min-w-[160px]">
          <ButtonPrimary 
            onClick={() => setStep(3)}
            icon={ArrowRight}
          >
            Continue
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-enter w-full max-w-[500px]">
      <div className="mb-8 text-center">
        <h2 className="font-serif font-medium text-2xl text-ink mb-2">Select Target Model</h2>
        <p className="font-sans text-muted text-sm">We've suggested a model based on your input.</p>
      </div>

      <div className="space-y-3 mb-10">
        {MODEL_OPTIONS.map((model) => {
          const isSelected = selectedModelId === model.id;
          
          return (
            <label 
              key={model.id}
              className={`
                group relative flex items-start p-4 rounded-[4px] border cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'bg-white border-ink shadow-soft z-10' 
                  : 'bg-transparent border-line hover:border-gray-300'}
              `}
            >
              <input
                type="radio"
                name="model"
                value={model.id}
                checked={isSelected}
                onChange={() => setSelectedModelId(model.id)}
                className="mt-1 w-4 h-4 border-line text-ink focus:ring-ink"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-serif font-medium ${isSelected ? 'text-ink' : 'text-subtle'}`}>
                    {model.label}
                  </span>
                </div>
                <p className="text-sm font-sans text-muted mt-0.5 leading-relaxed">{model.desc}</p>
              </div>
            </label>
          );
        })}
      </div>

      <StepIndicator />

      <ButtonPrimary 
        onClick={() => handleOptimization(false)} 
        disabled={isLoading}
        icon={isLoading ? null : Sparkles}
      >
        {isLoading ? 'Optimizing...' : 'Optimize Prompt'}
      </ButtonPrimary>
      
      {isLoading && (
        <div className="mt-6 flex justify-center">
          <div className="w-1.5 h-1.5 bg-ink rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-ink rounded-full animate-bounce mx-1 [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-ink rounded-full animate-bounce"></div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="animate-enter w-full max-w-[640px]">
      <div className="flex items-center justify-between mb-4">
        <span className="font-sans text-[11px] uppercase tracking-widest text-muted font-semibold">Optimized Prompt</span>
        <button 
          onClick={copyToClipboard}
          className="flex items-center space-x-1.5 text-xs font-sans font-medium text-ink hover:text-subtle transition-colors"
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
          <span>{isCopied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="relative group">
        <textarea
          value={optimizedResult}
          onChange={(e) => {
             setOptimizedResult(e.target.value);
             adjustHeight(e);
          }}
          className="w-full bg-white border border-line rounded-[4px] p-8 text-lg font-serif text-ink leading-loose shadow-sm focus:border-subtle transition-colors min-h-[200px]"
        />
      </div>

      {explanation && (
        <div className="mt-6 p-6 bg-[#f2f2f0] rounded-[4px] border border-transparent">
          <div className="flex items-start gap-3">
             <div className="mt-1 min-w-4 text-subtle"><PenLine size={14}/></div>
             <p className="font-sans text-sm text-subtle leading-relaxed">
               {explanation.replace('[Deep Mode]', '').trim()}
               {explanation.includes('[Deep Mode]') && <span className="ml-2 inline-block w-1.5 h-1.5 bg-ink rounded-full align-middle" title="Deep Mode Active"></span>}
             </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <StepIndicator />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleOptimization(true)}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-[4px] border border-line bg-white hover:bg-gray-50 text-ink font-sans text-sm font-medium transition-colors"
        >
           {isLoading ? <span>Refining...</span> : (
             <>
               <Sparkles size={14} />
               <span>Refine Again</span>
             </>
           )}
        </button>
        <button
          onClick={resetFlow}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-[4px] border border-transparent text-muted hover:text-ink font-sans text-sm font-medium transition-colors"
        >
           <RotateCcw size={14} />
           <span>Start Over</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center pt-[12vh] pb-20 px-6 sm:px-8 selection:bg-ink selection:text-white">
      {/* Header / Brand */}
      <div className={`mb-12 transition-all duration-500 ${step === 4 ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100'}`}>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Promptimizer.</h1>
      </div>

      {/* Main Content Area */}
      <main className="w-full flex justify-center">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </main>

      {/* Footer / Credits */}
      {step !== 4 && (
        <footer className="fixed bottom-8 text-center w-full pointer-events-none">
          <p className="font-sans text-[11px] text-gray-300 tracking-wide uppercase">
            Confidence through restraint
          </p>
        </footer>
      )}
    </div>
  );
}