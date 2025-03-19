
import React from 'react';
import { Deal } from '@/data/sampleData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, DollarSign, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DealCardProps {
  deal: Deal;
  className?: string;
}

const DealCard: React.FC<DealCardProps> = ({ deal, className }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getProbabilityColor = (probability?: number) => {
    if (probability === undefined) return 'bg-gray-100 text-gray-800';
    
    if (probability >= 70) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    } else if (probability >= 40) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    } else {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'border-blue-400 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent';
      case 'contact': return 'border-purple-400 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/30 dark:to-transparent';
      case 'proposal': return 'border-orange-400 bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/30 dark:to-transparent';
      case 'negotiation': return 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950/30 dark:to-transparent';
      case 'closed': return 'border-green-400 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/30 dark:to-transparent';
      default: return 'border-gray-400';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden cursor-move hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-l-4", 
      getStageColor(deal.stage),
      className
    )}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-medium truncate">{deal.title}</h3>
            <Badge variant="secondary" className={cn(getProbabilityColor(deal.probability), "shadow-sm")}>
              <BarChart3 className="h-3 w-3 mr-1" />
              {deal.probability ? `${deal.probability}%` : 'N/A'}
            </Badge>
          </div>
          
          <div className="text-xl font-semibold text-primary flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-primary/70" />
            {formatCurrency(deal.value)}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground p-1.5 bg-muted/50 rounded-md">
            <CalendarDays className="h-3 w-3 mr-1" />
            <span>Created {formatDate(deal.createdAt)}</span>
          </div>
          
          {deal.contact && (
            <div className="flex items-center text-sm p-1.5 bg-primary/5 rounded-md">
              <Users className="h-3 w-3 mr-1 text-primary/70" />
              <span className="truncate">{deal.contact.name}</span>
              {deal.contact.company && (
                <span className="truncate text-muted-foreground ml-1">
                  ({deal.contact.company})
                </span>
              )}
            </div>
          )}
          
          {deal.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
              {deal.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;
