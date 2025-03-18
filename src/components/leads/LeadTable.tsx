
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, RefreshCw, Filter, UserPlus } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LeadToContactForm from './LeadToContactForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: string;
  createdAt: string;
  campaignId?: string;
}

interface Campaign {
  id: string;
  name: string;
}

const LeadTable: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['new', 'contacted', 'qualified']);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const { data: leads = [], isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          id,
          name,
          email,
          phone,
          company,
          position,
          status,
          created_at,
          campaign_id
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        position: lead.position,
        status: lead.status,
        createdAt: lead.created_at,
        campaignId: lead.campaign_id
      })) as Lead[];
    }
  });
  
  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      return data as Campaign[];
    }
  });

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(current => 
      current.includes(status)
        ? current.filter(s => s !== status)
        : [...current, status]
    );
  };
  
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchQuery || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCampaign = !selectedCampaign || lead.campaignId === selectedCampaign;
    
    const matchesStatus = statusFilter.includes(lead.status);
    
    return matchesSearch && matchesCampaign && matchesStatus;
  });
  
  const handleSelectAllLeads = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.filter(lead => lead.status !== 'in_pipeline').map(lead => lead.id));
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
      const { error } = await supabase
        .from('leads')
        .update({ status: 'in_pipeline' })
        .in('id', selectedLeads);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      
      toast({
        title: "Leads moved to pipeline",
        description: `${selectedLeads.length} leads have been moved to the pipeline.`
      });
      
      setSelectedLeads([]);
    } catch (error) {
      console.error('Error moving leads to pipeline:', error);
      toast({
        title: "Error",
        description: "There was a problem updating leads. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleOpenConvertDialog = (lead: Lead) => {
    console.log("Opening convert dialog for lead:", lead);
    setSelectedLead(lead);
    setShowConvertDialog(true);
  };
  
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
  
  const getCampaignName = (campaignId?: string) => {
    if (!campaignId) return 'Unknown';
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.name : 'Unknown';
  };
  
  const countByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status).length;
  };

  const handleConvertSuccess = () => {
    setShowConvertDialog(false);
    setSelectedLead(null);
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    queryClient.invalidateQueries({ queryKey: ['contacts'] });
    queryClient.invalidateQueries({ queryKey: ['deals'] });
    
    toast({
      title: "Lead converted",
      description: `${selectedLead?.name} has been successfully converted to a contact.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <h3 className="text-2xl font-bold">{leads.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Leads</p>
                <h3 className="text-2xl font-bold">{countByStatus('new')}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Qualified Leads</p>
                <h3 className="text-2xl font-bold">{countByStatus('qualified')}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Pipeline</p>
                <h3 className="text-2xl font-bold">{countByStatus('in_pipeline')}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-8 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="All campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('new')}
                onCheckedChange={() => handleStatusFilterChange('new')}
              >
                New
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('contacted')}
                onCheckedChange={() => handleStatusFilterChange('contacted')}
              >
                Contacted
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('qualified')}
                onCheckedChange={() => handleStatusFilterChange('qualified')}
              >
                Qualified
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('unqualified')}
                onCheckedChange={() => handleStatusFilterChange('unqualified')}
              >
                Unqualified
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('in_pipeline')}
                onCheckedChange={() => handleStatusFilterChange('in_pipeline')}
              >
                In Pipeline
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="default" 
            className="w-full md:w-auto"
            onClick={handleMoveToPipeline}
            disabled={selectedLeads.length === 0}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Move to Pipeline ({selectedLeads.length})
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  onCheckedChange={handleSelectAllLeads}
                  checked={selectedLeads.length === filteredLeads.filter(lead => lead.status !== 'in_pipeline').length && filteredLeads.filter(lead => lead.status !== 'in_pipeline').length > 0}
                  className="ml-2" 
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length > 0 ? (
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
                  <TableCell>{getCampaignName(lead.campaignId)}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {lead.status !== 'in_pipeline' ? (
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSelectLead(lead.id)}
                          title="Move to Pipeline"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Convert to Contact"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenConvertDialog(lead);
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Convert to Contact"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenConvertDialog(lead);
                        }}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No leads found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedLead && (
        <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Convert Lead to Contact</DialogTitle>
            </DialogHeader>
            <LeadToContactForm 
              lead={selectedLead}
              onSuccess={handleConvertSuccess}
              onCancel={() => setShowConvertDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LeadTable;
