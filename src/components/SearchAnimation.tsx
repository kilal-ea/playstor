import React from 'react';
import { Loader2 } from 'lucide-react';

interface SearchAnimationProps {
  statusText: string;
}

export const SearchAnimation: React.FC<SearchAnimationProps> = ({ statusText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 space-y-4 animate-fade-in text-center">
      {/* Animated Spinner with pulse ring */}
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-play-blue-100 animate-ping opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-play-blue-600 animate-spin" />
        </div>
      </div>

      {/* Dynamic Searching message */}
      <div className="space-y-1.5">
        <p className="text-base sm:text-lg font-semibold text-slate-800 transition-all duration-300">
          {statusText}
        </p>
        <div className="flex items-center justify-center gap-1.5 text-play-blue-600" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-play-blue-600 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-play-blue-600 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-play-blue-600 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
