
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: 'lead' | 'prospect' | 'customer' | 'churned';
  lastContact?: string;
  tags?: string[];
  avatar?: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'lead' | 'contact' | 'proposal' | 'negotiation' | 'closed';
  contactId: string;
  contact?: Contact;
  createdAt: string;
  closedAt?: string;
  description?: string;
  probability?: number;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'task' | 'note';
  title: string;
  description?: string;
  date: string;
  contactId?: string;
  dealId?: string;
  completed?: boolean;
  dueDate?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  type: 'email' | 'social' | 'ads';
  audience: string;
  sentCount?: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
}

export interface WebForm {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  fields: string[];
  submissions: number;
  conversionRate?: number;
  createdAt: string;
}

// Sample data
export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 555-123-4567',
    company: 'Acme Inc',
    position: 'Marketing Director',
    status: 'lead',
    lastContact: '2023-10-15T14:30:00Z',
    tags: ['marketing', 'enterprise'],
    createdAt: '2023-10-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 555-987-6543',
    company: 'TechCorp',
    position: 'CTO',
    status: 'prospect',
    lastContact: '2023-10-18T09:15:00Z',
    tags: ['tech', 'decision-maker'],
    createdAt: '2023-09-28T14:20:00Z'
  },
  {
    id: '3',
    name: 'Emma Williams',
    email: 'emma.williams@example.com',
    phone: '+1 555-456-7890',
    company: 'Design Studio',
    position: 'Creative Director',
    status: 'customer',
    lastContact: '2023-10-20T16:45:00Z',
    tags: ['design', 'repeat-customer'],
    createdAt: '2023-08-15T11:30:00Z'
  },
  {
    id: '4',
    name: 'James Rodriguez',
    email: 'james.rodriguez@example.com',
    phone: '+1 555-234-5678',
    company: 'Global Logistics',
    position: 'Operations Manager',
    status: 'lead',
    lastContact: '2023-10-12T13:20:00Z',
    tags: ['logistics', 'potential'],
    createdAt: '2023-10-05T09:45:00Z'
  },
  {
    id: '5',
    name: 'Sofia Nguyen',
    email: 'sofia.nguyen@example.com',
    phone: '+1 555-876-5432',
    company: 'Health Innovations',
    position: 'Product Manager',
    status: 'prospect',
    lastContact: '2023-10-19T10:30:00Z',
    tags: ['healthcare', 'product'],
    createdAt: '2023-09-22T15:10:00Z'
  },
  {
    id: '6',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 555-345-6789',
    company: 'Financial Solutions',
    position: 'Financial Advisor',
    status: 'customer',
    lastContact: '2023-10-17T11:00:00Z',
    tags: ['finance', 'vip'],
    createdAt: '2023-07-10T13:15:00Z'
  },
  {
    id: '7',
    name: 'Olivia Martinez',
    email: 'olivia.martinez@example.com',
    phone: '+1 555-654-3210',
    company: 'Education First',
    position: 'Director of Sales',
    status: 'lead',
    lastContact: '2023-10-16T15:20:00Z',
    tags: ['education', 'sales'],
    createdAt: '2023-10-03T08:30:00Z'
  },
  {
    id: '8',
    name: 'Daniel Lee',
    email: 'daniel.lee@example.com',
    phone: '+1 555-789-0123',
    company: 'Green Energy',
    position: 'Sustainability Officer',
    status: 'prospect',
    lastContact: '2023-10-13T09:00:00Z',
    tags: ['energy', 'sustainability'],
    createdAt: '2023-09-18T16:45:00Z'
  }
];

