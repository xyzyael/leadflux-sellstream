
import React from 'react';
import { Deal } from '@/data/sampleData';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowRight, Briefcase, FileText, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DealTableProps {
  dealsByStage: Record<Deal['stage'], Deal[]>;
}

const DealTable: React.FC<DealTableProps> = ({ dealsByStage }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = React.useState<'title' | 'value' | 'stage' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  
  // Flatten deals array
  const allDeals = React.useMemo(() => {
    return Object.values(dealsByStage).flat();
  }, [dealsByStage]);
  
  // Sort deals
  const sortedDeals = React.useMemo(() => {
    return [...allDeals].sort((a, b) => {
      if (sortBy === 'value') {
        return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
      } else if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'stage') {
        return sortOrder === 'asc' 
          ? a.stage.localeCompare(b.stage) 
          : b.stage.localeCompare(a.stage);
      } else {
        // Default sort by created_at
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
  }, [allDeals, sortBy, sortOrder]);
  
  const handleSort = (column: 'title' | 'value' | 'stage' | 'created_at') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  const handleViewDeal = (deal: Deal) => {
    console.log("Navigating to deal detail:", deal.id);
    navigate(`/pipeline/deal/${deal.id}`);
  };
  
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'lead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200';
      case 'contact':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200';
      case 'proposal':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200';
      case 'negotiation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200';
    }
  };

  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-medium"
                onClick={() => handleSort('title')}
              >
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                Deal Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                Contact / Company
              </div>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-medium"
                onClick={() => handleSort('value')}
              >
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                Value
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-medium"
                onClick={() => handleSort('stage')}
              >
                Stage
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-medium"
                onClick={() => handleSort('created_at')}
              >
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                Created
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDeals.length > 0 ? (
            sortedDeals.map((deal) => (
              <TableRow 
                key={deal.id} 
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => handleViewDeal(deal)}
              >
                <TableCell 
                  className="font-medium"
                >
                  {deal.title}
                </TableCell>
                <TableCell>
                  <div>
                    {deal.contact?.name}
                    {deal.contact?.company && (
                      <div className="text-sm text-muted-foreground">
                        {deal.contact.company}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  {formatCurrency(deal.value)}
                  {deal.probability && (
                    <div className="text-xs text-muted-foreground font-normal">
                      {deal.probability}% probability
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={cn("shadow-sm", getStageBadgeColor(deal.stage))}>
                    {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(deal.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDeal(deal);
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No deals found matching your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DealTable;
