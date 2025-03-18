
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import KanbanBoard from '@/components/pipeline/KanbanBoard';
import { getDealsByStage, getTotalDealValue } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Pipeline: React.FC = () => {
  const dealsByStage = getDealsByStage();
  const totalDealValue = getTotalDealValue();
  
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Pipeline</h1>
            <p className="text-muted-foreground mt-1">
              Total value: {formatCurrency(totalDealValue)}
            </p>
          </div>
          
          <Button className="sm:self-start">
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>
        
        <KanbanBoard dealsByStage={dealsByStage} />
      </div>
    </MainLayout>
  );
};

export default Pipeline;
