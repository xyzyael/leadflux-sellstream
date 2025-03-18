
import React from 'react';
import { Deal } from '@/data/sampleData';
import DealCard from './DealCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  dealsByStage: Record<Deal['stage'], Deal[]>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ dealsByStage }) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-auto pb-6">
      {Object.entries(stageInfo).map(([stage, info]) => {
        const deals = dealsByStage[stage as Deal['stage']] || [];
        const stageValue = getStageTotalValue(deals);
        
        return (
          <div key={stage} className="min-w-[280px]">
            <div className={cn(
              "bg-card rounded-lg shadow-sm h-full flex flex-col overflow-hidden",
              "border-t-4",
              info.color
            )}>
              <div className="p-3 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{info.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {deals.length} deals · {formatCurrency(stageValue)}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-240px)]">
                {deals.length > 0 ? (
                  deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} className="animate-scale-in" />
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
