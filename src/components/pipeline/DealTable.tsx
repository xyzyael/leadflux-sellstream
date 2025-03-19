
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
import { ArrowUpDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'contact':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'proposal':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'negotiation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-medium"
                onClick={() => handleSort('title')}
              >
                Deal Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Contact / Company</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-medium"
                onClick={() => handleSort('value')}
              >
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
              <TableRow key={deal.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell 
                  className="font-medium"
                  onClick={() => handleViewDeal(deal)}
                >
                  {deal.title}
                </TableCell>
                <TableCell onClick={() => handleViewDeal(deal)}>
                  <div>
                    {deal.contact?.name}
                    {deal.contact?.company && (
                      <div className="text-sm text-muted-foreground">
                        {deal.contact.company}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell onClick={() => handleViewDeal(deal)}>
                  {formatCurrency(deal.value)}
                  {deal.probability && (
                    <div className="text-xs text-muted-foreground">
                      {deal.probability}% probability
                    </div>
                  )}
                </TableCell>
                <TableCell onClick={() => handleViewDeal(deal)}>
                  <Badge className={getStageBadgeColor(deal.stage)}>
                    {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell onClick={() => handleViewDeal(deal)}>
                  {formatDate(deal.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewDeal(deal)}
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
