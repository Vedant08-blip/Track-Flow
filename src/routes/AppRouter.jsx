import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import BacklogPage from '../pages/BacklogPage';
import BoardPage from '../pages/BoardPage';
import PlanningPage from '../pages/PlanningPage';
import TimelinePage from '../pages/TimelinePage';
import PortfolioPage from '../pages/PortfolioPage';
import ReportsPage from '../pages/ReportsPage';
import ThemeSettingsPage from '../pages/ThemeSettingsPage';
import MainLayout from '../components/shared/MainLayout';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="h-full flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="backlog" element={<BacklogPage />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="planning" element={
          <ProtectedRoute roles={['Admin', 'Scrum Master']}>
            <PlanningPage />
          </ProtectedRoute>
        } />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="theme-settings" element={<ThemeSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
