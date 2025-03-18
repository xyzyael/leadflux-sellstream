import React, { useState } from 'react';
import { Deal } from '@/data/sampleData';
import DealCard from './DealCard';
import { Plus, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DealForm from './DealForm';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface KanbanBoardProps {
  dealsByStage: Record<Deal['stage'], Deal[]>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ dealsByStage }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [draggingDeal, setDraggingDeal] = useState<Deal | null>(null);
  const [collapseStages, setCollapseStages] = useState<Record<string, boolean>>({});
  const [showDealForm, setShowDealForm] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Deal['stage'] | null>(null);
  
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
  
  const handleDrop = async (e: React.DragEvent, targetStage: Deal['stage']) => {
    e.preventDefault();
    
    if (draggingDeal && draggingDeal.stage !== targetStage) {
      const updatedDeal = { ...draggingDeal, stage: targetStage };
      
      try {
        console.log("Updating deal stage:", draggingDeal.id, "to", targetStage);
        const { error } = await supabase
          .from('deals')
          .update({ stage: targetStage })
          .eq('id', draggingDeal.id);
            
        if (error) {
          console.error("Error in supabase update:", error);
          throw error;
        }
        
        queryClient.invalidateQueries({ queryKey: ['deals'] });
        
        toast({
          title: "Deal moved",
          description: `${draggingDeal.title} moved from ${stageInfo[draggingDeal.stage].title} to ${stageInfo[targetStage].title}`,
        });
      } catch (error) {
        console.error('Error updating deal:', error);
        toast({
          title: "Error",
          description: "Could not update deal stage. Please try again.",
          variant: "destructive"
        });
      }
    }
    
    setDraggingDeal(null);
  };
  
  const handleDealClick = (deal: Deal) => {
    console.log("Deal clicked:", deal);
    navigate(`/pipeline/deal/${deal.id}`);
  };
  
  const handleAddDeal = (stage: Deal['stage']) => {
    console.log("Adding deal to stage:", stage);
    setSelectedStage(stage);
    setShowDealForm(true);
  };
  
  const handleCreateDeal = async (values: any) => {
    try {
      console.log("Creating new deal with values:", values);
      
      if (selectedStage) {
        const dealData = {
          ...values,
          stage: selectedStage,
          value: parseFloat(values.value),
          probability: values.probability ? parseInt(values.probability, 10) : null,
        };
        
        const { error } = await supabase
          .from('deals')
          .insert(dealData);
          
        if (error) throw error;
        
        queryClient.invalidateQueries({ queryKey: ['deals'] });
        
        toast({
          title: "Deal created",
          description: `${values.title} has been added to ${selectedStage} stage.`,
        });
      }
      
      setShowDealForm(false);
    } catch (error) {
      console.error('Error creating deal:', error);
      toast({
        title: "Error",
        description: "Could not create deal. Please try again.",
        variant: "destructive"
      });
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
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddDeal(stage as Deal['stage']);
                    }}
                  >
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
                            "transition-opacity duration-200 cursor-pointer"
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
      
      <Dialog 
        open={showDealForm} 
        onOpenChange={(open) => {
          console.log("Deal form dialog open state changed to:", open);
          setShowDealForm(open);
          if (!open) {
            setSelectedStage(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
          </DialogHeader>
          <DealForm 
            onSubmit={handleCreateDeal} 
            onCancel={() => setShowDealForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KanbanBoard;
