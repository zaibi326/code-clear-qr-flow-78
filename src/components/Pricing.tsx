
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for small businesses and individual creators',
      features: [
        'Up to 50 QR codes',
        'Basic analytics',
        'Standard templates',
        'Email support',
        'SSL security'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: <Users className="h-8 w-8 text-gray-500" />
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing businesses and marketing teams',
      features: [
        'Up to 1,000 QR codes',
        'Advanced analytics',
        'Custom branding',
        'API access',
        'Priority support',
        'Team collaboration',
        'Bulk operations'
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'default' as const,
      popular: true,
      icon: <Zap className="h-8 w-8 text-blue-500" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations with advanced needs',
      features: [
        'Unlimited QR codes',
        'Enterprise analytics',
        'White-label solution',
        'Dedicated support',
        'Custom integrations',
        'Advanced security',
        'SLA guarantee'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: <Crown className="h-8 w-8 text-purple-500" />
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    if (planId === currentPlan) {
      // Redirect to dashboard if already on this plan
      window.location.href = '/dashboard';
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentPlan(planId);
      
      toast({
        title: "Plan selected successfully!",
        description: `You have selected the ${plans.find(p => p.id === planId)?.name} plan.`,
      });

      // Redirect to register/login for plan setup
      setTimeout(() => {
        window.location.href = '/register';
      }, 1000);
    } catch (error) {
      toast({
        title: "Error selecting plan",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your business. Start free, upgrade when you're ready. 
            No hidden fees, no surprises.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 border border-gray-200">
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium">
              Monthly
            </button>
            <button className="px-4 py-2 rounded-md text-gray-600 font-medium">
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-blue-500 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-blue-300'
              } ${currentPlan === plan.id ? 'ring-2 ring-green-500' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {currentPlan === plan.id && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-green-500">Current Plan</Badge>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-end justify-center">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.buttonVariant}
                className={`w-full py-3 text-lg font-semibold ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    : ''
                }`}
                disabled={isProcessing}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {isProcessing ? (
                  "Processing..."
                ) : currentPlan === plan.id ? (
                  "Go to Dashboard"
                ) : (
                  plan.buttonText
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>99.9% uptime SLA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
