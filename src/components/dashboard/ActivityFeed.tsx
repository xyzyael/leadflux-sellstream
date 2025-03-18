
import React from 'react';
import { Activity } from '@/data/sampleData';
import { Mail, Phone, Calendar, CheckCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'task':
        return <CheckCircle className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'call':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'meeting':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'task':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'note':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No recent activities
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start animate-slide-up">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3",
                getActivityColor(activity.type)
              )}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                    {formatDate(activity.date)}
                  </span>
                </div>
                
                {activity.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {activity.description}
                  </p>
                )}
                
                {activity.dueDate && !activity.completed && (
                  <div className="mt-1 text-xs text-orange-500">
                    Due: {formatDate(activity.dueDate)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
