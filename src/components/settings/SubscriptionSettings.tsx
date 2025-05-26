
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Crown, Calendar, CreditCard, Download } from 'lucide-react';

export function SubscriptionSettings() {
  const currentPlan = {
    name: 'Premium',
    price: '$29/month',
    features: ['Unlimited QR Codes', 'Advanced Analytics', 'Custom Branding', 'Priority Support'],
    nextBilling: 'March 15, 2024',
    status: 'Active'
  };

  const billingHistory = [
    { date: 'Feb 15, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-001' },
    { date: 'Jan 15, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-002' },
    { date: 'Dec 15, 2023', amount: '$29.00', status: 'Paid', invoice: 'INV-003' },
  ];

  const plans = [
    {
      name: 'Basic',
      price: '$9/month',
      features: ['10 QR Codes', 'Basic Analytics', 'Standard Support'],
      current: false
    },
    {
      name: 'Premium',
      price: '$29/month',
      features: ['Unlimited QR Codes', 'Advanced Analytics', 'Custom Branding', 'Priority Support'],
      current: true
    },
    {
      name: 'Enterprise',
      price: '$99/month',
      features: ['Everything in Premium', 'White-label Solution', 'API Access', 'Dedicated Account Manager'],
      current: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{currentPlan.name} Plan</h3>
              <p className="text-gray-600">{currentPlan.price}</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {currentPlan.status}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Next billing: {currentPlan.nextBilling}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Payment method: •••• 4242</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button>Manage Subscription</Button>
            <Button variant="outline">Update Payment Method</Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Upgrade or downgrade your subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.current ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.current && (
                  <Badge className="absolute -top-2 left-4 bg-blue-500">
                    Current Plan
                  </Badge>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-2xl font-bold">{plan.price}</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.current ? "secondary" : "default"} 
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((bill) => (
                <TableRow key={bill.invoice}>
                  <TableCell>{bill.date}</TableCell>
                  <TableCell>{bill.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{bill.invoice}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
