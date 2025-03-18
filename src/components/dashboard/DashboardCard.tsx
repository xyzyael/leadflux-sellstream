
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
    <Card className={cn("shadow-sm hover:shadow-md transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className={cn("pt-0", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
