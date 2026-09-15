import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 animate-fade-in text-center">
      <Loader2 className="w-9 h-9 text-play-blue-600 animate-spin" />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
};
