import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Settings2, X, Info } from 'lucide-react';
import { TargetModel, ModelBrand, ModelMode } from '../types';
import { TARGET_MODELS } from '../constants';

interface ModelSelectorProps {
  selectedModel: TargetModel;
  onSelect: (model: TargetModel) => void;
}

const BRANDS: ModelBrand[] = ['ChatGPT', 'Gemini', 'Copilot', 'Claude'];

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
                                    <div>
                                        <div className={`text-sm ${selectedModel.id === model.id ? 'text-emerald-400 font-medium' : 'text-zinc-300 group-hover:text-white'}`}>
                                            {model.name}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 line-clamp-1">
                                            {model.description}
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