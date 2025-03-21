
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ContactList from '@/components/contacts/ContactList';
import ContactTable from '@/components/contacts/ContactTable';
import ContactGrid from '@/components/contacts/ContactGrid';
import ContactForm from '@/components/contacts/ContactForm';
import ContactDetails from '@/components/contacts/ContactDetails';
import { activities, contacts } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { Plus, Grid, Table, LayoutGrid, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Contact } from '@/data/sampleData';

type ViewType = 'grid' | 'list' | 'table';

const Contacts: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [showAddContact, setShowAddContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { toast } = useToast();
  
  const handleAddContact = () => {
    toast({
      title: "Contact added successfully",
      description: "The new contact has been added to your CRM.",
    });
    setShowAddContact(false);
  };
  
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };
  
  const handleCloseContactDetails = () => {
    setSelectedContact(null);
  };
  
  // Get contact activities
  const getContactActivities = (contactId: string) => {
    return activities.filter(activity => activity.contactId === contactId);
  };
  
  // Find colleagues (contacts from the same company)
  const getColleagues = (contact: Contact) => {
    if (!contact.company) return [];
    return contacts.filter(c => 
      c.id !== contact.id && 
      c.company && 
      c.company.toLowerCase() === contact.company?.toLowerCase()
    );
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Contacts</h1>
            <p className="text-muted-foreground mt-1">Manage your contacts, leads, and customers</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-muted p-1 rounded-md flex">
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 ${viewType === 'grid' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewType('grid')}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 ${viewType === 'list' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewType('list')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 ${viewType === 'table' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewType('table')}
              >
                <Table className="h-4 w-4 mr-2" />
                Table
              </Button>
            </div>
            
            <Button onClick={() => setShowAddContact(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
        
        {viewType === 'grid' && (
          <ContactGrid 
            contacts={contacts} 
            onContactSelect={handleContactSelect}
          />
        )}
        {viewType === 'list' && (
          <ContactList 
            contacts={contacts}
            onContactSelect={handleContactSelect}
          />
        )}
        {viewType === 'table' && (
          <ContactTable 
            contacts={contacts}
            onContactSelect={handleContactSelect}
          />
        )}
      </div>
      
      <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <ContactForm onSubmit={handleAddContact} onCancel={() => setShowAddContact(false)} />
        </DialogContent>
      </Dialog>
      
      <Sheet open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader className="flex flex-row items-start justify-between">
            <SheetTitle>Contact Details</SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCloseContactDetails}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          
          {selectedContact && (
            <ContactDetails 
              contact={selectedContact}
              activities={getContactActivities(selectedContact.id)} 
              colleagues={getColleagues(selectedContact)}
            />
          )}
        </SheetContent>
      </Sheet>
    </MainLayout>
  );
};

export default Contacts;