export const deals: Deal[] = [
  {
    id: '1',
    title: 'Enterprise Marketing Solution',
    value: 15000,
    stage: 'proposal',
    contactId: '1',
    createdAt: '2023-10-05T09:15:00Z',
    description: 'Comprehensive marketing platform for enterprise needs',
    probability: 60
  },
  {
    id: '2',
    title: 'TechCorp Infrastructure Upgrade',
    value: 45000,
    stage: 'negotiation',
    contactId: '2',
    createdAt: '2023-09-30T14:20:00Z',
    description: 'Complete overhaul of server infrastructure',
    probability: 75
  },
  {
    id: '3',
    title: 'Design Services Renewal',
    value: 12000,
    stage: 'closed',
    contactId: '3',
    createdAt: '2023-10-10T11:05:00Z',
    closedAt: '2023-10-15T16:30:00Z',
    description: 'Annual renewal of design services package',
    probability: 100
  },
  {
    id: '4',
    title: 'Logistics Software Implementation',
    value: 28000,
    stage: 'contact',
    contactId: '4',
    createdAt: '2023-10-12T10:20:00Z',
    description: 'Installation and setup of logistics management software',
    probability: 40
  },
  {
    id: '5',
    title: 'Healthcare Product Integration',
    value: 35000,
    stage: 'proposal',
    contactId: '5',
    createdAt: '2023-10-08T13:45:00Z',
    description: 'Integration of our product with existing healthcare systems',
    probability: 55
  },
  {
    id: '6',
    title: 'Financial Services Package',
    value: 20000,
    stage: 'closed',
    contactId: '6',
    createdAt: '2023-09-20T09:30:00Z',
    closedAt: '2023-10-10T15:15:00Z',
    description: 'Premium financial services package for high-value clients',
    probability: 100
  },
  {
    id: '7',
    title: 'Education Platform Subscription',
    value: 18000,
    stage: 'lead',
    contactId: '7',
    createdAt: '2023-10-15T08:10:00Z',
    description: 'Annual subscription to education management platform',
    probability: 25
  },
  {
    id: '8',
    title: 'Sustainability Consultation',
    value: 22000,
    stage: 'contact',
    contactId: '8',
    createdAt: '2023-10-13T11:20:00Z',
    description: 'Comprehensive sustainability consultation and reporting',
    probability: 35
  }
];

export const activities: Activity[] = [
  {
    id: '1',
    type: 'call',
    title: 'Initial discovery call',
    description: 'Discussed potential marketing needs and solutions',
    date: '2023-10-15T14:30:00Z',
    contactId: '1',
    dealId: '1',
    completed: true
  },
  {
    id: '2',
    type: 'email',
    title: 'Sent proposal',
    description: 'Emailed detailed proposal with pricing options',
    date: '2023-10-16T09:15:00Z',
    contactId: '1',
    dealId: '1',
    completed: true
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Technical review',
    description: 'Meeting with technical team to discuss infrastructure requirements',
    date: '2023-10-18T13:00:00Z',
    contactId: '2',
    dealId: '2',
    completed: true
  },
  {
    id: '4',
    type: 'note',
    title: 'Contract notes',
    description: 'Client requested revisions to service level agreement',
    date: '2023-10-19T10:45:00Z',
    contactId: '2',
    dealId: '2',
    completed: true
  },
  {
    id: '5',
    type: 'task',
    title: 'Follow up on proposal',
    description: 'Schedule call to discuss proposal details',
    date: '2023-10-20T00:00:00Z',
    contactId: '5',
    dealId: '5',
    completed: false,
    dueDate: '2023-10-23T17:00:00Z'
  },
  {
    id: '6',
    type: 'email',
    title: 'Thank you email',
    description: 'Sent thank you email with next steps',
    date: '2023-10-15T15:30:00Z',
    contactId: '3',
    dealId: '3',
    completed: true
  },
  {
    id: '7',
    type: 'task',
    title: 'Prepare demo',
    description: 'Prepare customized demo for logistics software',
    date: '2023-10-14T09:00:00Z',
    contactId: '4',
    dealId: '4',
    completed: true,
    dueDate: '2023-10-16T17:00:00Z'
  },
  {
    id: '8',
    type: 'call',
    title: 'Discovery call',
    description: 'Initial call to understand educational requirements',
    date: '2023-10-16T11:30:00Z',
    contactId: '7',
    dealId: '7',
    completed: true
  }
];

