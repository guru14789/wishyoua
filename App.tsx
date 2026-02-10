import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Auth = lazy(() => import('./pages/Auth'));
const PlanConfirmation = lazy(() => import('./pages/PlanConfirmation'));
const CreateEvent = lazy(() => import('./pages/CreateEvent'));
const ShareEvent = lazy(() => import('./pages/ShareEvent'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GuestIntro = lazy(() => import('./pages/guest/GuestIntro'));
const GuestAbout = lazy(() => import('./pages/guest/GuestAbout'));
const GuestQuestion = lazy(() => import('./pages/guest/GuestQuestion'));
const GuestRecord = lazy(() => import('./pages/guest/GuestRecord'));
const GuestReview = lazy(() => import('./pages/guest/GuestReview'));
const GuestDone = lazy(() => import('./pages/guest/GuestDone'));
const GuestNotify = lazy(() => import('./pages/guest/GuestNotify'));
const CompileEvent = lazy(() => import('./pages/CompileEvent'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-white text-xl font-bold tracking-tighter">wishyoua</div>
    </div>
  </div>
);

// Protected route that requires authentication
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return element;
};

// Protected route that requires a specific plan
const PlanProtectedRoute: React.FC<{
  element: React.ReactElement;
  requiredPlan?: 'pro' | 'premium';
}> = ({ element, requiredPlan }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!currentUser) {
    return <Navigate to="/pricing" replace />;
  }

  if (requiredPlan) {
    const planOrder = { free: 0, pro: 1, premium: 2 };
    const userPlanLevel = planOrder[currentUser.plan as keyof typeof planOrder] || 0;
    const requiredPlanLevel = planOrder[requiredPlan];

    if (userPlanLevel < requiredPlanLevel) {
      return <Navigate to="/pricing" replace />;
    }
  }

  return element;
};

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />

          {/* Plan Confirmation (requires auth) */}
          <Route path="/plan" element={<ProtectedRoute element={<PlanConfirmation />} />} />

          {/* Event Management (requires auth + plan) */}
          <Route path="/create" element={<ProtectedRoute element={<CreateEvent />} />} />
          <Route path="/share/:eventId" element={<ProtectedRoute element={<ShareEvent />} />} />
          <Route path="/dashboard/:eventId" element={<ProtectedRoute element={<Dashboard />} />} />

          {/* Compile (Free for testing) */}
          <Route path="/compile/:eventId" element={<PlanProtectedRoute element={<CompileEvent />} requiredPlan="free" />} />

          {/* Guest Flow Routes (Public - No Auth Required) */}
          <Route path="/invite/:eventId" element={<GuestIntro />} />
          <Route path="/invite/:eventId/resume" element={<GuestIntro />} />
          <Route path="/invite/:eventId/about" element={<GuestAbout />} />
          <Route path="/invite/:eventId/question" element={<GuestQuestion />} />
          <Route path="/invite/:eventId/record" element={<GuestRecord />} />
          <Route path="/invite/:eventId/review" element={<GuestReview />} />
          <Route path="/invite/:eventId/uploading" element={<GuestReview />} />
          <Route path="/invite/:eventId/done" element={<GuestDone />} />
          <Route path="/invite/:eventId/notify" element={<GuestNotify />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;