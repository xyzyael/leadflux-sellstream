
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { leads } from '@/data/sampleData';

interface CampaignDetailsTableProps {
  campaignId: string;
  campaignName: string;
  onBack: () => void;
}

const CampaignDetailsTable: React.FC<CampaignDetailsTableProps> = ({ 
  campaignId, 
  campaignName,
  onBack 
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [campaignLeads, setCampaignLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // For demo purposes, filter leads from sample data
  // In a real application, this would be fetched from the database
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // In a real app, this would fetch from the database
        // For now, use sample data
        setIsLoading(true);
        const filteredLeads = leads.filter(lead => lead.campaignId === campaignId);
        setCampaignLeads(filteredLeads);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: "Error",
          description: "Could not fetch campaign leads.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeads();
  }, [campaignId]);
  
  const handleSelectAllLeads = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(campaignLeads
        .filter(lead => lead.status !== 'in_pipeline')
        .map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };
  
  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(current => 
      current.includes(leadId)
        ? current.filter(id => id !== leadId)
        : [...current, leadId]
    );
  };
  
  const handleMoveToPipeline = async () => {
    if (selectedLeads.length === 0) {
      toast({
        title: "No leads selected",
        description: "Please select at least one lead to move to the pipeline.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real app, update the database
      // For demo purposes, we'll just show a toast
      /* 
      const { error } = await supabase
        .from('leads')
        .update({ status: 'in_pipeline' })
        .in('id', selectedLeads);
        
      if (error) throw error;
      */
      
      // Create deals for each lead
      for (const leadId of selectedLeads) {
        const lead = campaignLeads.find(l => l.id === leadId);
        if (lead) {
          // In a real app, insert to the database
          /* 
          const { error: dealError } = await supabase
            .from('deals')
            .insert({
              title: `Deal with ${lead.name}`,
              stage: 'lead',
              value: 0,
              description: `Lead from ${campaignName} campaign`
            });
          
          if (dealError) throw dealError;
          */
        }
      }
      
      toast({
        title: "Leads moved to pipeline",
        description: `${selectedLeads.length} leads have been moved to the pipeline.`,
      });
      
      // Update the local state to reflect the changes
      setCampaignLeads(prev => 
        prev.map(lead => 
          selectedLeads.includes(lead.id) 
            ? { ...lead, status: 'in_pipeline' } 
            : lead
        )
      );
      
      // Clear selections after moving
      setSelectedLeads([]);
    } catch (error) {
      console.error('Error moving leads to pipeline:', error);
      toast({
        title: "Error",
        description: "Could not move leads to pipeline. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleQualifyLead = async (leadId: string, isQualified: boolean) => {
    try {
      // In a real app, update the database
      /* 
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: isQualified ? 'qualified' : 'unqualified' 
        })
        .eq('id', leadId);
        
      if (error) throw error;
      */
      
      // Update local state
      setCampaignLeads(prev =>
        prev.map(lead =>
          lead.id === leadId
            ? { ...lead, status: isQualified ? 'qualified' : 'unqualified' }
            : lead
        )
      );
      
      toast({
        title: `Lead ${isQualified ? 'qualified' : 'disqualified'}`,
        description: `Lead has been marked as ${isQualified ? 'qualified' : 'unqualified'}.`
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Error",
        description: "Could not update lead status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const filteredLeads = campaignLeads.filter(lead => {
    const matchesSearch = !searchQuery || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">New</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Qualified</Badge>;
      case 'unqualified':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Unqualified</Badge>;
      case 'in_pipeline':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">In Pipeline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          <h2 className="text-xl font-semibold">{campaignName}</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
              <h3 className="text-2xl font-bold">{campaignLeads.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Qualified</p>
              <h3 className="text-2xl font-bold">
                {campaignLeads.filter(lead => lead.status === 'qualified').length}
              </h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Disqualified</p>
              <h3 className="text-2xl font-bold">
                {campaignLeads.filter(lead => lead.status === 'unqualified').length}
              </h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Pipeline</p>
              <h3 className="text-2xl font-bold">
                {campaignLeads.filter(lead => lead.status === 'in_pipeline').length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleMoveToPipeline}
          disabled={selectedLeads.length === 0}
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Move to Pipeline ({selectedLeads.length})
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  onCheckedChange={handleSelectAllLeads}
                  checked={
                    selectedLeads.length === filteredLeads.filter(lead => lead.status !== 'in_pipeline').length && 
                    filteredLeads.filter(lead => lead.status !== 'in_pipeline').length > 0
                  }
                  className="ml-2" 
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading campaign leads...
                </TableCell>
              </TableRow>
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => handleSelectLead(lead.id)}
                      disabled={lead.status === 'in_pipeline'}
                      className="ml-2" 
                    />
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.company || '-'}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {lead.status !== 'in_pipeline' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleQualifyLead(lead.id, true)}
                            title="Qualify"
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleQualifyLead(lead.id, false)}
                            title="Disqualify"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleSelectLead(lead.id)}
                            title="Move to Pipeline"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No leads found in this campaign.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CampaignDetailsTable;
