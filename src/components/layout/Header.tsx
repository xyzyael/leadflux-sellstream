
import React from 'react';
import { Bell, Search, User, Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { Toggle } from '@/components/ui/toggle';

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="h-16 px-6 border-b border-border flex items-center justify-between bg-white/90 backdrop-blur-md dark:bg-gray-900/90 shadow-sm sticky top-0 z-10">
      <div className="flex items-center space-x-4 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-10 bg-secondary/50 border-none"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Toggle 
          pressed={theme === 'dark'} 
          onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
          aria-label="Toggle theme"
          className="bg-muted/50 border rounded-full"
        >
          {theme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Toggle>
      
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full shadow-sm animate-pulse"></span>
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
        
        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-primary/5">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
