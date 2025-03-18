
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDealsByStage, deals } from '@/data/sampleData';

const SalesPerformance: React.FC = () => {
  const [viewType, setViewType] = useState<'conversion' | 'stage' | 'value'>('conversion');
  
  const dealsByStage = getDealsByStage();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate conversion rates between pipeline stages
  const calculateConversionRates = () => {
    const stageOrder = ['lead', 'contact', 'proposal', 'negotiation', 'closed'];
    const stageNames = {
      lead: 'Leads',
      contact: 'Contacted',
      proposal: 'Proposal',
      negotiation: 'Negotiation',
      closed: 'Closed Won'
    };
    
    const data = [];
    
    for (let i = 0; i < stageOrder.length - 1; i++) {
      const currentStage = stageOrder[i];
      const nextStage = stageOrder[i + 1];
      
      const currentCount = (dealsByStage[currentStage] || []).length;
      const nextCount = (dealsByStage[nextStage] || []).length;
      
      const conversionRate = currentCount > 0 ? (nextCount / currentCount) * 100 : 0;
      
      data.push({
        name: `${stageNames[currentStage as keyof typeof stageNames]} to ${stageNames[nextStage as keyof typeof stageNames]}`,
        rate: Math.round(conversionRate),
        fill: conversionRate > 70 ? '#4CAF50' : conversionRate > 40 ? '#FFC107' : '#F44336'
      });
    }
    
    return data;
  };
  
  // Calculate deal value by stage
  const calculateValueByStage = () => {
    const stageColors = {
      lead: '#3B82F6',
      contact: '#8B5CF6',
      proposal: '#F97316',
      negotiation: '#FBBF24',
      closed: '#22C55E'
    };
    
    const stageNames = {
      lead: 'Leads',
      contact: 'Contacted',
      proposal: 'Proposal',
      negotiation: 'Negotiation',
      closed: 'Closed Won'
    };
    
    return Object.entries(dealsByStage).map(([stage, stageDeals]) => {
      const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
      return {
        name: stageNames[stage as keyof typeof stageNames],
        value: totalValue,
        count: stageDeals.length,
        fill: stageColors[stage as keyof typeof stageColors]
      };
    });
  };
  
  const conversionData = calculateConversionRates();
  const stageValueData = calculateValueByStage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Analysis of sales funnel and conversions</CardDescription>
            </div>
            
            <Tabs defaultValue="conversion" onValueChange={(value) => setViewType(value as any)}>
              <TabsList>
                <TabsTrigger value="conversion">Conversion Rates</TabsTrigger>
                <TabsTrigger value="stage">By Stage</TabsTrigger>
                <TabsTrigger value="value">Deal Value</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {viewType === 'conversion' && (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={conversionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                  <Bar dataKey="rate" fill="#8884d8" radius={[4, 4, 0, 0]}>
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {viewType === 'stage' && (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stageValueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, count, percent }) => `${name}: ${count} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {stageValueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Deals']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {viewType === 'value' && (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stageValueData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Total Value']} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {stageValueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPerformance;
