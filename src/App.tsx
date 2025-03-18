
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from '@/components/ui/toaster';
import './App.css';

// Lazy-loaded page components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Pipeline = lazy(() => import('@/pages/Pipeline'));
const DealDetailPage = lazy(() => import('@/pages/DealDetailPage'));
const Contacts = lazy(() => import('@/pages/Contacts'));
const Leads = lazy(() => import('@/pages/Leads'));
const Marketing = lazy(() => import('@/pages/Marketing'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Fallback for lazy loading
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="crm-ui-theme">
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/pipeline/deal/:dealId" element={<DealDetailPage />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
