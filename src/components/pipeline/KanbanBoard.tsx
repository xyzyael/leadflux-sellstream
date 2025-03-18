
import React, { useState } from 'react';
import { Deal } from '@/data/sampleData';
import DealCard from './DealCard';
import { Plus, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DealForm from './DealForm';

interface KanbanBoardProps {
  dealsByStage: Record<Deal['stage'], Deal[]>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ dealsByStage }) => {
  const { toast } = useToast();
  const [draggingDeal, setDraggingDeal] = useState<Deal | null>(null);
  const [collapseStages, setCollapseStages] = useState<Record<string, boolean>>({});
  const [showDealDetails, setShowDealDetails] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  
  const stageInfo = {
    lead: {
      title: 'Leads',
      color: 'border-blue-400'
    },
    contact: {
      title: 'Contacted',
      color: 'border-purple-400'
    },
    proposal: {
      title: 'Proposal',
      color: 'border-orange-400'
    },
    negotiation: {
      title: 'Negotiation',
      color: 'border-yellow-400'
    },
    closed: {
      title: 'Closed Won',
      color: 'border-green-400'
    }
  };

  const getStageTotalValue = (deals: Deal[]) => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleDragStart = (deal: Deal) => {
    setDraggingDeal(deal);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, targetStage: Deal['stage']) => {
    e.preventDefault();
    
    if (draggingDeal && draggingDeal.stage !== targetStage) {
      // In a real app, we would update the deal's stage in the database here
      // For now, we'll just show a toast and would normally update the state
      
      // Create a copy of the deal with the updated stage
      const updatedDeal = { ...draggingDeal, stage: targetStage };
      
      toast({
        title: "Deal moved",
        description: `${draggingDeal.title} moved from ${stageInfo[draggingDeal.stage].title} to ${stageInfo[targetStage].title}`,
      });
      
      // In a real application with proper state management:
      // 1. Update the deal in the database
      // 2. Refresh the deals or update the local state
    }
    
    setDraggingDeal(null);
  };
  
  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDealDetails(true);
  };
  
  const handleUpdateDeal = (updatedValues: any) => {
    if (selectedDeal) {
      // In a real app, we would update the deal in the database here
      toast({
        title: "Deal updated",
        description: `${updatedValues.title} has been updated successfully.`,
      });
      setShowDealDetails(false);
    }
  };
  
  const toggleCollapseStage = (stage: string) => {
    setCollapseStages({
      ...collapseStages,
      [stage]: !collapseStages[stage]
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-auto pb-6">
        {Object.entries(stageInfo).map(([stage, info]) => {
          const deals = dealsByStage[stage as Deal['stage']] || [];
          const stageValue = getStageTotalValue(deals);
          const isCollapsed = collapseStages[stage];
          
          return (
            <div 
              key={stage} 
              className="min-w-[280px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage as Deal['stage'])}
            >
              <div className={cn(
                "bg-card rounded-lg shadow-sm h-full flex flex-col overflow-hidden",
                "border-t-4",
                info.color,
                draggingDeal && draggingDeal.stage !== stage && "border-dashed border-2 border-primary-foreground/20"
              )}>
                <div 
                  className="p-3 border-b flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCollapseStage(stage)}
                >
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{info.title}</h3>
                      <ChevronsUpDown className={cn(
                        "h-4 w-4 ml-1 transition-transform",
                        isCollapsed && "rotate-180"
                      )} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {deals.length} deals · {formatCurrency(stageValue)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {!isCollapsed && (
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-240px)]">
                    {deals.length > 0 ? (
                      deals.map((deal) => (
                        <div
                          key={deal.id}
                          draggable
                          onDragStart={() => handleDragStart(deal)}
                          onDragEnd={() => setDraggingDeal(null)}
                          onClick={() => handleDealClick(deal)}
                          className={cn(
                            draggingDeal?.id === deal.id ? "opacity-50" : "opacity-100",
                            "transition-opacity duration-200"
                          )}
                        >
                          <DealCard 
                            deal={deal} 
                            className={cn(
                              "animate-scale-in",
                              draggingDeal?.id === deal.id ? "ring-2 ring-primary" : ""
                            )} 
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground text-sm">
                        No deals in this stage
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {showDealDetails && selectedDeal && (
        <Dialog open={showDealDetails} onOpenChange={setShowDealDetails}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Deal Details</DialogTitle>
            </DialogHeader>
            <DealForm 
              onSubmit={handleUpdateDeal} 
              onCancel={() => setShowDealDetails(false)} 
              defaultValues={{
                title: selectedDeal.title,
                value: selectedDeal.value.toString(),
                stage: selectedDeal.stage,
                probability: selectedDeal.probability?.toString() || '',
                contactId: selectedDeal.contactId,
                description: selectedDeal.description || ''
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default KanbanBoard;
