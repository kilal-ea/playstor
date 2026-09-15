import React from 'react';
import { AlertTriangle, Clock, RefreshCw, WifiOff, XCircle } from 'lucide-react';
import { ErrorStateInfo } from '../types';

interface ErrorStateProps {
  error: ErrorStateInfo;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  // Select contextual icon based on error type
  const renderIcon = () => {
    switch (error.type) {
      case 'NO_REWARDS':
        return (
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
        );
      case 'SESSION_EXPIRED':
        return (
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 shadow-sm">
            <Clock className="w-8 h-8" />
          </div>
        );
      case 'NETWORK_ERROR':
        return (
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-sm">
            <WifiOff className="w-8 h-8" />
          </div>
        );
      case 'UNAUTHORIZED':
        return (
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200/80 flex items-center justify-center text-red-600 shadow-sm">
            <XCircle className="w-8 h-8" />
          </div>
        );
      case 'API_ERROR':
      default:
        return (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 shadow-xl text-center space-y-4 animate-fade-in">
      <div className="flex justify-center">{renderIcon()}</div>

      <div className="space-y-1.5">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {error.title}
        </h3>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          {error.message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-play-blue-600 hover:bg-play-blue-700 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-play-blue-600/20 transition-all inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{error.actionText || 'Try Again'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
