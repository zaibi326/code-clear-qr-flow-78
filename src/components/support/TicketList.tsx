
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare, Calendar, Tag, AlertCircle } from 'lucide-react';

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
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertCircle className="h-3 w-3" aria-hidden="true" />;
    }
    return null;
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="responsive-padding pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" aria-hidden="true" />
          My Support Tickets
        </CardTitle>
        <CardDescription>
          View and manage your submitted support tickets
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {tickets.length === 0 ? (
          <div className="text-center py-12 px-6">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
            <p className="text-gray-600 text-balance">You haven't submitted any support tickets yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="w-32">Type</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-24">Priority</TableHead>
                    <TableHead className="w-28">Created</TableHead>
                    <TableHead className="w-20">Responses</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium font-mono text-sm">{ticket.id}</TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate font-medium" title={ticket.subject}>
                          {ticket.subject}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{ticket.issueType}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)} variant="outline">
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                          <span className="flex items-center gap-1">
                            {getPriorityIcon(ticket.priority)}
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{ticket.createdAt}</TableCell>
                      <TableCell className="text-center">{ticket.responses}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          aria-label={`View ticket ${ticket.id}`}
                        >
                          <Eye className="h-3 w-3" aria-hidden="true" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile card view */}
            <div className="lg:hidden space-y-4 p-4 sm:p-6">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-xs text-gray-500 mb-1">
                          {ticket.id}
                        </div>
                        <h4 className="font-medium text-sm leading-tight text-gray-900 line-clamp-2">
                          {ticket.subject}
                        </h4>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="shrink-0"
                        aria-label={`View ticket ${ticket.id}`}
                      >
                        <Eye className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Tag className="h-3 w-3 text-gray-400" aria-hidden="true" />
                        <span className="text-gray-600">{ticket.issueType}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3 text-gray-400" aria-hidden="true" />
                        <span className="text-gray-600">Created {ticket.createdAt}</span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(ticket.status)} variant="outline">
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                            <span className="flex items-center gap-1">
                              {getPriorityIcon(ticket.priority)}
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                            </span>
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {ticket.responses} responses
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
