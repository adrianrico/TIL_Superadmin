// Rutas de la aplicación. Páginas con carga diferida para reducir el bundle inicial.
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import GlobalLoader from './components/GlobalLoader.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import WaveBackground from './components/WaveBackground.jsx';

const LoginPage = lazy(() => import('./features/auth/LoginPage.jsx'));
const UsersPage = lazy(() => import('./features/users/UsersPage.jsx'));

export default function App() {
  return (
    <>
      <WaveBackground />
      <Suspense fallback={<GlobalLoader visible />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
