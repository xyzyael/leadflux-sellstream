
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  action?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  children, 
  className,
  contentClassName,
  action 
}) => {
  return (
    <Card className={cn(
      "shadow-sm hover:shadow-md transition-all duration-300 border-b-2 border-primary/20", 
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/30">
        <CardTitle className="text-lg font-medium flex items-center">
          {title}
        </CardTitle>
        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}
      </CardHeader>
      <CardContent className={cn("pt-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
