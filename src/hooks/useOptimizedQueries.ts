
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/data/sampleData';

// Hook for fetching deals with optimization
export const useDealsQuery = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      console.log("Fetching deals data...");
      const { data, error } = await supabase
        .from('deals')
        .select(`
          id,
          title,
          value,
          stage,
          contact_id,
          created_at,
          closed_at,
          description,
          probability,
          contacts(id, name, company)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log("Fetched deals data:", data);
      
      // Transform the data to match our client-side structure
      return data.map((deal) => ({
        id: deal.id,
        title: deal.title,
        value: deal.value,
        stage: deal.stage,
        contactId: deal.contact_id,
        createdAt: deal.created_at,
        closedAt: deal.closed_at,
        description: deal.description,
        probability: deal.probability,
        contact: deal.contacts ? {
          id: deal.contacts.id,
          name: deal.contacts.name,
          company: deal.contacts.company
        } : undefined
      })) as Deal[];
    },
    // Override global settings for this specific query if needed
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for fetching a single deal
export const useDealQuery = (dealId: string | undefined) => {
  return useQuery({
    queryKey: ['deal', dealId],
    queryFn: async () => {
      if (!dealId) throw new Error('Deal ID is required');
      
      console.log("Fetching deal data for ID:", dealId);
      const { data, error } = await supabase
        .from('deals')
        .select(`
          id,
          title,
          value,
          stage,
          contact_id,
          created_at,
          closed_at,
          description,
          probability,
          contacts(
            id,
            name,
            email,
            phone,
            company,
            position,
            tags,
            status,
            created_at,
            last_contact,
            avatar
          )
        `)
        .eq('id', dealId)
        .single();
      
      if (error) throw error;
      
      console.log("Fetched deal data:", data);
      
      // Transform the data to match our client-side structure
      return {
        id: data.id,
        title: data.title,
        value: data.value,
        stage: data.stage,
        contactId: data.contact_id,
        createdAt: data.created_at,
        closedAt: data.closed_at,
        description: data.description,
        probability: data.probability,
        contact: data.contacts ? {
          id: data.contacts.id,
          name: data.contacts.name,
          email: data.contacts.email,
          phone: data.contacts.phone,
          company: data.contacts.company,
          position: data.contacts.position,
          tags: data.contacts.tags,
          status: data.contacts.status,
          createdAt: data.contacts.created_at,
          lastContact: data.contacts.last_contact,
          avatar: data.contacts.avatar
        } : undefined
      } as Deal;
    },
    enabled: !!dealId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
