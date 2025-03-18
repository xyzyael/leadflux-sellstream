
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { 
  getRecentActivities, 
  getContactsByStatus, 
  getTotalDealValue, 
  getOpenDealValue,
  getMonthlyRevenue
} from '@/data/sampleData';
import { Users, BarChart, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const recentActivities = getRecentActivities();
  const contactsByStatus = getContactsByStatus();
  const totalContacts = Object.values(contactsByStatus).reduce((sum, count) => sum + count, 0);
  const totalDealValue = getTotalDealValue();
  const openDealValue = getOpenDealValue();
  const monthlyRevenue = getMonthlyRevenue();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your sales and marketing activities</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Contacts" 
            value={totalContacts}
            icon={<Users size={20} />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard 
            title="Lead Conversion" 
            value="24%"
            icon={<TrendingUp size={20} />}
            trend={{ value: 3, isPositive: true }}
          />
          <StatCard 
            title="Total Deal Value" 
            value={formatCurrency(totalDealValue)}
            icon={<DollarSign size={20} />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard 
            title="Open Deal Value" 
            value={formatCurrency(openDealValue)}
            icon={<BarChart size={20} />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard 
            title="Monthly Revenue" 
            className="lg:col-span-2"
          >
            <RevenueChart data={monthlyRevenue} />
          </DashboardCard>
          
          <DashboardCard 
            title="Recent Activities"
            contentClassName="max-h-[300px] overflow-y-auto pr-2"
          >
            <ActivityFeed activities={recentActivities} />
          </DashboardCard>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
