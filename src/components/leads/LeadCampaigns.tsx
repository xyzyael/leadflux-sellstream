
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ListPlus, 
  Users, 
  Search, 
  Package, 
  Briefcase, 
  Building, 
  Building2, 
  Trash2,
  PlusCircle
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { leadCampaigns } from '@/data/sampleData';

interface LeadCampaignsProps {
  setActiveTab: (tab: string) => void;
}

const LeadCampaigns: React.FC<LeadCampaignsProps> = ({ setActiveTab }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignType, setNewCampaignType] = useState('');
  
  const campaignIcons: Record<string, React.ReactNode> = {
    'logistics': <Package className="h-10 w-10 text-blue-500" />,
    'fintech': <Briefcase className="h-10 w-10 text-green-500" />,
    'healthcare': <Building className="h-10 w-10 text-red-500" />,
    'technology': <Building2 className="h-10 w-10 text-purple-500" />
  };
  
  const filteredCampaigns = leadCampaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddCampaign = () => {
    if (newCampaignName.trim() === '' || newCampaignType.trim() === '') {
      toast({
        title: "Missing information",
        description: "Please provide both a name and type for the campaign.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would add the campaign to the database here
    toast({
      title: "Campaign created",
      description: `${newCampaignName} campaign has been created successfully.`
    });
    setNewCampaignName('');
    setNewCampaignType('');
    setShowAddCampaign(false);
  };
  
  const handleImportLeads = (campaignId: string) => {
    // Switch to the import tab and pre-select the campaign
    setActiveTab('import');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddCampaign(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {campaignIcons[campaign.type.toLowerCase()] || <ListPlus className="h-10 w-10 text-gray-500" />}
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">{campaign.type}</p>
                  </div>
                </div>
                <Badge 
                  variant={campaign.totalLeads === campaign.processedLeads ? "outline" : "default"}
                  className={campaign.totalLeads === campaign.processedLeads ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                >
                  {campaign.totalLeads === campaign.processedLeads ? "Complete" : "In Progress"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Leads:</span>
                  <span className="font-medium">{campaign.totalLeads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processed:</span>
                  <span className="font-medium">{campaign.processedLeads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">To Pipeline:</span>
                  <span className="font-medium">{campaign.movedToPipeline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleImportLeads(campaign.id)}
              >
                <Users className="h-4 w-4 mr-2" />
                Import Leads
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showAddCampaign} onOpenChange={setShowAddCampaign}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Lead Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Campaign Name
              </label>
              <Input
                id="name"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                placeholder="e.g. Q4 Logistics Companies"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Industry Type
              </label>
              <Input
                id="type"
                value={newCampaignType}
                onChange={(e) => setNewCampaignType(e.target.value)}
                placeholder="e.g. Logistics, Fintech, Healthcare"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCampaign(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadCampaigns;
