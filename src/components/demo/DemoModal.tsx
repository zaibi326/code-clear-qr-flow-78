
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, X } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const demoSections = [
    {
      id: 'overview',
      title: 'Platform Overview',
      duration: '2:30',
      description: 'Complete walkthrough of ClearQR.io dashboard and features'
    },
    {
      id: 'qr-generation',
      title: 'QR Code Generation',
      duration: '3:15',
      description: 'Step-by-step QR code creation with customization options'
    },
    {
      id: 'analytics',
      title: 'Analytics & Tracking',
      duration: '2:45',
      description: 'Real-time analytics and performance monitoring'
    },
    {
      id: 'campaigns',
      title: 'Campaign Management',
      duration: '3:00',
      description: 'Creating and managing marketing campaigns'
    }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">ClearQR.io Platform Demo</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {demoSections.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="text-xs">
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {demoSections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Duration: {section.duration}</span>
                </div>
              </div>

              {/* Video Player Mockup */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🎬</div>
                    <h4 className="text-xl font-semibold mb-2">Interactive Demo Video</h4>
                    <p className="text-gray-300 mb-4">Experience {section.title} in action</p>
                    
                    {/* Demo Screenshots */}
                    <div className="grid grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto">
                      <div className="bg-white/10 rounded p-3 backdrop-blur-sm">
                        <div className="w-full h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded mb-2"></div>
                        <p className="text-xs">Dashboard</p>
                      </div>
                      <div className="bg-white/10 rounded p-3 backdrop-blur-sm">
                        <div className="w-full h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded mb-2"></div>
                        <p className="text-xs">QR Generator</p>
                      </div>
                      <div className="bg-white/10 rounded p-3 backdrop-blur-sm">
                        <div className="w-full h-20 bg-gradient-to-br from-green-400 to-green-600 rounded mb-2"></div>
                        <p className="text-xs">Analytics</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4">
                  <div className="flex items-center gap-4">
                    <Button size="sm" variant="secondary" onClick={handlePlayPause}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleRestart}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${(currentTime / 100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{section.duration}</span>
                  </div>
                </div>
              </div>

              {/* Key Features Highlighted */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">Key Features Demonstrated</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Interactive dashboard navigation</li>
                    <li>• Real-time QR code generation</li>
                    <li>• Customization options</li>
                    <li>• Analytics and insights</li>
                  </ul>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">What You'll Learn</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Best practices for QR campaigns</li>
                    <li>• Performance optimization tips</li>
                    <li>• Integration possibilities</li>
                    <li>• Advanced features usage</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            Ready to get started? Create your free account today!
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close Demo
            </Button>
            <Button onClick={() => window.location.href = '/register'}>
              Start Free Trial
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
