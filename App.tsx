import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerApp from './src/CustomerApp';
import AdminLogin from './src/pages/AdminLogin'; // Static import for reliability
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load admin modules to prevent main bundle crash if dependencies fail
const AdminDashboard = lazy(() => import('./src/pages/admin/AdminDashboard'));
const MenuManagement = lazy(() => import('./src/pages/admin/MenuManagement'));
const OrderManagement = lazy(() => import('./src/pages/admin/OrderManagement'));
const Analytics = lazy(() => import('./src/pages/admin/Analytics'));
const QRAnalytics = lazy(() => import('./src/pages/admin/QRAnalytics'));
const Settings = lazy(() => import('./src/pages/admin/Settings'));
const PopupManagement = lazy(() => import('./src/pages/admin/PopupManagement'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Simple loading component
const Loading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-snip-bg">
    <div className="w-16 h-16 border-4 border-snip-orange border-t-transparent rounded-full animate-spin mb-4"></div>
    <div className="text-xl font-display font-bold text-snip-black animate-pulse">
      Chargement...
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer-facing app - Critical Path (Static Import) */}
        <Route path="/" element={<CustomerApp />} />

        {/* Admin routes with ErrorBoundary */}
        <Route
          path="/admin/*"
          element={
            <ErrorBoundary>
              <Routes>
                <Route path="login" element={<AdminLogin />} />
                <Route
                  path="dashboard"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    </Suspense>
                  }
                />
                <Route
                  path="menu"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProtectedRoute>
                        <MenuManagement />
                      </ProtectedRoute>
                    </Suspense>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProtectedRoute>
                        <OrderManagement />
                      </ProtectedRoute>
                    </Suspense>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    </Suspense>
                  }
                />
                <Route
                  path="qr-analytics"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProtectedRoute>
                        <QRAnalytics />
                      </ProtectedRoute>
                    </Suspense>
                  }
                />
                <Route
                  path="popups"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProtectedRoute>
                        <PopupManagement />
                      </ProtectedRoute>
                    </Suspense>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    </Suspense>
                  }
                />
                {/* Redirect /admin to /admin/dashboard */}
                <Route index element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ErrorBoundary>
          }
        />

        {/* Catch all other routes and redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
