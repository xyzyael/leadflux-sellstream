
import React, { useState } from 'react';
import { Contact } from '@/data/sampleData';
import ContactCard from './ContactCard';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  SlidersHorizontal, 
  Check,
  ArrowUpDown,
  Tags,
  CalendarRange
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ContactGridProps {
  contacts: Contact[];
}

type SortField = 'name' | 'company' | 'createdAt' | 'lastContact';
type SortDirection = 'asc' | 'desc';

const ContactGrid: React.FC<ContactGridProps> = ({ contacts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  
  // Get all unique tags from contacts
  const allTags = Array.from(new Set(contacts.flatMap(contact => contact.tags || [])));
  
  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    const matchesTags = tagFilter.length === 0 || 
                        (contact.tags && tagFilter.some(tag => contact.tags?.includes(tag)));
    
    return matchesSearch && matchesStatus && matchesTags;
  });
  
  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'company':
        const companyA = a.company || '';
        const companyB = b.company || '';
        comparison = companyA.localeCompare(companyB);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'lastContact':
        const lastContactA = a.lastContact ? new Date(a.lastContact).getTime() : 0;
        const lastContactB = b.lastContact ? new Date(b.lastContact).getTime() : 0;
        comparison = lastContactA - lastContactB;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const toggleTagFilter = (tag: string) => {
    if (tagFilter.includes(tag)) {
      setTagFilter(tagFilter.filter(t => t !== tag));
    } else {
      setTagFilter([...tagFilter, tag]);
    }
  };
  
  const clearFilters = () => {
    setStatusFilter('all');
    setTagFilter([]);
    setSearchQuery('');
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="lead">Leads</SelectItem>
              <SelectItem value="prospect">Prospects</SelectItem>
              <SelectItem value="customer">Customers</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
            </SelectContent>
          </Select>
          
          <Sheet open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <SlidersHorizontal className="h-4 w-4" />
                {(tagFilter.length > 0) && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
                <SheetDescription>
                  Refine your contact list with advanced filters
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Tags className="h-4 w-4 mr-2" />
                    <h3 className="text-sm font-medium">Filter by Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {allTags.map(tag => (
                      <Badge 
                        key={tag}
                        variant={tagFilter.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTagFilter(tag)}
                      >
                        {tagFilter.includes(tag) && <Check className="h-3 w-3 mr-1" />}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <h3 className="text-sm font-medium">Sort by</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button 
                      variant={sortField === 'name' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSort('name')}
                      className="justify-start"
                    >
                      Name
                      {sortField === 'name' && (
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                    <Button 
                      variant={sortField === 'company' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSort('company')}
                      className="justify-start"
                    >
                      Company
                      {sortField === 'company' && (
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                    <Button 
                      variant={sortField === 'createdAt' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSort('createdAt')}
                      className="justify-start"
                    >
                      Created Date
                      {sortField === 'createdAt' && (
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                    <Button 
                      variant={sortField === 'lastContact' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSort('lastContact')}
                      className="justify-start"
                    >
                      Last Contact
                      {sortField === 'lastContact' && (
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <SheetFooter className="sm:justify-between">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button onClick={() => setShowAdvancedFilters(false)}>
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tagFilter.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Tags:</span>
            {tagFilter.map(tag => (
              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => toggleTagFilter(tag)}>
                {tag} &times;
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {sortedContacts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No contacts found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} className="animate-scale-in" />
          ))}
        </div>
      )}
      
      {sortedContacts.length > 0 && (
        <div className="text-sm text-muted-foreground text-center pt-2">
          Showing {sortedContacts.length} of {contacts.length} contacts
        </div>
      )}
    </div>
  );
};

export default ContactGrid;
