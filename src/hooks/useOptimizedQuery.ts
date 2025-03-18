
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useOptimizedQuery<T>(
  key: string[], 
  table: string, 
  options?: {
    select?: string;
    filter?: Record<string, any>;
    order?: [string, { ascending: boolean }];
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      let query = supabase.from(table).select(options?.select || '*');
      
      // Apply any filters
      if (options?.filter) {
        Object.entries(options.filter).forEach(([column, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(column, value);
          }
        });
      }
      
      // Apply ordering
      if (options?.order) {
        query = query.order(options.order[0], { ascending: options.order[1].ascending });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Error fetching ${table}:`, error);
        throw error;
      }
      
      return data as T[];
    },
    enabled: options?.enabled !== false,
  });
}
