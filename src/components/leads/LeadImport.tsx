
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, 
  FileText, 
  Check, 
  FileSpreadsheet 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { leadCampaigns } from '@/data/sampleData';

interface LeadImportProps {
  setActiveTab: (tab: string) => void;
}

const LeadImport: React.FC<LeadImportProps> = ({ setActiveTab }) => {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [importStep, setImportStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [batchSize, setBatchSize] = useState('25');
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (!selectedCampaign) {
      toast({
        title: "No campaign selected",
        description: "Please select a campaign before uploading a file.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate file upload process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress === 100) {
        clearInterval(interval);
        // Simulate sample data
        const mockData = [
          { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', company: 'Acme Inc', position: 'CEO' },
          { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', company: 'Tech Corp', position: 'CTO' },
          { firstName: 'Mike', lastName: 'Johnson', email: 'mike.j@example.com', company: 'Global Logistics', position: 'Operations Manager' },
        ];
        setSampleData(mockData);
        setImportStep(2);
        
        toast({
          title: "File uploaded successfully",
          description: `${files[0].name} has been uploaded.`
        });
      }
    }, 300);
  };
  
  const handleImport = () => {
    // In a real app, we would import the leads to the database here
    toast({
      title: "Leads imported",
      description: `${sampleData.length} leads have been imported to the selected campaign.`
    });
    setImportStep(3);
  };
  
  const handleFinish = () => {
    setActiveTab('leads');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1: Upload File */}
            <div className={`${importStep > 1 ? 'opacity-60' : ''}`}>
              <div className="flex items-center mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </div>
                <div className="ml-4 font-medium">Upload Lead List</div>
              </div>
              
              <div className="space-y-4">
                <div className="w-full md:w-1/2">
                  <label className="text-sm font-medium mb-2 block">Select Campaign</label>
                  <Select
                    value={selectedCampaign}
                    onValueChange={setSelectedCampaign}
                    disabled={importStep > 1}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {leadCampaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name} ({campaign.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {uploadProgress > 0 && uploadProgress < 100 ? (
                    <div className="space-y-4">
                      <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground" />
                      <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                      <div className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium">Upload Lead File</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Upload a CSV or Excel file with your leads. The file should include names, email addresses, and company information.
                      </p>
                      <div>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Button 
                            variant="outline" 
                            className="relative"
                            disabled={importStep > 1 || !selectedCampaign}
                          >
                            <input
                              id="file-upload"
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              accept=".csv,.xlsx,.xls"
                              onChange={handleFileUpload}
                              disabled={importStep > 1 || !selectedCampaign}
                            />
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Step 2: Configure Import */}
            {importStep >= 2 && (
              <div className={`${importStep > 2 ? 'opacity-60' : ''}`}>
                <div className="flex items-center mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="ml-4 font-medium">Configure Import</div>
                </div>
                
                <div className="space-y-4">
                  <div className="w-full md:w-1/2">
                    <label className="text-sm font-medium mb-2 block">Batch Size for Pipeline</label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        value={batchSize}
                        onChange={(e) => setBatchSize(e.target.value)}
                        className="w-24"
                        min="1"
                        disabled={importStep > 2}
                      />
                      <span className="text-sm text-muted-foreground">leads per batch</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This controls how many leads will be added to the pipeline at once to prevent cluttering.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2 text-sm font-medium">
                      Data Preview
                    </div>
                    <div className="max-h-72 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Position</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sampleData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.firstName}</TableCell>
                              <TableCell>{row.lastName}</TableCell>
                              <TableCell>{row.email}</TableCell>
                              <TableCell>{row.company}</TableCell>
                              <TableCell>{row.position}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleImport} disabled={importStep > 2}>
                      Import {sampleData.length} Leads
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Completion */}
            {importStep === 3 && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="ml-4 font-medium">Import Complete</div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg text-center">
                    <Check className="h-12 w-12 mx-auto text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-medium mt-2">Import Successful</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                      {sampleData.length} leads have been imported successfully. You can now view and manage them in the lead lists.
                    </p>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleFinish}>
                      View Lead Lists
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadImport;
