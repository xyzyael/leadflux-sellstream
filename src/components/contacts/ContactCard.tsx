
import React from 'react';
import { Contact } from '@/data/sampleData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactCardProps {
  contact: Contact;
  className?: string;
  onContactSelect?: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, className, onContactSelect }) => {
  // Status badge color
  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'lead':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'prospect':
        return 'bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'customer':
        return 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'churned':
        return 'bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Format date to relative time (e.g., "2 days ago")
  const formatLastContact = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Avatar fallback with initials
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer", 
        className
      )}
      onClick={() => onContactSelect?.(contact)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {contact.avatar ? (
              <img 
                src={contact.avatar} 
                alt={contact.name} 
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              getInitials(contact.name)
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium truncate">{contact.name}</h3>
                {contact.position && (
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.position}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className={cn(getStatusColor(contact.status))}>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </Badge>
            </div>
            
            <div className="mt-3 space-y-1">
              {contact.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              
              {contact.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>{contact.phone}</span>
                </div>
              )}
              
              {contact.company && (
                <div className="flex items-center text-sm">
                  <Building2 className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="truncate">{contact.company}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last contact:</span>
                <span className="font-medium">{formatLastContact(contact.lastContact)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
