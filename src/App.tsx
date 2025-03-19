
import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageLoader from '@/components/layout/PageLoader';
import './App.css';

// Create a client with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

// Preload important components with reduced chunks
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Pipeline = lazy(() => import('@/pages/Pipeline'));
const DealDetailPage = lazy(() => import('@/pages/DealDetailPage'));
const Contacts = lazy(() => import('@/pages/Contacts'));
const Leads = lazy(() => import('@/pages/Leads'));
const Marketing = lazy(() => import('@/pages/Marketing'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Route prefetching component
const RoutePrefetcher = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Prefetch related routes based on current location
    const prefetchRelatedRoutes = () => {
      const path = location.pathname;
      
      if (path === '/dashboard') {
        // Prefetch pipeline when on dashboard
        import('@/pages/Pipeline');
        import('@/components/pipeline/DealCard');
      } else if (path === '/pipeline') {
        // Prefetch deal details when on pipeline
        import('@/pages/DealDetailPage');
        import('@/components/pipeline/DealDetail');
      } else if (path === '/contacts') {
        // Prefetch leads when on contacts
        import('@/pages/Leads');
      }
    };
    
    // Use requestIdleCallback for non-critical prefetching
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchRelatedRoutes);
    } else {
      setTimeout(prefetchRelatedRoutes, 1000);
    }
    
  }, [location.pathname]);
  
  return null;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="crm-ui-theme">
      <QueryClientProvider client={queryClient}>
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
            <RoutePrefetcher />
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
