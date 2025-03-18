
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { deals } from '@/data/sampleData';
import { differenceInDays } from 'date-fns';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

const DealRotAnalysis: React.FC = () => {
  const [stageFilter, setStageFilter] = useState<string>('all');
  
  // Calculate the age of deals in days
  const calculateDealAge = (createdAt: string) => {
    const created = new Date(createdAt);
    const today = new Date();
    return differenceInDays(today, created);
  };
  
  // Define rot thresholds in days for each stage
  const stageThresholds = {
    lead: 7,
    contact: 14,
    proposal: 21,
    negotiation: 30,
    closed: 999 // No rot for closed deals
  };
  
  // Process deals to add age and rot status
  const processedDeals = deals.map(deal => {
    const age = calculateDealAge(deal.createdAt);
    const threshold = stageThresholds[deal.stage];
    
    let status: 'healthy' | 'warning' | 'rotting';
    
    if (age < threshold * 0.5) {
      status = 'healthy';
    } else if (age < threshold) {
      status = 'warning';
    } else {
      status = 'rotting';
    }
    
    return {
      ...deal,
      age,
      status
    };
  });
  
  // Filter deals based on selected stage
  const filteredDeals = stageFilter === 'all' 
    ? processedDeals 
    : processedDeals.filter(deal => deal.stage === stageFilter);
  
  // Sort deals with rotting first, then warning, then healthy
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    const statusPriority = { rotting: 0, warning: 1, healthy: 2 };
    return statusPriority[a.status] - statusPriority[b.status];
  });
  
  const getStatusBadge = (status: 'healthy' | 'warning' | 'rotting') => {
    switch (status) {
      case 'healthy':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            At Risk
          </Badge>
        );
      case 'rotting':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Rotting
          </Badge>
        );
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Count deals by status
  const healthyCount = sortedDeals.filter(d => d.status === 'healthy').length;
  const warningCount = sortedDeals.filter(d => d.status === 'warning').length;
  const rottingCount = sortedDeals.filter(d => d.status === 'rotting').length;
  
  // Calculate total value by status
  const healthyValue = sortedDeals
    .filter(d => d.status === 'healthy')
    .reduce((sum, deal) => sum + deal.value, 0);
    
  const warningValue = sortedDeals
    .filter(d => d.status === 'warning')
    .reduce((sum, deal) => sum + deal.value, 0);
    
  const rottingValue = sortedDeals
    .filter(d => d.status === 'rotting')
    .reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Healthy Deals</p>
                <h3 className="text-2xl font-bold">{healthyCount}</h3>
                <p className="text-sm text-muted-foreground mt-1">{formatCurrency(healthyValue)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">At Risk Deals</p>
                <h3 className="text-2xl font-bold">{warningCount}</h3>
                <p className="text-sm text-muted-foreground mt-1">{formatCurrency(warningValue)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rotting Deals</p>
                <h3 className="text-2xl font-bold">{rottingCount}</h3>
                <p className="text-sm text-muted-foreground mt-1">{formatCurrency(rottingValue)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Deal Rot Analysis</CardTitle>
              <CardDescription>Identify stalled deals that need attention</CardDescription>
            </div>
            
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="lead">Leads</SelectItem>
                <SelectItem value="contact">Contacted</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed">Closed Won</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Age (Days)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDeals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {deal.stage === 'lead' && 'Lead'}
                      {deal.stage === 'contact' && 'Contacted'}
                      {deal.stage === 'proposal' && 'Proposal'}
                      {deal.stage === 'negotiation' && 'Negotiation'}
                      {deal.stage === 'closed' && 'Closed Won'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(deal.value)}</TableCell>
                  <TableCell>{deal.age}</TableCell>
                  <TableCell>{getStatusBadge(deal.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealRotAnalysis;
