
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { Deal } from '@/data/sampleData';

interface DealBreadcrumbProps {
  stage: Deal['stage'];
  dealTitle: string;
}

const stageLabels: Record<Deal['stage'], string> = {
  lead: 'Leads',
  contact: 'Contacted',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed: 'Closed Won'
};

const DealBreadcrumb: React.FC<DealBreadcrumbProps> = ({ stage, dealTitle }) => {
  const navigate = useNavigate();
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/pipeline')}>
            Pipeline
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate(`/pipeline?stage=${stage}`)}>
            {stageLabels[stage]}
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbPage>{dealTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DealBreadcrumb;
