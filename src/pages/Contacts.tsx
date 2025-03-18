
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ContactList from '@/components/contacts/ContactList';
import { contacts } from '@/data/sampleData';

const Contacts: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Contacts</h1>
          <p className="text-muted-foreground mt-1">Manage your contacts, leads, and customers</p>
        </div>
        
        <ContactList contacts={contacts} />
      </div>
    </MainLayout>
  );
};

export default Contacts;
