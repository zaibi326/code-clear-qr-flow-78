
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap, Crown, Rocket, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const FuturisticPricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      description: "Perfect for small businesses and startups",
      monthlyPrice: 29,
      yearlyPrice: 24,
      features: [
        "Up to 1,000 QR codes",
        "Basic analytics",
        "Standard templates",
        "Email support",
        "Mobile app access",
        "Basic customization"
      ],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderGradient: "from-blue-500/50 to-cyan-500/50",
      popular: false
    },
    {
      name: "Professional",
      icon: Crown,
      description: "Advanced features for growing businesses",
      monthlyPrice: 79,
      yearlyPrice: 65,
      features: [
        "Up to 10,000 QR codes",
        "Advanced analytics",
        "Premium templates",
        "Priority support",
        "Team collaboration",
        "Custom branding",
        "A/B testing",
        "API access"
      ],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderGradient: "from-purple-500/50 to-pink-500/50",
      popular: true
    },
    {
      name: "Enterprise",
      icon: Rocket,
      description: "Unlimited power for large organizations",
      monthlyPrice: 199,
      yearlyPrice: 159,
      features: [
        "Unlimited QR codes",
        "Enterprise analytics",
        "Custom templates",
        "24/7 phone support",
        "Advanced team features",
        "White-label solution",
        "Advanced integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "Custom development"
      ],
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      borderGradient: "from-orange-500/50 to-red-500/50",
      popular: false
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,0 80,30 50,60 20,30" fill="white" opacity="0.03"><animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="20s" repeatCount="indefinite"/></polygon></svg>')] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold mb-8">
            <Star className="h-5 w-5 mr-2 text-purple-400" />
            Choose Your Power Level
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Plans Built for
            <span className="block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Every Ambition
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            From startups to Fortune 500 companies, find the perfect plan to accelerate 
            your QR journey with enterprise-grade features and uncompromising performance.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center p-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            
            return (
              <div
                key={index}
                className={`relative group ${
                  plan.popular ? 'scale-105 lg:scale-110' : ''
                }`}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`bg-gradient-to-r ${plan.gradient} text-white px-6 py-2 rounded-full font-bold text-sm shadow-2xl`}>
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className={`relative p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 group-hover:scale-105 overflow-hidden ${
                  plan.popular 
                    ? `border-purple-500/50 bg-gradient-to-br ${plan.bgGradient}` 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}>
                  
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Header */}
                  <div className="relative z-10 mb-8">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${plan.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-3xl font-black text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-lg">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="relative z-10 mb-8">
                    <div className="flex items-baseline">
                      <span className={`text-6xl font-black bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        ${price}
                      </span>
                      <span className="text-gray-400 text-xl ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    
                    {billingCycle === 'yearly' && (
                      <div className="text-green-400 font-semibold mt-2">
                        Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="relative z-10 mb-8 space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <div className={`p-1 rounded-full bg-gradient-to-r ${plan.gradient} mr-3 flex-shrink-0`}>
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="relative z-10">
                    <Button 
                      className={`w-full py-6 text-lg font-bold rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                        plan.popular
                          ? `bg-gradient-to-r ${plan.gradient} hover:shadow-2xl hover:shadow-purple-500/25 text-white border-0`
                          : `border-2 bg-gradient-to-r ${plan.bgGradient} hover:bg-gradient-to-r hover:${plan.bgGradient.replace('/10', '/20')} text-white border-white/20 hover:border-white/40`
                      }`}
                      asChild
                    >
                      <Link to="/register">
                        Get Started
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="text-center">
          <div className="inline-flex items-center px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <Check className="h-6 w-6 text-green-400 mr-4" />
            <span className="text-white font-semibold text-lg">
              All plans include 14-day free trial • No setup fees • Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FuturisticPricing;
