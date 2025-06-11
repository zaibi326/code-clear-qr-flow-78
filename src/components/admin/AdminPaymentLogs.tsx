
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Download, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentLog {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_id: string | null;
  payment_method: string | null;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export const AdminPaymentLogs = () => {
  const [payments, setPayments] = useState<PaymentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      // First fetch payment logs
      const { data: paymentLogs, error: paymentError } = await supabase
        .from('payment_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentError) {
        console.error('Error fetching payments:', paymentError);
        toast({
          title: "Error",
          description: "Failed to fetch payment logs",
          variant: "destructive"
        });
        return;
      }

      // Then fetch user profiles separately
      const userIds = [...new Set(paymentLogs?.map(log => log.user_id) || [])];
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
      }

      // Combine the data
      const transformedPayments = paymentLogs?.map(log => ({
        ...log,
        user: profiles?.find(profile => profile.id === log.user_id) || {
          name: 'Unknown User',
          email: 'No email'
        }
      })) || [];

      setPayments(transformedPayments);
    } catch (error) {
      console.error('Error in fetchPayments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const exportPayments = () => {
    const csvContent = [
      ['Date', 'User', 'Email', 'Amount', 'Currency', 'Status', 'Transaction ID', 'Payment Method'],
      ...filteredPayments.map(payment => [
        new Date(payment.created_at).toLocaleDateString(),
        payment.user?.name || '',
        payment.user?.email || '',
        payment.amount.toString(),
        payment.currency,
        payment.status,
        payment.transaction_id || '',
        payment.payment_method || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Payment logs have been exported to CSV",
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalAmount = filteredPayments
    .filter(p => p.status.toLowerCase() === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Logs</h2>
          <p className="text-gray-600">View and manage payment transactions</p>
        </div>
        <Button onClick={exportPayments} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              ${totalAmount.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredPayments.filter(p => p.status.toLowerCase() === 'completed').length}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredPayments.filter(p => p.status.toLowerCase() === 'pending').length}
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {filteredPayments.filter(p => p.status.toLowerCase() === 'failed').length}
            </div>
            <p className="text-sm text-gray-600">Failed</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Transactions ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Transaction ID</th>
                  <th className="text-left p-3 font-medium">Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-600">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{payment.user?.name}</div>
                        <div className="text-sm text-gray-500">{payment.user?.email}</div>
                      </div>
                    </td>
                    <td className="p-3 font-medium">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </td>
                    <td className="p-3">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="p-3 text-gray-600 font-mono text-xs">
                      {payment.transaction_id || 'N/A'}
                    </td>
                    <td className="p-3 text-gray-600">
                      {payment.payment_method || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
