
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  BarChart, 
  Layout, 
  Inbox, 
  Calendar, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ListPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  icon, 
  label, 
  isCollapsed,
  isActive 
}) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start mb-1 relative group",
          isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="mr-3">{icon}</span>
        {!isCollapsed && <span>{label}</span>}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-popover rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            {label}
          </div>
        )}
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"></div>}
      </Button>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  const links = [
    { to: '/', icon: <Layout size={20} />, label: 'Dashboard' },
    { to: '/contacts', icon: <Users size={20} />, label: 'Contacts' },
    { to: '/leads', icon: <ListPlus size={20} />, label: 'Leads' },
    { to: '/pipeline', icon: <BarChart size={20} />, label: 'Pipeline' },
    { to: '/marketing', icon: <Inbox size={20} />, label: 'Marketing' },
    { to: '/analytics', icon: <Calendar size={20} />, label: 'Analytics' },
  ];

  return (
    <div 
      className={cn(
        "min-h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <div className="font-semibold text-lg">
            FluxCRM
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("ml-auto", isCollapsed && "mx-auto")}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="py-4 px-2">
        <nav className="space-y-1">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isCollapsed={isCollapsed}
              isActive={location.pathname === link.to}
            />
          ))}
        </nav>
        
        <div className="mt-8 pt-4 border-t border-border">
          <SidebarLink
            to="/settings"
            icon={<Settings size={20} />}
            label="Settings"
            isCollapsed={isCollapsed}
            isActive={location.pathname === '/settings'}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
