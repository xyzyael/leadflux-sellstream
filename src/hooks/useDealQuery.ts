
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/data/sampleData';

export const useDealQuery = (dealId: string) => {
  return useQuery({
    queryKey: ['deal', dealId],
    queryFn: async () => {
      console.log("Fetching deal data for ID:", dealId);
      
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          contacts (*)
        `)
        .eq('id', dealId)
        .single();

      if (error) {
        console.error("Error fetching deal:", error);
        throw error;
      }

      console.log("Fetched deal data:", data);
      
      // Transform to expected structure
      const dealData = {
        id: data.id,
        title: data.title,
        value: data.value,
        stage: data.stage,
        contactId: data.contact_id,
        createdAt: data.created_at,
        closedAt: data.closed_at,
        description: data.description,
        probability: data.probability,
        contact: {
          id: data.contacts.id,
          name: data.contacts.name,
          company: data.contacts.company,
          email: data.contacts.email,
          phone: data.contacts.phone,
          position: data.contacts.position,
          status: data.contacts.status,
          avatar: data.contacts.avatar,
          tags: data.contacts.tags,
          createdAt: data.contacts.created_at,
          lastContact: data.contacts.last_contact
        }
      };

      return dealData as Deal;
    },
    staleTime: 300000, // 5 minutes 
  });
};
