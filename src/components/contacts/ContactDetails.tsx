
import React, { useState } from 'react';
import { Activity, Contact } from '@/data/sampleData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  Mail, 
  Building2, 
  Calendar, 
  MessageSquare, 
  User, 
  Users,
  FileText,
  ArrowUpRight,
  PenSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactActivityLog from './ContactActivityLog';
import ContactColleagues from './ContactColleagues';
import ContactNotes from './ContactNotes';

interface ContactDetailsProps {
  contact: Contact;
  activities: Activity[];
  colleagues: Contact[];
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ 
  contact, 
  activities,
  colleagues 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate days since last contact
  const getDaysSinceLastContact = () => {
    if (!contact.lastContact) return Infinity;
    
    const lastContactDate = new Date(contact.lastContact);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastContactDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const daysSinceLastContact = getDaysSinceLastContact();
  
  // Engagement score - simple calculation based on activities and recency
  const calculateEngagementScore = () => {
    let score = 0;
    
    // Add points based on number of activities
    score += Math.min(activities.length * 10, 50);
    
    // Add points based on recency of last contact
    if (daysSinceLastContact < 7) {
      score += 50;
    } else if (daysSinceLastContact < 30) {
      score += 30;
    } else if (daysSinceLastContact < 90) {
      score += 10;
    }
    
    return Math.min(score, 100);
  };
  
  const engagementScore = calculateEngagementScore();
  
  // Status badge color
  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'lead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'prospect':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'customer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'churned':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get avatar initials
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="py-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-20 w-20 border">
          {contact.avatar ? (
            <AvatarImage src={contact.avatar} alt={contact.name} />
          ) : (
            <AvatarFallback className="text-lg">{getInitials(contact.name)}</AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold">{contact.name}</h2>
              {contact.position && (
                <p className="text-muted-foreground">{contact.position}</p>
              )}
            </div>
            <Badge className={getStatusColor(contact.status)}>
              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
            </Badge>
          </div>
          {contact.company && <p className="text-sm mt-1">{contact.company}</p>}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {contact.tags?.map(tag => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          {contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${contact.email}`} className="text-sm hover:underline">
                {contact.email}
              </a>
            </div>
          )}
          
          {contact.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${contact.phone}`} className="text-sm hover:underline">
                {contact.phone}
              </a>
            </div>
          )}
          
          {contact.company && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{contact.company}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Created: {formatDate(contact.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Last contact: {formatDate(contact.lastContact)}
              {daysSinceLastContact < Infinity && ` (${daysSinceLastContact} days ago)`}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link to={`/pipeline?contactId=${contact.id}`}>
            <ArrowUpRight className="h-4 w-4 mr-1" />
            View Deals
          </Link>
        </Button>
        <Button size="sm" variant="outline">
          <PenSquare className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Engagement Score</span>
              <span className="font-medium">{engagementScore}%</span>
            </div>
            <Progress value={engagementScore} className="h-2" />
            
            <div className="pt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Activities</span>
              <span className="font-medium">{activities.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">
            <User className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="activities">
            <MessageSquare className="h-4 w-4 mr-2" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          {colleagues.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <h3 className="text-sm font-medium">Colleagues at {contact.company}</h3>
              </div>
              <ContactColleagues colleagues={colleagues} />
            </div>
          )}
          
          {activities.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <h3 className="text-sm font-medium">Recent Activities</h3>
              </div>
              <ContactActivityLog activities={activities.slice(0, 3)} />
              {activities.length > 3 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="px-0"
                  onClick={() => setActiveTab('activities')}
                >
                  View all {activities.length} activities
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-4 mt-4">
          <ContactActivityLog activities={activities} />
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4 mt-4">
          <ContactNotes contactId={contact.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactDetails;
