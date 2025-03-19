
import React, { memo } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

// Memoize the MainLayout component to prevent unnecessary re-renders
const MainLayout: React.FC<MainLayoutProps> = memo(({ children }) => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
});

// DisplayName for React DevTools
MainLayout.displayName = 'MainLayout';

export default MainLayout;
