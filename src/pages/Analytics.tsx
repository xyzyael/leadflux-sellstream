
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import { 
  getMonthlyRevenue, 
  getContactsByStatus, 
  getDealsByStage 
} from '@/data/sampleData';

const Analytics: React.FC = () => {
  const monthlyRevenue = getMonthlyRevenue();
  const contactsByStatus = getContactsByStatus();
  const dealsByStage = getDealsByStage();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track performance and gain insights</p>
        </div>
        
        <DashboardCard title="Revenue Trend">
          <div className="h-[400px] pt-4">
            <RevenueChart data={monthlyRevenue} />
          </div>
        </DashboardCard>
        
        <PerformanceMetrics
          contactsByStatus={contactsByStatus}
          dealsByStage={dealsByStage}
        />
      </div>
    </MainLayout>
  );
};

export default Analytics;
