import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Navbar } from '@/components/common/Navbar';
import { Header } from '@/components/common/Header';

// Landing Page
import { LandingPage } from '@/pages/landing/LandingPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage';
import { RegistrationRejectedPage } from '@/pages/auth/RegistrationRejectedPage';
import { SetupProfilePage } from '@/pages/auth/SetupProfilePage';

// App Pages
import { HomePage } from '@/pages/dashboard/HomePage';
import { DiscoverPage } from '@/pages/predictions/DiscoverPage';
import { CreatePredictionPage } from '@/pages/predictions/CreatePredictionPage';
import { WalletPage } from '@/pages/wallet/WalletPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { LeaderboardPage } from '@/pages/leaderboard/LeaderboardPage';
import { TokenBankPage } from '@/pages/bank/TokenBankPage';
import { ClassGroupPage } from '@/pages/group/ClassGroupPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

import { FirstLoginModal } from '@/components/auth/FirstLoginModal';
import { useAuth } from '@/context/AuthContext';

// Main Layout Wrapper
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isFirstLogin, setIsFirstLogin } = useAuth();

  return (
    <div className="min-h-screen bg-transparent text-[#F3F4F6] flex flex-col lg:flex-row">
      <Navbar />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header />
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
          {children}
        </main>
      </div>
      <FirstLoginModal isOpen={isFirstLogin} onComplete={() => setIsFirstLogin(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/registration-rejected" element={<RegistrationRejectedPage />} />
            <Route path="/setup-profile" element={<SetupProfilePage />} />

            {/* Protected App Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <HomePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={<Navigate to="/home" replace />}
            />
            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DiscoverPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CreatePredictionPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <WalletPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <LeaderboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TokenBankPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/group"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ClassGroupPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <NotificationsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SettingsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AppLayout>
                    <AdminDashboardPage />
                  </AppLayout>
                </AdminRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
