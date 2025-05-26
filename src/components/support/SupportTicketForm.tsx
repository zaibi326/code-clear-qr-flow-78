
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SupportTicketForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    issueType: '',
    description: '',
    priority: 'medium'
  });
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const issueTypes = [
    'Technical Issue',
    'Billing Question',
    'Feature Request',
    'Account Access',
    'QR Code Problem',
    'Campaign Issue',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.issueType || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    console.log('Submitting support ticket:', formData);
    console.log('Attached file:', attachedFile);
    
    setIsSubmitted(true);
    toast({
      title: "Ticket Submitted",
      description: "Your support ticket has been submitted successfully. We'll get back to you soon!",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      toast({
        title: "File Attached",
        description: `${file.name} has been attached to your ticket.`,
      });
    }
  };

  if (isSubmitted) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ticket Submitted Successfully!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for contacting us. Your ticket has been submitted and assigned ID: <strong>#SUP-{Date.now().toString().slice(-6)}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            We'll review your request and get back to you within 24 hours.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Submit Another Ticket
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Submit a Support Ticket</CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your issue"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueType">Issue Type *</Label>
              <Select
                value={formData.issueType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, issueType: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide a detailed description of your issue..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="attachment"
                className="hidden"
                onChange={handleFileUpload}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
              />
              <label htmlFor="attachment" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {attachedFile ? (
                    <span className="text-green-600 font-medium">{attachedFile.name}</span>
                  ) : (
                    <>
                      Click to upload or drag and drop<br />
                      <span className="text-xs">PNG, JPG, PDF, DOC up to 10MB</span>
                    </>
                  )}
                </p>
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full flex items-center gap-2">
            <Send className="h-4 w-4" />
            Submit Ticket
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
