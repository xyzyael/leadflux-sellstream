
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Contact, Deal } from '@/data/sampleData';

interface PerformanceMetricsProps {
  contactsByStatus: Record<Contact['status'], number>;
  dealsByStage: Record<Deal['stage'], Deal[]>;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  contactsByStatus,
  dealsByStage
}) => {
  // Prepare data for status distribution chart
  const statusData = Object.entries(contactsByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }));

  // Prepare data for deal stage distribution chart
  const stageData = Object.entries(dealsByStage).map(([stage, deals]) => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    return {
      name: stage === 'lead' ? 'Leads' :
            stage === 'contact' ? 'Contacted' :
            stage === 'proposal' ? 'Proposal' :
            stage === 'negotiation' ? 'Negotiation' :
            stage === 'closed' ? 'Closed Won' : stage,
      count: deals.length,
      value: totalValue
    };
  });

  // Colors for the charts
  const statusColors = ['#3b82f6', '#f97316', '#22c55e', '#ef4444'];
  const stageColors = ['#3b82f6', '#8b5cf6', '#f97316', '#eab308', '#22c55e'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Status Distribution */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Contact Status Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} contacts`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Deal Value by Stage */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Deal Value by Stage</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stageData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Value']} />
                  <Bar dataKey="value" name="Value">
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={stageColors[index % stageColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Deal Count by Stage */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Deal Count by Stage</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stageData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} deals`, 'Count']} />
                  <Bar dataKey="count" name="Count">
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={stageColors[index % stageColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
