import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Building2, 
  Calendar, 
  Phone, 
  Mail,
  User, 
  FileText, 
  ClipboardCheck, 
  MessageSquare,
  BadgePercent,
  DollarSign,
  Briefcase,
  Users,
  Link as LinkIcon,
  Edit2,
  AlertCircle
} from 'lucide-react';
import DealBreadcrumb from './DealBreadcrumb';
import ContactDetails from '../contacts/ContactDetails';
import { useToast } from '@/components/ui/use-toast';
import { Deal } from '@/data/sampleData';
import { format } from 'date-fns';

const DealDetail: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dealData, setDealData] = useState<{
    deal: any;
    activities: any[];
    colleagues: any[];
    relatedDeals: any[];
    leadSource: any;
  } | null>(null);
  
  useEffect(() => {
    const fetchDealData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching deal data for ID: ${dealId}`);
        
        if (!dealId) throw new Error('Deal ID is required');
        
        const { data: deal, error: dealError } = await supabase
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
            contacts (
              id, 
              name, 
              email,
              phone,
              company, 
              position,
              tags,
              status,
              created_at,
              last_contact,
              avatar
            )
          `)
          .eq('id', dealId)
          .single();
        
        if (dealError) {
          console.error("Error fetching deal:", dealError);
          throw dealError;
        }
        
        console.log("Fetched deal data:", deal);
        
        // Fetch related activities
        const { data: activities, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .or(`deal_id.eq.${dealId},contact_id.eq.${deal.contact_id}`)
          .order('date', { ascending: false });
        
        if (activitiesError) {
          console.error("Error fetching activities:", activitiesError);
        }
        
        // If contact has a company, fetch colleagues from the same company
        let colleagues = [];
        if (deal.contacts?.company) {
          const { data: colleaguesData, error: colleaguesError } = await supabase
            .from('contacts')
            .select('*')
            .eq('company', deal.contacts.company)
            .neq('id', deal.contact_id);
          
          if (colleaguesError) {
            console.error("Error fetching colleagues:", colleaguesError);
          } else {
            colleagues = colleaguesData || [];
          }
        }
        
        // Fetch other deals for the same contact/company
        const { data: relatedDeals, error: relatedDealsError } = await supabase
          .from('deals')
          .select(`
            id, 
            title, 
            value, 
            stage, 
            created_at, 
            closed_at, 
            probability
          `)
          .eq('contact_id', deal.contact_id)
          .neq('id', dealId)
          .order('created_at', { ascending: false });
        
        if (relatedDealsError) {
          console.error("Error fetching related deals:", relatedDealsError);
        }
        
        // Fetch campaign info if contact came from a lead
        let leadSource = null;
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .select(`
            id, 
            status, 
            created_at,
            contacted_at,
            notes,
            campaigns (
              id,
              name,
              type,
              status
            )
          `)
          .eq('email', deal.contacts?.email)
          .maybeSingle();
        
        if (!leadError && leadData) {
          leadSource = leadData;
        }

        // Map the contact data to include createdAt (required by the Contact type)
        const contactWithCreatedAt = deal.contacts ? {
          ...deal.contacts,
          createdAt: deal.contacts.created_at // Add the createdAt field that matches the Contact type
        } : null;
        
        setDealData({
          deal: {
            ...deal,
            contacts: contactWithCreatedAt
          },
          activities: activities || [],
          colleagues: colleagues || [],
          relatedDeals: relatedDeals || [],
          leadSource
        });
      } catch (err) {
        console.error("Error fetching deal data:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDealData();
  }, [dealId]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading deal information...</p>
      </div>
    );
  }
  
  if (error || !dealData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg">Error loading deal information</p>
        <Button onClick={() => navigate('/pipeline')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Pipeline
        </Button>
      </div>
    );
  }
  
  const { deal, activities, colleagues, relatedDeals, leadSource } = dealData;
  const contact = deal.contacts;
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'contact':
      case 'contacted':
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
  
  const getDealStagePercent = () => {
    const stages = ['lead', 'contact', 'proposal', 'negotiation', 'closed'];
    const currentStageIndex = stages.indexOf(deal.stage);
    return Math.round((currentStageIndex / (stages.length - 1)) * 100);
  };
  
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleEditDeal = () => {
    // Logic to navigate to edit deal page or open edit modal
    console.log("Edit deal clicked");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2" 
            onClick={() => navigate('/pipeline')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pipeline
          </Button>
          <DealBreadcrumb stage={deal.stage} dealTitle={deal.title} />
        </div>
        
        <Button onClick={handleEditDeal}>
          <Edit2 className="mr-2 h-4 w-4" />
          Edit Deal
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{deal.title}</CardTitle>
                  <CardDescription>Created {formatDate(deal.created_at)}</CardDescription>
                </div>
                <Badge className={getStatusColor(deal.stage)}>
                  {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Value</p>
                    <p className="text-2xl font-semibold flex items-center">
                      <DollarSign className="h-5 w-5 text-muted-foreground mr-1" />
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(deal.value)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Probability</p>
                    <p className="text-xl font-semibold flex items-center">
                      <BadgePercent className="h-5 w-5 text-muted-foreground mr-1" />
                      {deal.probability || 0}%
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Pipeline Progress</p>
                    <div className="w-full bg-secondary h-2 rounded-full mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${getDealStagePercent()}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Lead</span>
                      <span>Contact</span>
                      <span>Proposal</span>
                      <span>Negotiation</span>
                      <span>Closed</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm mt-1">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created: {formatDate(deal.created_at)}
                      </span>
                      {deal.closed_at && (
                        <span className="flex items-center">
                          <ClipboardCheck className="h-4 w-4 mr-1" />
                          Closed: {formatDate(deal.closed_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {deal.description && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{deal.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      {contact.avatar ? (
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                      ) : (
                        <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{contact.name}</h4>
                      {contact.position && (
                        <p className="text-sm text-muted-foreground">{contact.position}</p>
                      )}
                      {contact.company && (
                        <p className="text-sm mt-1 flex items-center">
                          <Building2 className="h-3 w-3 mr-1 text-muted-foreground" />
                          {contact.company}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="text-sm flex items-center hover:underline">
                        <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                        {contact.email}
                      </a>
                    )}
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="text-sm flex items-center hover:underline">
                        <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                        {contact.phone}
                      </a>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('contact')}>
                    View Full Contact Details
                  </Button>
                </CardFooter>
              </Card>
              
              {leadSource && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Lead Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leadSource.campaigns && (
                        <div>
                          <p className="text-sm text-muted-foreground">Campaign</p>
                          <p className="text-sm font-medium flex items-center">
                            <Briefcase className="h-3 w-3 mr-1 text-muted-foreground" />
                            {leadSource.campaigns.name} 
                            <Badge className="ml-2 text-xs" variant="outline">
                              {leadSource.campaigns.type}
                            </Badge>
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Created As Lead</p>
                          <p className="text-sm">{formatDate(leadSource.created_at)}</p>
                        </div>
                        
                        {leadSource.contacted_at && (
                          <div>
                            <p className="text-sm text-muted-foreground">First Contacted</p>
                            <p className="text-sm">{formatDate(leadSource.contacted_at)}</p>
                          </div>
                        )}
                      </div>
                      
                      {leadSource.notes && (
                        <div>
                          <p className="text-sm text-muted-foreground">Lead Notes</p>
                          <p className="text-sm">{leadSource.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {relatedDeals.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Other Deals with {contact.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {relatedDeals.map(relatedDeal => (
                        <div 
                          key={relatedDeal.id}
                          className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => navigate(`/pipeline/deal/${relatedDeal.id}`)}
                        >
                          <div>
                            <p className="font-medium">{relatedDeal.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Created {formatDate(relatedDeal.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              }).format(relatedDeal.value)}
                            </p>
                            <Badge className={`text-xs ${getStatusColor(relatedDeal.stage)}`}>
                              {relatedDeal.stage}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activities.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activities.slice(0, 3).map(activity => (
                        <div key={activity.id} className="border-l-2 border-muted pl-4 py-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(activity.date)}
                          </p>
                          {activity.description && (
                            <p className="text-sm mt-1">{activity.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  {activities.length > 3 && (
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('activities')}>
                        View All Activities
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )}
              
              {contact.company && colleagues.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">{contact.company} Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Other Contacts at {contact.company}</p>
                    <div className="space-y-2">
                      {colleagues.slice(0, 3).map(colleague => (
                        <div 
                          key={colleague.id}
                          className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => navigate(`/contacts?id=${colleague.id}`)}
                        >
                          <Avatar className="h-8 w-8">
                            {colleague.avatar ? (
                              <AvatarImage src={colleague.avatar} alt={colleague.name} />
                            ) : (
                              <AvatarFallback>{getInitials(colleague.name)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{colleague.name}</p>
                            {colleague.position && (
                              <p className="text-xs text-muted-foreground">{colleague.position}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  {colleagues.length > 3 && (
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/contacts?company=${encodeURIComponent(contact.company)}`)}
                      >
                        <Users className="h-3 w-3 mr-1" />
                        View All {colleagues.length} Contacts
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="contact" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <ContactDetails 
                    contact={contact} 
                    activities={activities.filter(a => a.contact_id === contact.id)} 
                    colleagues={colleagues} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activities" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">All Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map(activity => (
                        <div key={activity.id} className="border-l-2 border-muted pl-4 py-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.title}</h4>
                            <Badge variant="outline">{activity.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(activity.date)}
                          </p>
                          {activity.description && (
                            <p className="text-sm mt-2">{activity.description}</p>
                          )}
                          {activity.due_date && (
                            <p className="text-sm mt-1 flex items-center text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due: {formatDate(activity.due_date)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No activities found for this deal
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add New Activity
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    No notes found for this deal
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Add New Note
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Key Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Deal Value</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(deal.value)}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Probability</span>
                  <span className="font-medium">{deal.probability || 0}%</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stage</span>
                  <Badge className={getStatusColor(deal.stage)}>
                    {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{formatDate(deal.created_at)}</span>
                </div>
                
                {deal.closed_at && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Closed</span>
                      <span className="text-sm">{formatDate(deal.closed_at)}</span>
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contact</span>
                  <span className="text-sm font-medium">{contact.name}</span>
                </div>
                
                {contact.company && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Company</span>
                      <span className="text-sm font-medium">{contact.company}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Related Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  View Contact Details
                </Button>
                
                {contact.company && (
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    View Company Details
                  </Button>
                )}
                
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Log Activity
                </Button>
                
                {leadSource && leadSource.campaigns && (
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    View Source Campaign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-0 before:h-full before:w-[2px] before:bg-muted">
                  {activities.slice(0, 5).map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className="relative before:absolute before:left-[-26px] before:top-1 before:h-3 before:w-3 before:rounded-full before:bg-primary"
                    >
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-center py-4 text-muted-foreground">
                  No activities recorded yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;
