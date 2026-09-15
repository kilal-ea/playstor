import React, { Suspense, lazy, useEffect } from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlayCodePage } from './pages/PlayCodePage';
import { LoadingState } from './components/LoadingState';

const LockerPage = lazy(() =>
  import('./pages/LockerPage').then((m) => ({ default: m.LockerPage }))
);

const CodePage = lazy(() =>
  import('./pages/CodePage').then((m) => ({ default: m.CodePage }))
);

const getInitialRoute = (): string => {
  const path = window.location.pathname;

  if (path === '/playcode/code') {
    return '/playcode/code';
  }

  if (path === '/playcode/locker') {
    return '/playcode/locker';
  }

  if (path === '/playcode') {
    return '/playcode';
  }

  return '/playcode';
};

export const App: React.FC = () => {
  const initialRoute = getInitialRoute();

  useEffect(() => {
    if (
      window.location.pathname === '/playcode' ||
      window.location.pathname === '/playcode/code' ||
      window.location.pathname === '/playcode/locker'
    ) {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Suspense fallback={<LoadingState label="Loading reward platform..." />}>
        <Routes>
          <Route path="/playcode" element={<PlayCodePage />} />
          <Route path="/playcode/code" element={<CodePage />} />
          <Route path="/playcode/locker" element={<LockerPage />} />

          <Route path="/" element={<Navigate to="/playcode" replace />} />

          <Route path="*" element={<Navigate to="/playcode" replace />} />
        </Routes>
      </Suspense>
    </MemoryRouter>
  );
};

export default App;