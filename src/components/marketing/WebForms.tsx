
import React from 'react';
import { WebForm } from '@/data/sampleData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormInput, BarChart3, Calendar } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface WebFormsProps {
  forms: WebForm[];
}

const WebForms: React.FC<WebFormsProps> = ({ forms }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Web Forms</h2>
        <Button>
          <FormInput className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forms.map((form) => (
          <Card key={form.id} className="overflow-hidden hover:shadow-md transition-all duration-300 animate-scale-in">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">{form.name}</h3>
                <div className="flex items-center">
                  <Switch checked={form.status === 'active'} />
                  <Badge variant="outline" className="ml-2">
                    {form.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center text-sm">
                  <FormInput className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>{form.fields.length} fields: {form.fields.join(', ')}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>Created on: {formatDate(form.createdAt)}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <BarChart3 className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>{form.submissions} submissions</span>
                  {form.conversionRate && (
                    <span className="ml-3">Conversion: {form.conversionRate}%</span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                <Button variant="outline" size="sm" className="mr-2">Embed</Button>
                <Button size="sm">View Submissions</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebForms;
