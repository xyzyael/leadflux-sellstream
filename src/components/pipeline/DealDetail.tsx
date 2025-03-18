import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DealBreadcrumb from './DealBreadcrumb';
import { ArrowLeft, Calendar, DollarSign, Users, Briefcase, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';

const DealDetail = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Using our optimized query hook
  const { data: deal, isLoading } = useOptimizedQuery(
    ['deal', dealId || ''],
    'deals',
    {
      select: `
        id, 
        title, 
        value, 
        stage, 
        contact_id, 
        created_at, 
        closed_at, 
        description, 
        probability,
        contacts (id, name, company, email, phone, position, status, tags, avatar, created_at, last_contact)
      `,
      filter: { id: dealId },
      enabled: !!dealId
    }
  );

  const dealData = deal?.[0];

  // Format contact data to match the expected type
  const contactData = dealData?.contacts ? {
    id: dealData.contacts.id,
    name: dealData.contacts.name,
    company: dealData.contacts.company,
    email: dealData.contacts.email,
    phone: dealData.contacts.phone,
    position: dealData.contacts.position,
    status: dealData.contacts.status,
    tags: dealData.contacts.tags,
    avatar: dealData.contacts.avatar,
    createdAt: dealData.contacts.created_at,
    lastContact: dealData.contacts.last_contact
  } : undefined;

  // Format deal data
  const formattedDeal = dealData ? {
    id: dealData.id,
    title: dealData.title,
    value: dealData.value,
    stage: dealData.stage,
    contactId: dealData.contact_id,
    createdAt: dealData.created_at,
    closedAt: dealData.closed_at,
    description: dealData.description,
    probability: dealData.probability,
    contact: contactData
  } : null;

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
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
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

  const renderContactInfo = () => {
    if (!formattedDeal?.contact) {
      return <p className="text-muted-foreground">No contact associated with this deal.</p>;
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <CardTitle>Contact Information</CardTitle>
        </div>
        <p><strong>Name:</strong> {formattedDeal.contact.name}</p>
        <p><strong>Email:</strong> {formattedDeal.contact.email}</p>
        <p><strong>Phone:</strong> {formattedDeal.contact.phone}</p>
        {formattedDeal.contact.company && <p><strong>Company:</strong> {formattedDeal.contact.company}</p>}
        {formattedDeal.contact.position && <p><strong>Position:</strong> {formattedDeal.contact.position}</p>}
        {formattedDeal.contact.status && <p><strong>Status:</strong> {formattedDeal.contact.status}</p>}
      </div>
    );
  };

  const renderDealDetails = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          <CardTitle>Deal Details</CardTitle>
        </div>
        <p><strong>Created At:</strong> {formatDate(formattedDeal.createdAt)}</p>
        <p><strong>Value:</strong> {formatCurrency(formattedDeal.value)}</p>
        <p><strong>Probability:</strong> {formattedDeal.probability ? `${formattedDeal.probability}%` : 'N/A'}</p>
        <p><strong>Stage:</strong>
          <Badge className={getStageBadgeColor(formattedDeal.stage)}>
            {formattedDeal.stage.charAt(0).toUpperCase() + formattedDeal.stage.slice(1)}
          </Badge>
        </p>
        {formattedDeal.closedAt && <p><strong>Closed At:</strong> {formatDate(formattedDeal.closedAt)}</p>}
        {formattedDeal.description && <p><strong>Description:</strong> {formattedDeal.description}</p>}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <p>Loading deal information...</p>
      </div>
    );
  }

  if (!formattedDeal) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate('/pipeline')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pipeline
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center py-8">Deal not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate('/pipeline')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pipeline
          </Button>
          <DealBreadcrumb deal={formattedDeal} />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{formattedDeal.title}</h1>
        </div>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Deal Overview</CardTitle>
          <CardDescription>
            Here is detailed information about the deal.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">
                <Briefcase className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Users className="h-4 w-4 mr-2" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-2">
              {renderDealDetails()}
            </TabsContent>
            <TabsContent value="contact" className="space-y-2">
              {renderContactInfo()}
            </TabsContent>
            <TabsContent value="activity" className="text-center">
              <p className="text-muted-foreground">No activity recorded for this deal.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button variant="outline">Edit Deal</Button>
          <p className="text-sm text-muted-foreground">
            Last updated: {formatDate(formattedDeal.createdAt)}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DealDetail;
