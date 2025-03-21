
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import ContactQuickAdd from './ContactQuickAdd';
import { UserPlus } from 'lucide-react';

const dealFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Value must be a positive number.",
  }),
  stage: z.enum(['lead', 'contact', 'proposal', 'negotiation', 'closed']),
  probability: z.string().refine((val) => {
    if (!val) return true;
    const num = Number(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, {
    message: "Probability must be between 0 and 100.",
  }).optional(),
  contactId: z.string().min(1, {
    message: "Please select a contact.",
  }),
  description: z.string().optional(),
});

export type DealFormValues = z.infer<typeof dealFormSchema>;

interface DealFormProps {
  onSubmit: (values: DealFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<DealFormValues> & { id?: string };
}

const DealForm: React.FC<DealFormProps> = ({ 
  onSubmit, 
  onCancel, 
  defaultValues = {
    title: '',
    value: '',
    stage: 'lead',
    probability: '',
    contactId: '',
    description: ''
  } 
}) => {
  const { toast } = useToast();
  const [showQuickAddContact, setShowQuickAddContact] = useState(false);
  
  console.log("DealForm initialized with defaultValues:", defaultValues);
  
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues,
  });

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      console.log("Fetching contacts for DealForm");
      const { data, error } = await supabase
        .from('contacts')
        .select('id, name, company')
        .order('name');
      
      if (error) {
        console.error("Error fetching contacts:", error);
        throw error;
      }
      
      console.log("Fetched contacts:", data);
      return data || [];
    }
  });

  const handleSubmit = async (values: DealFormValues) => {
    console.log("Form submitted with values:", values);
    onSubmit(values);
  };

  const handleContactSuccess = (contactId: string) => {
    console.log("New contact created with ID:", contactId);
    form.setValue('contactId', contactId);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deal Title*</FormLabel>
              <FormControl>
                <Input placeholder="Enterprise Software Solution" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value*</FormLabel>
                <FormControl>
                  <Input placeholder="10000" type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="probability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probability (%)</FormLabel>
                <FormControl>
                  <Input placeholder="50" type="number" min="0" max="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Associated Contact*</FormLabel>
                  <ContactQuickAdd onSuccess={handleContactSuccess} />
                </div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading">Loading contacts...</SelectItem>
                    ) : contacts && contacts.length > 0 ? (
                      contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} {contact.company ? `(${contact.company})` : ''}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none">No contacts found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Details about this deal..." 
                  className="resize-none min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => {
              console.log("Cancel button clicked");
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save Deal</Button>
        </div>
      </form>
    </Form>
  );
};

export default DealForm;
