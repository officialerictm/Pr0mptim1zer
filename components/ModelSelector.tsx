import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const advancedRef = useRef<HTMLDivElement>(null);

  // Group models for Advanced View
  const groupedModels = useMemo(() => {
    // Default to chat mode for simplicity in the list, or show all
    const groups: Record<string, TargetModel[]> = {};
    TARGET_MODELS.forEach(model => {
      if (!groups[model.provider]) groups[model.provider] = [];
      groups[model.provider].push(model);
    });
    return groups;
  }, []);

  const handleBrandSelect = (brand: ModelBrand) => {
    const defaultModel = TARGET_MODELS.find(m => m.brand === brand && m.isDefault);
    if (defaultModel) {
      onSelect(defaultModel);
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      // Note: Modal click outside is handled by the backdrop overlay click
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Modal Content JSX
  const advancedModal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-fade" onClick={() => setIsAdvancedOpen(false)} />
      
      <div 
        ref={advancedRef}
        className="relative w-full max-w-lg bg-background border border-border shadow-2xl flex flex-col max-h-[85vh] animate-in"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface shrink-0">
            <span className="font-serif italic text-lg text-text">Select Architecture</span>
            <button onClick={() => setIsAdvancedOpen(false)} className="text-muted hover:text-text transition-colors text-xs uppercase tracking-widest">
                Close
            </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
            {(Object.entries(groupedModels) as [string, TargetModel[]][]).map(([provider, models]) => (
                <div key={provider}>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-sage font-semibold">
                        {provider}
                    </div>
                    <div className="grid gap-2">
                        {models.map(model => (
                            <button
                                key={model.id}
                                onClick={() => { onSelect(model); setIsAdvancedOpen(false); }}
                                className={`w-full text-left p-3 border transition-all duration-300 ${
                                    selectedModel.id === model.id 
                                        ? 'border-sage bg-sage-dim' 
                                        : 'border-border hover:border-muted hover:bg-surface'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`font-serif text-sm ${selectedModel.id === model.id ? 'text-sage' : 'text-text'}`}>
                                        {model.name}
                                    </span>
                                    {selectedModel.id === model.id && <Check size={12} className="text-sage" />}
                                </div>
                                <div className="text-xs text-muted font-sans line-clamp-1">
                                    {model.description}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center space-x-6">
      
      {/* 1. SIMPLE DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-medium text-muted hover:text-text transition-colors"
        >
            <span>Target: <span className="text-sage border-b border-sage/30 pb-0.5">{selectedModel.brand === 'Other' ? selectedModel.name : selectedModel.brand}</span></span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-4 w-48 bg-background border border-border shadow-2xl z-50 animate-in">
            {BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandSelect(brand)}
                className="w-full text-left px-5 py-3 hover:bg-surface transition-colors flex items-center justify-between group"
              >
                <span className={`font-serif text-sm ${selectedModel.brand === brand ? 'text-sage italic' : 'text-muted group-hover:text-text'}`}>
                  {brand}
                </span>
              </button>
            ))}
            <div className="border-t border-border mt-1 pt-1">
                 <button 
                    onClick={() => { setIsDropdownOpen(false); setIsAdvancedOpen(true); }}
                    className="w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest text-muted hover:text-sage hover:bg-surface transition-colors"
                 >
                    Advanced View
                 </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. ADVANCED PANEL (Portal) */}
      {isAdvancedOpen && createPortal(advancedModal, document.body)}
    </div>
  );
};