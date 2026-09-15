import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlayCodePage } from './pages/PlayCodePage';
import { LoadingState } from './components/LoadingState';

const LockerPage = lazy(() =>
  import('./pages/LockerPage').then((m) => ({ default: m.LockerPage }))
);

const CodePage = lazy(() =>
  import('./pages/CodePage').then((m) => ({ default: m.CodePage }))
);

export const App: React.FC = () => {
  useEffect(() => {
    const path = window.location.pathname;

    if (
      path === '/playcode' ||
      path === '/playcode/code' ||
      path === '/playcode/locker'
    ) {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState label="Loading reward platform..." />}>
        <Routes>
          <Route path="/playcode" element={<PlayCodePage />} />

          <Route path="/playcode/code" element={<CodePage />} />

          <Route path="/playcode/locker" element={<LockerPage />} />

          <Route path="/" element={<Navigate to="/playcode" replace />} />

          <Route path="*" element={<Navigate to="/playcode" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;