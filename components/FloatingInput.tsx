import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';

interface FloatingInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (text.trim() && !isLoading) {
      onSubmit(text);
      setText(''); // Optional: clear after submit, or keep it? OpenAI clears it.
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
      }
    }
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
    <div className="w-full max-w-3xl mx-auto mb-6 px-4">
      <div className="relative bg-surface border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your use case, desired behavior, and issues..."
          className="w-full bg-transparent text-zinc-200 placeholder-zinc-500 px-4 py-4 pr-12 text-base resize-none focus:outline-none max-h-[200px] overflow-y-auto font-sans"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute right-2 bottom-2">
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className={`p-2 rounded-xl flex items-center justify-center transition-all duration-200 ${
              text.trim() && !isLoading
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ArrowUp size={18} strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
      <div className="text-center mt-3">
         <p className="text-xs text-zinc-500">
           To apply <span className="underline decoration-zinc-700 cursor-pointer hover:text-zinc-400">best practices</span> for a specific model, select the model top-left and describe your intent.
         </p>
      </div>
    </div>
  );
};