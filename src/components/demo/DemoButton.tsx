
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import DemoModal from './DemoModal';

const DemoButton: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <Button 
        size="lg" 
        variant="outline"
        className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-200"
        onClick={() => setIsDemoOpen(true)}
      >
        <Play className="h-5 w-5 mr-2" />
        Watch Demo
      </Button>
      
      <DemoModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
      />
    </>
  );
};

export default DemoButton;
