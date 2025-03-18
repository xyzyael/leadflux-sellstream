
import React from 'react';
import { Contact } from '@/data/sampleData';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone } from 'lucide-react';

interface ContactColleaguesProps {
  colleagues: Contact[];
}

const ContactColleagues: React.FC<ContactColleaguesProps> = ({ colleagues }) => {
  // Get avatar initials
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-3">
      {colleagues.map((colleague) => (
        <Card key={colleague.id} className="overflow-hidden hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                {colleague.avatar ? (
                  <AvatarImage src={colleague.avatar} alt={colleague.name} />
                ) : (
                  <AvatarFallback>{getInitials(colleague.name)}</AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-sm font-medium">{colleague.name}</h4>
                    {colleague.position && (
                      <p className="text-xs text-muted-foreground">{colleague.position}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {colleague.status}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-1 text-xs">
                  {colleague.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <a href={`mailto:${colleague.email}`} className="hover:underline">
                        {colleague.email}
                      </a>
                    </div>
                  )}
                  
                  {colleague.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <a href={`tel:${colleague.phone}`} className="hover:underline">
                        {colleague.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContactColleagues;
