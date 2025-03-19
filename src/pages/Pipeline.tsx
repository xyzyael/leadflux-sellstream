
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import KanbanBoard from '@/components/pipeline/KanbanBoard';
import DealTable from '@/components/pipeline/DealTable';
import DealForm from '@/components/pipeline/DealForm';
import { Button } from '@/components/ui/button';
import { Plus, Kanban, Table, Filter, SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/data/sampleData';

type ViewType = 'kanban' | 'table';

const Pipeline: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>('kanban');
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [valueFilter, setValueFilter] = useState<[number, number]>([0, 100000]);
  const [selectedStages, setSelectedStages] = useState<string[]>(['lead', 'contact', 'proposal', 'negotiation', 'closed']);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  
  // Fetch deals data
  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching deals data...");
        const { data, error } = await supabase
          .from('deals')
          .select(`
            id, 
            title, 
            value, 
            stage, 
            contact_id, 
            created_at, 
            closed_at, 
            description, 
            probability,
            contacts (id, name, company)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching deals:", error);
          throw error;
        }
        
        console.log("Fetched deals data:", data);
        
        const formattedDeals = data.map((deal) => ({
          id: deal.id,
          title: deal.title,
          value: deal.value,
          stage: deal.stage,
          contactId: deal.contact_id,
          createdAt: deal.created_at,
          closedAt: deal.closed_at,
          description: deal.description,
          probability: deal.probability,
          contact: deal.contacts ? {
            id: deal.contacts.id,
            name: deal.contacts.name,
            company: deal.contacts.company
          } : undefined
        })) as Deal[];
        
        setDeals(formattedDeals);
      } catch (error) {
        console.error("Error in fetchDeals:", error);
        toast({
          title: "Error",
          description: "Failed to load deals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeals();
  }, [toast]);
  
  const dealsByStage = deals.reduce((acc, deal) => {
    if (!acc[deal.stage]) {
      acc[deal.stage] = [];
    }
    acc[deal.stage].push(deal);
    return acc;
  }, {} as Record<Deal['stage'], Deal[]>);
  
  const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const openDealValue = deals.filter(deal => deal.stage !== 'closed').reduce((sum, deal) => sum + deal.value, 0);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleAddDeal = async (values: any) => {
    try {
      console.log("Adding new deal with values:", values);
      
      const value = typeof values.value === 'string' 
        ? parseFloat(values.value) 
        : values.value;
      
      const probability = values.probability 
        ? (typeof values.probability === 'string' 
            ? parseInt(values.probability, 10) 
            : values.probability)
        : null;
      
      const dealData = {
        title: values.title,
        value,
        stage: values.stage,
        probability,
        contact_id: values.contactId,
        description: values.description || null
      };
      
      console.log("Inserting deal with data:", dealData);
      
      const { data, error } = await supabase
        .from('deals')
        .insert({
          title: values.title,
          value: parseFloat(values.value),
          stage: values.stage,
          probability: values.probability ? parseInt(values.probability, 10) : null,
          contact_id: values.contactId,
          description: values.description || null
        })
        .select();
        
      if (error) throw error;
      
      // Refresh deals after adding a new one
      const { data: updatedDeals, error: fetchError } = await supabase
        .from('deals')
        .select(`
          id, 
          title, 
          value, 
          stage, 
          contact_id, 
          created_at, 
          closed_at, 
          description, 
          probability,
          contacts (id, name, company)
        `)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      const formattedDeals = updatedDeals.map((deal) => ({
        id: deal.id,
        title: deal.title,
        value: deal.value,
        stage: deal.stage,
        contactId: deal.contact_id,
        createdAt: deal.created_at,
        closedAt: deal.closed_at,
        description: deal.description,
        probability: deal.probability,
        contact: deal.contacts ? {
          id: deal.contacts.id,
          name: deal.contacts.name,
          company: deal.contacts.company
        } : undefined
      })) as Deal[];
      
      setDeals(formattedDeals);
      
      toast({
        title: "Deal added successfully",
        description: "The new deal has been added to your pipeline.",
      });
      setShowAddDeal(false);
    } catch (error) {
      console.error('Error adding deal:', error);
      toast({
        title: "Error",
        description: "Could not add deal. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleStageToggle = (stage: string) => {
    if (selectedStages.includes(stage)) {
      setSelectedStages(selectedStages.filter(s => s !== stage));
    } else {
      setSelectedStages([...selectedStages, stage]);
    }
  };
  
  const filteredDealsByStage = Object.entries(dealsByStage).reduce((acc, [stage, stageDeals]) => {
    if (selectedStages.includes(stage)) {
      const filteredDeals = stageDeals.filter(deal => {
        const matchesSearch = !searchQuery || 
          deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (deal.description && deal.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (deal.contact && deal.contact.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesValue = deal.value >= valueFilter[0] && deal.value <= valueFilter[1];
        
        return matchesSearch && matchesValue;
      });
      
      if (filteredDeals.length > 0) {
        acc[stage as keyof typeof acc] = filteredDeals;
      }
    }
    return acc;
  }, {} as Record<string, typeof dealsByStage[keyof typeof dealsByStage]>);
  
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
            
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Deals</SheetTitle>
                  <SheetDescription>
                    Customize which deals you want to see in your pipeline
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Deal Stages</h3>
                    <div className="space-y-1">
                      {Object.keys(dealsByStage).map(stage => (
                        <div key={stage} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`stage-${stage}`}
                            checked={selectedStages.includes(stage)}
                            onChange={() => handleStageToggle(stage)}
                            className="rounded text-primary"
                          />
                          <label htmlFor={`stage-${stage}`} className="text-sm">
                            {stage === 'lead' && 'Leads'}
                            {stage === 'contact' && 'Contacted'}
                            {stage === 'proposal' && 'Proposal'}
                            {stage === 'negotiation' && 'Negotiation'}
                            {stage === 'closed' && 'Closed Won'}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Deal Value Range</h3>
                      <Slider
                        defaultValue={valueFilter}
                        min={0}
                        max={100000}
                        step={5000}
                        onValueChange={(value) => setValueFilter(value as [number, number])}
                        className="my-6"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatCurrency(valueFilter[0])}</span>
                        <span>{formatCurrency(valueFilter[1])}</span>
                      </div>
                    </div>
                  </div>
                
                  <Button 
                    onClick={() => setShowFilters(false)}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="relative w-full max-w-xs hidden md:block">
              <Input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={() => {
                console.log("Add Deal button clicked");
                setShowAddDeal(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </div>
        </div>
        
        <div className="md:hidden w-full mb-2">
          <Input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
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
                    {totalDealValue > 0 ? Math.round((openDealValue / totalDealValue) * 100) : 0}% of total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p>Loading deals...</p>
          </div>
        ) : (
          <>
            {viewType === 'kanban' && <KanbanBoard dealsByStage={filteredDealsByStage} />}
            {viewType === 'table' && <DealTable dealsByStage={filteredDealsByStage} />}
          </>
        )}
      </div>
      
      <Dialog 
        open={showAddDeal} 
        onOpenChange={(open) => {
          console.log("Add Deal dialog open state changed to:", open);
          setShowAddDeal(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
          </DialogHeader>
          <DealForm 
            onSubmit={handleAddDeal} 
            onCancel={() => {
              console.log("Cancel button clicked in DealForm");
              setShowAddDeal(false);
            }} 
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Pipeline;
