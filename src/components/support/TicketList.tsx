
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  issueType: string;
  createdAt: string;
  lastResponse: string;
  responses: number;
}

export function TicketList() {
  // Mock data for demonstration
  const tickets: Ticket[] = [
    {
      id: 'SUP-123456',
      subject: 'QR Code not generating properly',
      status: 'open',
      priority: 'high',
      issueType: 'Technical Issue',
      createdAt: '2024-01-15',
      lastResponse: '2024-01-15',
      responses: 2
    },
    {
      id: 'SUP-123455',
      subject: 'Billing question about subscription',
      status: 'resolved',
      priority: 'medium',
      issueType: 'Billing Question',
      createdAt: '2024-01-10',
      lastResponse: '2024-01-12',
      responses: 4
    },
    {
      id: 'SUP-123454',
      subject: 'Feature request for bulk upload',
      status: 'pending',
      priority: 'low',
      issueType: 'Feature Request',
      createdAt: '2024-01-08',
      lastResponse: '2024-01-09',
      responses: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>My Support Tickets</CardTitle>
        <CardDescription>
          View and manage your submitted support tickets
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
            <p className="text-gray-600">You haven't submitted any support tickets yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Responses</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={ticket.subject}>
                        {ticket.subject}
                      </div>
                    </TableCell>
                    <TableCell>{ticket.issueType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.createdAt}</TableCell>
                    <TableCell>{ticket.responses}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
