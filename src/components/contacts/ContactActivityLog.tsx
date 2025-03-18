
import React from 'react';
import { Activity } from '@/data/sampleData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ContactActivityLogProps {
  activities: Activity[];
}

const ContactActivityLog: React.FC<ContactActivityLogProps> = ({ activities }) => {
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'note':
        return <MessageSquare className="h-4 w-4" />;
      case 'task':
        return activity => 
          activity.completed 
            ? <CheckCircle2 className="h-4 w-4" /> 
            : <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      case 'note':
        return 'bg-yellow-100 text-yellow-800';
      case 'task':
        return (activity: Activity) => 
          activity.completed 
            ? 'bg-green-100 text-green-800' 
            : 'bg-orange-100 text-orange-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-3">
      {sortedActivities.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No activities recorded yet
        </p>
      ) : (
        sortedActivities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {typeof getActivityIcon(activity.type) === 'function' 
                      ? getActivityIcon(activity.type)(activity)
                      : getActivityIcon(activity.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">{activity.title}</h4>
                      <Badge 
                        className={
                          typeof getActivityColor(activity.type) === 'function'
                            ? getActivityColor(activity.type)(activity)
                            : getActivityColor(activity.type)
                        }
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  
                  {activity.description && (
                    <p className="text-sm mt-1">{activity.description}</p>
                  )}
                  
                  {activity.type === 'task' && (
                    <div className="mt-2 flex items-center">
                      <Badge variant={activity.completed ? "default" : "outline"}>
                        {activity.completed ? 'Completed' : 'Pending'}
                      </Badge>
                      
                      {activity.dueDate && !activity.completed && (
                        <span className="text-xs ml-2 text-muted-foreground">
                          Due: {new Date(activity.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ContactActivityLog;
