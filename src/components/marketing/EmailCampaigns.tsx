
import React from 'react';
import { Campaign } from '@/data/sampleData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, BarChart3, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmailCampaignsProps {
  campaigns: Campaign[];
}

const EmailCampaigns: React.FC<EmailCampaignsProps> = ({ campaigns }) => {
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Email Campaigns</h2>
        <Button>
          <Mail className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden hover:shadow-md transition-all duration-300 animate-scale-in">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-medium truncate">{campaign.name}</h3>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </div>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>Audience: {campaign.audience}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                  {campaign.status === 'scheduled' ? (
                    <span>Scheduled for: {formatDate(campaign.scheduledAt)}</span>
                  ) : campaign.status === 'completed' ? (
                    <span>Sent on: {formatDate(campaign.completedAt)}</span>
                  ) : (
                    <span>Created on: {formatDate(campaign.createdAt)}</span>
                  )}
                </div>
                
                {campaign.sentCount && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span>Sent to {campaign.sentCount} recipients</span>
                  </div>
                )}
                
                {(campaign.openRate || campaign.clickRate) && (
                  <div className="flex items-center text-sm">
                    <BarChart3 className="h-3 w-3 mr-2 text-muted-foreground" />
                    {campaign.openRate && (
                      <span className="mr-3">Open rate: {campaign.openRate}%</span>
                    )}
                    {campaign.clickRate && (
                      <span>Click rate: {campaign.clickRate}%</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="mr-2">
                  {campaign.status === 'draft' ? 'Edit' : 'View'}
                </Button>
                {campaign.status === 'draft' && (
                  <Button size="sm">Schedule</Button>
                )}
                {campaign.status === 'scheduled' && (
                  <Button size="sm">Send Now</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmailCampaigns;
