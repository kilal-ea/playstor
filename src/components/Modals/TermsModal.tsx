import React from 'react';
import { X, Shield } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  title = 'Terms & Privacy Policy',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-modal-scale max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-play-blue-50 text-play-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 id="terms-title" className="text-xl sm:text-2xl font-bold text-slate-900">
            {title}
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-800">1. Promotional Nature</h4>
            <p>
              This rewards platform distributes limited promotional Google Play gift cards. Card availability is dynamic and determined by real-time inventory in our database. Cards are provided on a first-verified, first-awarded basis.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-800">2. Verification Requirements</h4>
            <p>
              Users must complete eligible promotional sponsor actions to verify their session before a gift card code can be issued. Tampering with client-side code or sessions will result in automatic invalidation of the reservation.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-800">3. Redemption & Trademark Notice</h4>
            <p>
              Google Play is a trademark of Google LLC. This service is an independent reward promotion and is not affiliated with, sponsored by, or endorsed by Google LLC or its partners.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-800">4. Privacy & Session Data</h4>
            <p>
              No personally identifiable information is collected or required. We do not require accounts, passwords, or credit card information. Sessions are temporary and managed locally within your active browser tab.
            </p>
          </section>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-play-blue-600 hover:bg-play-blue-700 text-white font-semibold text-xs transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
