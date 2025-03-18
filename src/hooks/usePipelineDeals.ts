
import { useOptimizedQuery } from './useOptimizedQuery';
import { Deal } from '@/data/sampleData';

export function usePipelineDeals() {
  const { data = [], isLoading } = useOptimizedQuery<any>(
    ['deals'],
    'deals',
    {
      select: `
        id, 
        title, 
        value, 
        stage, 
        contact_id, 
        created_at, 
        closed_at, 
        description, 
        probability,
        contacts (id, name, company)
      `,
      order: ['created_at', { ascending: false }],
    }
  );
  
  // Transform the data to match our Deal type
  const deals = data.map((deal: any) => ({
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

  return { deals, isLoading };
}
