
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import KanbanBoard from '@/components/pipeline/KanbanBoard';
import DealTable from '@/components/pipeline/DealTable';
import DealForm from '@/components/pipeline/DealForm';
import { getDealsByStage, getTotalDealValue, getOpenDealValue } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { Plus, Kanban, Table, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

type ViewType = 'kanban' | 'table';

const Pipeline: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>('kanban');
  const [showAddDeal, setShowAddDeal] = useState(false);
  const { toast } = useToast();
  
  const dealsByStage = getDealsByStage();
  const totalDealValue = getTotalDealValue();
  const openDealValue = getOpenDealValue();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleAddDeal = () => {
    toast({
      title: "Deal added successfully",
      description: "The new deal has been added to your pipeline.",
    });
    setShowAddDeal(false);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Pipeline</h1>
            <p className="text-muted-foreground mt-1">
              Manage your sales pipeline and track deals
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-muted p-1 rounded-md flex">
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 ${viewType === 'kanban' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewType('kanban')}
              >
                <Kanban className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 ${viewType === 'table' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewType('table')}
              >
                <Table className="h-4 w-4 mr-2" />
                Table
              </Button>
            </div>
            
            <Button onClick={() => setShowAddDeal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pipeline Value</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(totalDealValue)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open Deal Value</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(openDealValue)}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.round((openDealValue / totalDealValue) * 100)}% of total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {viewType === 'kanban' && <KanbanBoard dealsByStage={dealsByStage} />}
        {viewType === 'table' && <DealTable dealsByStage={dealsByStage} />}
      </div>
      
      <Dialog open={showAddDeal} onOpenChange={setShowAddDeal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
          </DialogHeader>
          <DealForm onSubmit={handleAddDeal} onCancel={() => setShowAddDeal(false)} />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Pipeline;
