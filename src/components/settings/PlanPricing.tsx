
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Check, Crown, Zap, Star, CreditCard, Users, Database, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  current?: boolean;
}

export function PlanPricing() {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for getting started with QR code campaigns',
      current: currentPlan === 'free',
      features: [
        { name: 'QR Codes', included: true, limit: '50' },
        { name: 'Campaigns', included: true, limit: '5' },
        { name: 'Templates', included: true, limit: '10' },
        { name: 'Basic Analytics', included: true },
        { name: 'Email Support', included: true },
        { name: 'Storage', included: true, limit: '100MB' },
        { name: 'Advanced Analytics', included: false },
        { name: 'Priority Support', included: false },
        { name: 'White Label', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      period: 'month',
      description: 'For growing businesses and marketing teams',
      popular: true,
      current: currentPlan === 'pro',
      features: [
        { name: 'QR Codes', included: true, limit: '1,000' },
        { name: 'Campaigns', included: true, limit: '50' },
        { name: 'Templates', included: true, limit: 'Unlimited' },
        { name: 'Advanced Analytics', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Storage', included: true, limit: '1GB' },
        { name: 'API Access', included: true },
        { name: 'Custom Domains', included: true },
        { name: 'White Label', included: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'For large organizations with advanced needs',
      current: currentPlan === 'enterprise',
      features: [
        { name: 'QR Codes', included: true, limit: 'Unlimited' },
        { name: 'Campaigns', included: true, limit: 'Unlimited' },
        { name: 'Templates', included: true, limit: 'Unlimited' },
        { name: 'Advanced Analytics', included: true },
        { name: 'Dedicated Support', included: true },
        { name: 'Storage', included: true, limit: 'Unlimited' },
        { name: 'API Access', included: true },
        { name: 'Custom Domains', included: true },
        { name: 'White Label', included: true }
      ]
    }
  ];

  const usageStats = {
    qrCodes: { used: 156, limit: currentPlan === 'free' ? 50 : currentPlan === 'pro' ? 1000 : -1 },
    campaigns: { used: 12, limit: currentPlan === 'free' ? 5 : currentPlan === 'pro' ? 50 : -1 },
    storage: { used: 524288000, limit: currentPlan === 'free' ? 104857600 : currentPlan === 'pro' ? 1073741824 : -1 }
  };

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    const mb = bytes / (1024 * 1024);
    return gb >= 1 ? `${gb.toFixed(1)}GB` : `${mb.toFixed(0)}MB`;
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  const handlePlanChange = async (planId: string) => {
    if (planId === currentPlan) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentPlan(planId);
      
      const actionType = plans.find(p => p.id === planId)?.price > plans.find(p => p.id === currentPlan)?.price ? 'upgraded' : 'downgraded';
      
      toast({
        title: `Plan ${actionType} successfully!`,
        description: `You have been ${actionType} to the ${plans.find(p => p.id === planId)?.name} plan.`,
      });
    } catch (error) {
      toast({
        title: "Error changing plan",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentPlanName = () => {
    return plans.find(p => p.id === currentPlan)?.name || 'Pro';
  };

  const getCurrentPlanPrice = () => {
    return plans.find(p => p.id === currentPlan)?.price || 29;
  };

  return (
    <div className="space-y-6">
      {/* Current Usage */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Current Usage
          </CardTitle>
          <CardDescription>Your current plan usage and limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>QR Codes</span>
                <span className="font-medium">
                  {usageStats.qrCodes.used} / {usageStats.qrCodes.limit === -1 ? 'Unlimited' : usageStats.qrCodes.limit}
                </span>
              </div>
              <Progress value={getUsagePercentage(usageStats.qrCodes.used, usageStats.qrCodes.limit)} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Campaigns</span>
                <span className="font-medium">
                  {usageStats.campaigns.used} / {usageStats.campaigns.limit === -1 ? 'Unlimited' : usageStats.campaigns.limit}
                </span>
              </div>
              <Progress value={getUsagePercentage(usageStats.campaigns.used, usageStats.campaigns.limit)} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span className="font-medium">
                  {formatStorage(usageStats.storage.used)} / {usageStats.storage.limit === -1 ? 'Unlimited' : formatStorage(usageStats.storage.limit)}
                </span>
              </div>
              <Progress value={getUsagePercentage(usageStats.storage.used, usageStats.storage.limit)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative shadow-sm ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
            )}
            {plan.current && (
              <Badge className="absolute -top-3 right-4 bg-green-500">
                Current Plan
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                {plan.id === 'free' && <Users className="h-8 w-8 text-gray-500" />}
                {plan.id === 'pro' && <Zap className="h-8 w-8 text-blue-500" />}
                {plan.id === 'enterprise' && <Crown className="h-8 w-8 text-purple-500" />}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300 mr-3 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${!feature.included ? 'text-gray-500' : ''}`}>
                      {feature.name}
                      {feature.limit && feature.included && (
                        <span className="text-gray-600 ml-1">({feature.limit})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                disabled={plan.current || isProcessing}
                onClick={() => handlePlanChange(plan.id)}
              >
                {isProcessing ? (
                  "Processing..."
                ) : plan.current ? (
                  "Current Plan"
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {plan.price > getCurrentPlanPrice() ? 'Upgrade' : 'Switch'} to {plan.name}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Billing Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-gray-600">{getCurrentPlanName()} Plan - ${getCurrentPlanPrice()}/month</p>
            </div>
            <Badge className="bg-green-100 text-green-700">Active</Badge>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Next Billing Date</p>
              <p className="text-sm text-gray-600">June 26, 2024</p>
            </div>
            <Button variant="outline" size="sm">
              Update Payment Method
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Billing History</p>
              <p className="text-sm text-gray-600">View past invoices and payments</p>
            </div>
            <Button variant="outline" size="sm">
              View History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
