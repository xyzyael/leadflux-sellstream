
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMonthlyRevenue } from '@/data/sampleData';

const RevenueForecasting: React.FC = () => {
  const [forecastPeriod, setForecastPeriod] = useState<'3months' | '6months' | '12months'>('3months');
  const [displayType, setDisplayType] = useState<'chart' | 'table'>('chart');
  
  const revenueData = getMonthlyRevenue();
  
  // Create forecast data based on historical trends
  const createForecastData = () => {
    const historicalData = [...revenueData];
    const forecast = [];
    
    // Calculate the average growth rate from the last 3 months
    const lastMonths = historicalData.slice(-3).filter(item => item.revenue > 0);
    if (lastMonths.length < 2) return historicalData;
    
    const growthRates = [];
    for (let i = 1; i < lastMonths.length; i++) {
      const growth = lastMonths[i].revenue / lastMonths[i-1].revenue;
      growthRates.push(growth);
    }
    
    const avgGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
    
    // Get last known revenue value
    const lastValue = historicalData.filter(item => item.revenue > 0).pop()?.revenue || 0;
    
    // Create forecast months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const lastMonth = historicalData.findIndex(item => item.revenue === 0);
    
    let nextValue = lastValue;
    const forecastMonths = forecastPeriod === '3months' ? 3 : forecastPeriod === '6months' ? 6 : 12;
    
    for (let i = 0; i < forecastMonths; i++) {
      const monthIndex = (lastMonth + i) % 12;
      nextValue = nextValue * avgGrowthRate;
      
      forecast.push({
        month: months[monthIndex],
        revenue: Math.round(nextValue),
        isForecast: true
      });
    }
    
    // Combine historical and forecast data
    const combinedData = [...historicalData.filter(item => item.revenue > 0), ...forecast];
    return combinedData;
  };
  
  const forecastData = createForecastData();
  
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
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Revenue Forecast</CardTitle>
              <CardDescription>Predicted revenue based on historical data</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={forecastPeriod} onValueChange={(value: any) => setForecastPeriod(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Forecast Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Next 3 Months</SelectItem>
                  <SelectItem value="6months">Next 6 Months</SelectItem>
                  <SelectItem value="12months">Next 12 Months</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex space-x-1">
                <Button 
                  variant={displayType === 'chart' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setDisplayType('chart')}
                >
                  Chart
                </Button>
                <Button 
                  variant={displayType === 'table' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setDisplayType('table')}
                >
                  Table
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {displayType === 'chart' ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={forecastData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Historical Revenue"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {forecastData.map((item, index) => (
                    <tr key={index} className={item.isForecast ? 'bg-primary/5' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(item.revenue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.isForecast ? (
                          <span className="text-primary font-medium">Forecast</span>
                        ) : (
                          <span>Historical</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueForecasting;
