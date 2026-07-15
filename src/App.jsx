import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppLayout from '@/components/AppLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import ChatPage from '@/pages/ChatPage';
import EditorPage from '@/pages/EditorPage';
import FilesPage from '@/pages/FilesPage';
import SettingsPage from '@/pages/SettingsPage';
import AdminPage from '@/pages/AdminPage';
import BillingPage from '@/pages/BillingPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ApiKeysPage from '@/pages/ApiKeysPage';
import ProjectsPage from '@/pages/ProjectsPage';
import SupportPage from '@/pages/SupportPage';
import DocsPage from '@/pages/DocsPage';
import StatusPage from '@/pages/StatusPage';
import ShortcutsPage from '@/pages/ShortcutsPage';
import QuotasPage from '@/pages/QuotasPage';
import ModelsPage from '@/pages/ModelsPage';
import SecurityLogPage from '@/pages/SecurityLogPage';
import CommandsPage from '@/pages/CommandsPage';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError && authError.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Render routes — ProtectedRoute handles auth for protected pages
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes with sidebar layout */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/api-keys" element={<ApiKeysPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/shortcuts" element={<ShortcutsPage />} />
          <Route path="/quotas" element={<QuotasPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/security-log" element={<SecurityLogPage />} />
          <Route path="/commands" element={<CommandsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        {/* Full-screen protected routes */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App