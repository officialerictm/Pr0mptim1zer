import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface FloatingInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (isLoading || !text.trim()) return;
    onSubmit(text);
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`
          relative border-b transition-all duration-500 ease-out
          ${isFocused ? 'border-sage' : 'border-border'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your use case..."
          className="w-full bg-transparent text-text placeholder-muted/50 px-0 py-4 text-xl sm:text-2xl font-sans font-light resize-none focus:outline-none max-h-[300px] overflow-y-auto"
          rows={1}
          disabled={isLoading}
        />
        
        <div className="absolute right-0 bottom-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !text.trim()}
            className={`
              flex items-center gap-2 text-xs uppercase tracking-widest font-semibold transition-all duration-300
              ${text.trim() && !isLoading ? 'text-sage hover:text-white translate-x-0' : 'text-border cursor-default translate-x-2 opacity-0'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">Processing <Loader2 size={12} className="animate-spin"/></span>
            ) : (
              <span className="flex items-center gap-2">Initialize <ArrowRight size={12} /></span>
            )}
          </button>
        </div>
      </div>
      
      {/* Helper text appearing only when focused or text present to keep it minimal */}
      <div className={`mt-4 transition-opacity duration-500 ${isFocused || text ? 'opacity-100' : 'opacity-0'}`}>
         <p className="text-xs text-muted font-sans">
           Press <span className="text-sage">Enter</span> to generate. Shift + Enter for new line.
         </p>
      </div>
    </div>
  );
};