export const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q4 Newsletter',
    status: 'completed',
    type: 'email',
    audience: 'All Customers',
    sentCount: 1250,
    openRate: 28.4,
    clickRate: 12.3,
    createdAt: '2023-09-25T09:00:00Z',
    scheduledAt: '2023-10-01T08:00:00Z',
    completedAt: '2023-10-01T08:30:00Z'
  },
  {
    id: '2',
    name: 'Product Launch Announcement',
    status: 'active',
    type: 'email',
    audience: 'Prospects and Customers',
    sentCount: 2150,
    openRate: 31.5,
    clickRate: 18.7,
    createdAt: '2023-10-10T14:00:00Z',
    scheduledAt: '2023-10-15T09:00:00Z'
  },
  {
    id: '3',
    name: 'Holiday Promotion',
    status: 'scheduled',
    type: 'email',
    audience: 'All Contacts',
    createdAt: '2023-10-18T11:30:00Z',
    scheduledAt: '2023-11-20T08:00:00Z'
  },
  {
    id: '4',
    name: 'Customer Satisfaction Survey',
    status: 'draft',
    type: 'email',
    audience: 'Active Customers',
    createdAt: '2023-10-19T15:45:00Z'
  }
];

export const webForms: WebForm[] = [
  {
    id: '1',
    name: 'Contact Us Form',
    status: 'active',
    fields: ['name', 'email', 'company', 'message'],
    submissions: 87,
    conversionRate: 3.2,
    createdAt: '2023-09-05T10:15:00Z'
  },
  {
    id: '2',
    name: 'Newsletter Sign Up',
    status: 'active',
    fields: ['email', 'name'],
    submissions: 412,
    conversionRate: 5.8,
    createdAt: '2023-08-15T09:30:00Z'
  },
  {
    id: '3',
    name: 'Product Demo Request',
    status: 'active',
    fields: ['name', 'email', 'company', 'phone', 'product_interest'],
    submissions: 54,
    conversionRate: 12.5,
    createdAt: '2023-09-20T14:00:00Z'
  },
  {
    id: '4',
    name: 'Event Registration',
    status: 'inactive',
    fields: ['name', 'email', 'company', 'job_title', 'dietary_requirements'],
    submissions: 128,
    conversionRate: 8.7,
    createdAt: '2023-07-10T11:45:00Z'
  }
];

export const getRecentActivities = (limit = 5): Activity[] => {
  return [...activities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, limit);
};

export const getDealsByStage = (): Record<Deal['stage'], Deal[]> => {
  return deals.reduce((acc, deal) => {
    if (!acc[deal.stage]) {
      acc[deal.stage] = [];
    }
    acc[deal.stage].push({
      ...deal,
      contact: contacts.find(contact => contact.id === deal.contactId)
    });
    return acc;
  }, {} as Record<Deal['stage'], Deal[]>);
};

export const getContactsByStatus = (): Record<Contact['status'], number> => {
  return contacts.reduce((acc, contact) => {
    acc[contact.status] = (acc[contact.status] || 0) + 1;
    return acc;
  }, {} as Record<Contact['status'], number>);
};

export const getTotalDealValue = (): number => {
  return deals.reduce((sum, deal) => sum + deal.value, 0);
};

export const getOpenDealValue = (): number => {
  return deals
    .filter(deal => deal.stage !== 'closed')
    .reduce((sum, deal) => sum + deal.value, 0);
};

export const getMonthlyRevenue = (): { month: string; revenue: number }[] => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 38000 },
    { month: 'Mar', revenue: 45000 },
    { month: 'Apr', revenue: 56000 },
    { month: 'May', revenue: 61000 },
    { month: 'Jun', revenue: 58000 },
    { month: 'Jul', revenue: 63000 },
    { month: 'Aug', revenue: 55000 },
    { month: 'Sep', revenue: 67000 },
    { month: 'Oct', revenue: 72000 },
    { month: 'Nov', revenue: 0 },
    { month: 'Dec', revenue: 0 }
  ];
};
