import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { TargetModel } from '../types';
import { TARGET_MODELS } from '../constants';

interface ModelSelectorProps {
  selectedModel: TargetModel;
  onSelect: (model: TargetModel) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Group models by category
  const groupedModels = useMemo<Record<string, TargetModel[]>>(() => {
    const groups: Record<string, TargetModel[]> = {};
    TARGET_MODELS.forEach(model => {
      if (!groups[model.category]) {
        groups[model.category] = [];
      }
      groups[model.category].push(model);
    });
    return groups;
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-surface hover:bg-zinc-800 text-zinc-300 font-medium py-2 px-3 rounded-md text-sm transition-colors border border-transparent hover:border-zinc-700"
      >
        <span className="text-secondary hidden sm:inline">Optimize for</span>
        <span className="text-white flex items-center gap-2">
           {selectedModel.name}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 max-h-[80vh] overflow-y-auto bg-surface border border-border rounded-lg shadow-xl z-50 ring-1 ring-black ring-opacity-5">
          <div className="py-2">
            {Object.entries(groupedModels).map(([category, models]) => (
              <div key={category} className="mb-2 last:mb-0">
                <div className="px-4 py-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-900/50 sticky top-0 backdrop-blur-sm z-10">
                  {category}
                </div>
                {(models as TargetModel[]).map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelect(model);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 flex items-start space-x-3 hover:bg-zinc-800 transition-colors group"
                  >
                    <div className={`mt-0.5 ${model.id === selectedModel.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                      <Check size={16} className="text-emerald-500" />
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${model.id === selectedModel.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                        {model.name}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                        {model.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};