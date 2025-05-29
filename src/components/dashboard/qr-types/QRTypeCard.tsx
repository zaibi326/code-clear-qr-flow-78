
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface QRType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  popular?: boolean;
  badge?: string;
}

interface QRTypeCardProps {
  qrType: QRType;
  showBadge?: boolean;
}

export function QRTypeCard({ qrType, showBadge = true }: QRTypeCardProps) {
  const navigate = useNavigate();

  const handleStartFreeTrial = (typeId: string) => {
    navigate(`/quick-generate?type=${typeId}`);
  };

  return (
    <div className="relative p-6 border rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-300 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${qrType.color} text-white group-hover:scale-110 transition-transform duration-300`}>
          <qrType.icon className="h-6 w-6" />
        </div>
        <div className="flex gap-2">
          {qrType.badge && showBadge && (
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
              {qrType.badge}
            </Badge>
          )}
          {qrType.popular && showBadge && (
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {qrType.title}
      </h3>
      
      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        {qrType.description}
      </p>

      <Button 
        onClick={() => handleStartFreeTrial(qrType.id)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 group"
      >
        <Crown className="mr-2 h-4 w-4" />
        Start Free Trial
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
      </Button>
    </div>
  );
}
