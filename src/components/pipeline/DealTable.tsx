
import React, { useState } from 'react';
import { Deal } from '@/data/sampleData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, Edit, ArrowUpDown, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DealForm from './DealForm';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface DealTableProps {
  dealsByStage: Record<Deal['stage'], Deal[]>;
}

const DealTable: React.FC<DealTableProps> = ({ dealsByStage }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Deal; direction: 'asc' | 'desc' } | null>(null);
  const [showDealDetails, setShowDealDetails] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  
  // Flatten deals array
  const allDeals = Object.values(dealsByStage).flat();
  
  // Filter deals
  const filteredDeals = allDeals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (deal.description && deal.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (deal.contact && deal.contact.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
    
    return matchesSearch && matchesStage;
  });
  
  // Sort deals
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    
    if (a[key] < b[key]) {
      return direction === 'asc' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const getStageColor = (stage: Deal['stage']) => {
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
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleSort = (key: keyof Deal) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const handleRowClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDealDetails(true);
  };
  
  const handleUpdateDeal = async (updatedValues: any) => {
    if (selectedDeal) {
      try {
        const value = typeof updatedValues.value === 'string' 
          ? parseFloat(updatedValues.value) 
          : updatedValues.value;
        
        const probability = updatedValues.probability 
          ? (typeof updatedValues.probability === 'string' 
              ? parseInt(updatedValues.probability, 10) 
              : updatedValues.probability)
          : null;
        
        const dealData = {
          title: updatedValues.title,
          value,
          stage: updatedValues.stage,
          probability,
          contact_id: updatedValues.contactId || null,
          description: updatedValues.description || null
        };
        
        const { error } = await supabase
          .from('deals')
          .update(dealData)
          .eq('id', selectedDeal.id);
          
        if (error) throw error;
        
        // Refresh deals data
        queryClient.invalidateQueries({ queryKey: ['deals'] });
        
        toast({
          title: "Deal updated",
          description: `${updatedValues.title} has been updated successfully.`,
        });
        setShowDealDetails(false);
      } catch (error) {
        console.error('Error updating deal:', error);
        toast({
          title: "Error",
          description: "Could not update deal. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleStageChange = async (deal: Deal, newStage: Deal['stage']) => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ stage: newStage })
        .eq('id', deal.id);
        
      if (error) throw error;
      
      // Refresh deals data
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      toast({
        title: "Stage updated",
        description: `Deal stage changed to ${newStage}`,
      });
    } catch (error) {
      console.error('Error updating deal stage:', error);
      toast({
        title: "Error",
        description: "Could not update deal stage. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteDeal = async (dealId: string | number) => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);
        
      if (error) throw error;
      
      // Refresh deals data
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      toast({
        title: "Deal deleted",
        description: "The deal has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast({
        title: "Error",
        description: "Could not delete deal. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button variant="ghost" size="sm" onClick={() => handleSort('title')}>
                  Deal
                  {sortConfig?.key === 'title' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('value')}>
                  Value
                  {sortConfig?.key === 'value' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('createdAt')}>
                  Created
                  {sortConfig?.key === 'createdAt' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDeals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No deals found
                </TableCell>
              </TableRow>
            ) : (
              sortedDeals.map((deal) => (
                <TableRow 
                  key={deal.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(deal)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{deal.title}</div>
                      {deal.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">{deal.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      defaultValue={deal.stage}
                      onValueChange={(value) => handleStageChange(deal, value as Deal['stage'])}
                    >
                      <SelectTrigger className={`w-[130px] ${getStageColor(deal.stage)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="contact">Contact</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatCurrency(deal.value)}</TableCell>
                  <TableCell>
                    {deal.contact ? (
                      <div>
                        <div>{deal.contact.name}</div>
                        {deal.contact.company && (
                          <div className="text-sm text-muted-foreground">{deal.contact.company}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No contact</span>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(deal.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleRowClick(deal)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDeal(deal.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
                id: selectedDeal.id,
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
    </div>
  );
};

export default DealTable;
