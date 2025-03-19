
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/data/sampleData';

export const useDealsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      console.log("Fetching deals data...");
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          contacts (
            id,
            name,
            company
          )
        `);

      if (error) {
        console.error("Error fetching deals:", error);
        throw error;
      }

      console.log("Fetched deals data:", data);
      
      // Transform the data to match the expected structure
      const transformedDeals = data.map(deal => ({
        id: deal.id,
        title: deal.title,
        value: deal.value,
        stage: deal.stage,
        contactId: deal.contact_id,
        createdAt: deal.created_at,
        closedAt: deal.closed_at,
        description: deal.description,
        probability: deal.probability,
        contact: deal.contacts
      }));

      return transformedDeals as Deal[];
    },
    enabled,
    staleTime: 60000, // 1 minute
  });
};
