import React, { useEffect } from 'react';

export const LockerPage: React.FC = () => {
  useEffect(() => {
    // Open the external locker directly.
    // No token, session, query parameters, or availability checks.
    window.location.assign('https://trkoffer.net/cl/i/ved83x');
  }, []);

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          Redirecting...
        </p>
      </div>
    </main>
  );
};
