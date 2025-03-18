
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Note {
  id: string;
  content: string;
  date: Date;
}

interface ContactNotesProps {
  contactId: string;
}

const ContactNotes: React.FC<ContactNotesProps> = ({ contactId }) => {
  // In a real app, these would be fetched from an API based on contactId
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Had a productive call discussing their needs for a new CRM system.',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      id: '2',
      content: 'Sent follow-up email with product documentation and pricing.',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ]);
  
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const { toast } = useToast();
  
  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      content: newNoteContent,
      date: new Date()
    };
    
    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setIsAddingNote(false);
    
    toast({
      title: "Note added",
      description: "Your note has been saved successfully."
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Contact Notes</h3>
        {!isAddingNote && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsAddingNote(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        )}
      </div>
      
      {isAddingNote && (
        <Card>
          <CardContent className="p-3">
            <Textarea
              placeholder="Enter your note here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[100px] mb-3"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteContent('');
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddNote}>
                <Save className="h-4 w-4 mr-1" />
                Save Note
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {notes.length === 0 && !isAddingNote ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No notes yet. Click "Add Note" to create one.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-700" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {formatDate(note.date)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactNotes;
