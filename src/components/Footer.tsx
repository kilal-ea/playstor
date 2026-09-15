import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FooterProps {
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onOpenPrivacy,
  onOpenContact,
}) => {
  return (
    <footer className="w-full mt-auto border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6 text-center">
        {/* Availability Disclaimer Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs sm:text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Reward supply is strictly limited and subject to real-time verification and database availability.</span>
        </div>

        {/* Legal links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500">
          <button
            type="button"
            onClick={onOpenTerms}
            className="hover:text-play-blue-600 transition-colors"
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="hover:text-play-blue-600 transition-colors"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={onOpenContact}
            className="hover:text-play-blue-600 transition-colors"
          >
            Contact Support
          </button>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="space-y-1 text-xs text-slate-400">
          <p>© 2026 Play Reward. All rights reserved.</p>
          <p className="text-[11px] leading-relaxed max-w-xl mx-auto text-slate-400">
            Google Play and the Google Play logo are trademarks of Google LLC. This platform is an independent reward distribution service and is not affiliated with or endorsed by Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};
