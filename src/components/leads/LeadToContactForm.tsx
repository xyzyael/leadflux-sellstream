
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const contactSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(['lead', 'prospect', 'customer', 'churned']),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface LeadToContactFormProps {
  lead: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    position?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const LeadToContactForm: React.FC<LeadToContactFormProps> = ({ lead, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || '',
      position: lead.position || '',
      status: 'lead',
    },
  });

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      console.log("Converting lead to contact", values);
      
      // First, create the contact
      const { data: contact, error: contactError } = await supabase
        .from('contacts')
        .insert({
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          company: values.company || null,
          position: values.position || null,
          status: values.status,
        })
        .select('id')
        .single();

      if (contactError) {
        console.error("Contact creation error:", contactError);
        throw contactError;
      }

      console.log("Created contact", contact);

      // Update the lead status to 'in_pipeline'
      const { error: leadError } = await supabase
        .from('leads')
        .update({ status: 'in_pipeline' })
        .eq('id', lead.id);

      if (leadError) {
        console.error("Lead update error:", leadError);
        throw leadError;
      }

      console.log("Updated lead status");

      // Create a new deal if the contact was created successfully
      if (contact && contact.id) {
        const dealTitle = values.company 
          ? `${values.company} Deal` 
          : `${values.name} Deal`;
          
        const { error: dealError } = await supabase
          .from('deals')
          .insert({
            title: dealTitle,
            value: 0, // Default value, can be updated later
            stage: 'lead',
            contact_id: contact.id,
            description: `Deal created from lead: ${values.name}`,
            probability: 10, // Default probability
          });

        if (dealError) {
          console.error("Deal creation error:", dealError);
          throw dealError;
        }
        
        console.log("Created deal for contact");
      }

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });

      toast({
        title: "Contact created",
        description: `${values.name} has been added to your contacts and pipeline.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error converting lead to contact:', error);
      toast({
        title: "Error",
        description: "There was a problem converting the lead. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 234 567 8901" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="churned">Churned</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Marketing Director" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Convert to Contact</Button>
        </div>
      </form>
    </Form>
  );
};

export default LeadToContactForm;
