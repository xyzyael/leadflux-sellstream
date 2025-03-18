
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EmailCampaigns from '@/components/marketing/EmailCampaigns';
import WebForms from '@/components/marketing/WebForms';
import { campaigns, webForms } from '@/data/sampleData';

const Marketing: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Marketing</h1>
          <p className="text-muted-foreground mt-1">Manage campaigns, forms, and audience engagement</p>
        </div>
        
        <EmailCampaigns campaigns={campaigns} />
        
        <WebForms forms={webForms} />
      </div>
    </MainLayout>
  );
};

export default Marketing;
