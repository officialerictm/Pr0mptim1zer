import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Settings2, X, Info } from 'lucide-react';
import { TargetModel, ModelBrand, ModelMode } from '../types';
import { TARGET_MODELS } from '../constants';

interface ModelSelectorProps {
  selectedModel: TargetModel;
  onSelect: (model: TargetModel) => void;
}

const BRANDS: ModelBrand[] = ['ChatGPT', 'Gemini', 'Copilot', 'Claude'];

const ProviderIcon = ({ provider, className = "w-4 h-4" }: { provider: string; className?: string }) => {
  switch (provider) {
    case 'OpenAI':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.0462 6.0462 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9723V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7865a4.4944 4.4944 0 0 1 6.6802 4.6606zm-4.0881-5.8717l-4.7783 2.7582a.7948.7948 0 0 0-.3927.6813v6.7369l-2.02-1.1686a.0757.0757 0 0 1-.0379-.0568v-5.5873a4.4755 4.4755 0 0 1 2.8764-1.0455 4.4565 4.4565 0 0 1 4.3525 3.3282zM18.2982 6l-6.2587 3.6144-6.2587-3.6144L12.0395 2.4z"/>
        </svg>
      );
    case 'Google':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.067-2.067 2.693-5.067 2.693-7.56 0-.747-.067-1.48-.187-2.28l-10.56-.001z"/>
        </svg>
      );
    case 'Anthropic':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
           <path d="M17.863 9.471c.059-.214.285-.291.432-.148l.422.41a.34.34 0 0 0 .584-.236V9.45a.34.34 0 0 0-.106-.245l-4.502-4.382a.34.34 0 0 0-.476 0L9.715 9.205a.34.34 0 0 0-.106.246v.047c0 .13.076.248.196.303l.388.179a.34.34 0 0 0 .445-.11l.053-.082c.15-.23.473-.243.642-.026l1.248 1.604a.34.34 0 0 0 .538 0l1.248-1.604c.169-.217.492-.204.642.026l.053.082c.07.108.192.17.32.164l.432-.02c.214-.01.353-.228.297-.433l-.248-1.11z"/>
           <path d="M6 19a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6zm0-2h12v-4H6v4z" opacity="0.8"/>
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3"/>
        </svg>
      );
    case 'Microsoft':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <rect x="2" y="2" width="9" height="9"/>
          <rect x="13" y="2" width="9" height="9"/>
          <rect x="2" y="13" width="9" height="9"/>
          <rect x="13" y="13" width="9" height="9"/>
        </svg>
      );
    case 'DeepSeek':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 2L2 22h20L12 2zm0 4L18 18H6L12 6z" />
        </svg>
      );
    case 'xAI':
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
            </svg>
        );
    case 'Mistral':
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
                <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        );
    case 'Meta':
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 6.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0-4.5C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 16c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fillRule="evenodd"/>
            </svg>
        );
    default:
      return <div className={`bg-zinc-700 rounded-full ${className}`} />;
  }
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<ModelMode>('chat');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const advancedRef = useRef<HTMLDivElement>(null);

  // Group models for Advanced View
  const groupedModels = useMemo(() => {
    const filtered = TARGET_MODELS.filter(m => m.mode === activeMode);
    const groups: Record<string, TargetModel[]> = {};
    
    // Sort logic: OpenAI, Anthropic, Google, Others
    const providers = ['OpenAI', 'Anthropic', 'Google', 'Microsoft', 'DeepSeek', 'xAI', 'Mistral', 'Meta'];
    
    filtered.forEach(model => {
      if (!groups[model.provider]) groups[model.provider] = [];
      groups[model.provider].push(model);
    });
    
    // Return ordered keys if they exist
    return providers.reduce((acc, provider) => {
      if (groups[provider]) acc[provider] = groups[provider];
      return acc;
    }, {} as Record<string, TargetModel[]>);
  }, [activeMode]);

  // Handle Simple Brand Selection (picks the default model for that brand)
  const handleBrandSelect = (brand: ModelBrand) => {
    const defaultModel = TARGET_MODELS.find(m => m.brand === brand && m.isDefault);
    if (defaultModel) {
      onSelect(defaultModel);
    }
    setIsDropdownOpen(false);
  };

  // Close simple dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center space-x-3">
      
      {/* 1. SIMPLE DROPDOWN (CONSUMER VIEW) */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center space-x-2">
            <span className="text-zinc-500 text-sm hidden sm:inline-block">Optimize for:</span>
            <button
            onClick={() => {
                if (!isAdvancedOpen) setIsDropdownOpen(!isDropdownOpen);
            }}
            disabled={isAdvancedOpen} // Disable simple dropdown if advanced is open
            className={`flex items-center space-x-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-200 font-medium py-1.5 px-3 rounded-md text-sm transition-all min-w-[140px] justify-between
                ${isAdvancedOpen ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            >
            <span className="truncate">
                {selectedModel.brand === 'Other' ? selectedModel.name : selectedModel.brand}
            </span>
            <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>

        {/* Simple Dropdown Menu */}
        {isDropdownOpen && !isAdvancedOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden">
            {BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandSelect(brand)}
                className="w-full text-left px-4 py-2.5 hover:bg-zinc-800 transition-colors flex items-center justify-between text-sm group"
              >
                <span className={`${selectedModel.brand === brand ? 'text-white font-medium' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                  {brand}
                </span>
                {selectedModel.brand === brand && <Check size={14} className="text-emerald-500" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. ADVANCED TOGGLE */}
      <button
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className={`flex items-center space-x-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
            isAdvancedOpen ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Settings2 size={12} />
        <span>Advanced</span>
      </button>

      {/* 3. ADVANCED PANEL (TECHNICAL VIEW) */}
      {isAdvancedOpen && (
        <>
          {/* Backdrop for mobile focus */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] sm:hidden" onClick={() => setIsAdvancedOpen(false)} />
          
          <div 
            ref={advancedRef}
            className="absolute top-16 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/50 rounded-xl shadow-2xl z-50 flex flex-col max-h-[80vh] animate-in fade-in slide-in-from-top-4 duration-200"
          >
            {/* Advanced Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <div className="flex space-x-1 bg-zinc-950/50 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveMode('chat')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            activeMode === 'chat' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-400'
                        }`}
                    >
                        Chat Apps
                    </button>
                    <button
                        onClick={() => setActiveMode('api')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            activeMode === 'api' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-400'
                        }`}
                    >
                        APIs
                    </button>
                </div>
                <button 
                    onClick={() => setIsAdvancedOpen(false)}
                    className="text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Advanced List */}
            <div className="overflow-y-auto p-2 space-y-4">
                {Object.keys(groupedModels).length === 0 && (
                    <div className="p-4 text-center text-zinc-500 text-xs">No models found for this mode.</div>
                )}
                
                {(Object.entries(groupedModels) as [string, TargetModel[]][]).map(([provider, models]) => (
                    <div key={provider}>
                        <div className="px-2 mb-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                            {provider}
                        </div>
                        <div className="space-y-0.5">
                            {models.map(model => (
                                <button
                                    key={model.id}
                                    onClick={() => onSelect(model)}
                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between group transition-all ${
                                        selectedModel.id === model.id 
                                            ? 'bg-emerald-900/10 border border-emerald-900/50' 
                                            : 'hover:bg-zinc-800 border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`shrink-0 transition-colors ${selectedModel.id === model.id ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                                            <ProviderIcon provider={model.provider} className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className={`text-sm ${selectedModel.id === model.id ? 'text-emerald-400 font-medium' : 'text-zinc-300 group-hover:text-white'}`}>
                                                {model.name}
                                            </div>
                                            <div className="text-[10px] text-zinc-500 line-clamp-1">
                                                {model.description}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedModel.id === model.id && <Check size={14} className="text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-3 bg-zinc-950/30 border-t border-zinc-800 text-[10px] text-zinc-500 flex items-center gap-2">
                <Info size={12} />
                <span>Selection adapts optimizer strategy instantly.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};