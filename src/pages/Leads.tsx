
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeadCampaigns from '@/components/leads/LeadCampaigns';
import LeadImport from '@/components/leads/LeadImport';
import LeadTable from '@/components/leads/LeadTable';

const Leads: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Leads Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, import, and manage lead campaigns before moving them to your pipeline
          </p>
        </div>
        
        <Tabs defaultValue="campaigns" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="leads">Lead Lists</TabsTrigger>
          </TabsList>
          <TabsContent value="campaigns" className="mt-6">
            <LeadCampaigns setActiveTab={setActiveTab} />
          </TabsContent>
          <TabsContent value="import" className="mt-6">
            <LeadImport setActiveTab={setActiveTab} />
          </TabsContent>
          <TabsContent value="leads" className="mt-6">
            <LeadTable />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Leads;
