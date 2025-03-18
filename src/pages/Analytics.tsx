
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import RevenueForecasting from '@/components/analytics/RevenueForecasting';
import SalesPerformance from '@/components/analytics/SalesPerformance';
import DealRotAnalysis from '@/components/analytics/DealRotAnalysis';
import { 
  getMonthlyRevenue, 
  getContactsByStatus, 
  getDealsByStage 
} from '@/data/sampleData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  CalendarDays, 
  ListFilter 
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [viewType, setViewType] = useState<'dashboard' | 'revenue' | 'performance' | 'deals'>('dashboard');
  const monthlyRevenue = getMonthlyRevenue();
  const contactsByStatus = getContactsByStatus();
  const dealsByStage = getDealsByStage();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Analytics</h1>
            <p className="text-muted-foreground mt-1">Track performance and gain insights</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Tabs defaultValue="dashboard" onValueChange={(value) => setViewType(value as any)}>
              <TabsList>
                <TabsTrigger value="dashboard" className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="revenue" className="flex items-center gap-1">
                  <LineChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Revenue</span>
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-1">
                  <PieChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Performance</span>
                </TabsTrigger>
                <TabsTrigger value="deals" className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span className="hidden sm:inline">Deal Analysis</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {viewType === 'dashboard' && (
          <>
            <DashboardCard title="Revenue Trend">
              <div className="h-[400px] pt-4">
                <RevenueChart data={monthlyRevenue} />
              </div>
            </DashboardCard>
            
            <PerformanceMetrics
              contactsByStatus={contactsByStatus}
              dealsByStage={dealsByStage}
            />
          </>
        )}
        
        {viewType === 'revenue' && (
          <RevenueForecasting />
        )}
        
        {viewType === 'performance' && (
          <SalesPerformance />
        )}
        
        {viewType === 'deals' && (
          <DealRotAnalysis />
        )}
      </div>
    </MainLayout>
  );
};

export default Analytics;
