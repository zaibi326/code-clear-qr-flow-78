
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Play, 
  RefreshCw,
  Bug,
  TestTube
} from 'lucide-react';

export const TestingDashboard = () => {
  const [testResults, setTestResults] = useState({
    unit: { passed: 45, failed: 3, total: 48 },
    integration: { passed: 23, failed: 1, total: 24 },
    e2e: { passed: 12, failed: 0, total: 12 },
    performance: { passed: 8, failed: 2, total: 10 }
  });

  const [isRunning, setIsRunning] = useState(false);

  const runTests = async (testType: string) => {
    setIsRunning(true);
    // Simulate test execution
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  const getStatusColor = (passed: number, total: number) => {
    const percentage = (passed / total) * 100;
    if (percentage === 100) return 'text-green-600';
    if (percentage >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const testSuites = [
    {
      name: 'Authentication',
      status: 'passed',
      tests: 12,
      duration: '2.3s',
      coverage: 95
    },
    {
      name: 'QR Generation',
      status: 'passed',
      tests: 8,
      duration: '1.8s',
      coverage: 88
    },
    {
      name: 'Template Management',
      status: 'failed',
      tests: 6,
      duration: '3.1s',
      coverage: 76
    },
    {
      name: 'Campaign Creation',
      status: 'passed',
      tests: 15,
      duration: '4.2s',
      coverage: 92
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testing Dashboard</h1>
          <p className="text-gray-600">Monitor test coverage and quality assurance</p>
        </div>
        <Button 
          onClick={() => runTests('all')} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Running...' : 'Run All Tests'}
        </Button>
      </div>

      {/* Test Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(testResults).map(([type, results]) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase">
                {type} Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl font-bold ${getStatusColor(results.passed, results.total)}`}>
                  {results.passed}/{results.total}
                </span>
                {results.passed === results.total ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : results.failed > 0 ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <Clock className="w-6 h-6 text-yellow-600" />
                )}
              </div>
              <Progress 
                value={(results.passed / results.total) * 100} 
                className="h-2 mb-2"
              />
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {((results.passed / results.total) * 100).toFixed(1)}% passed
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="suites" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suites">Test Suites</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="bugs">Bug Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Test Suites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testSuites.map((suite, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {suite.status === 'passed' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : suite.status === 'failed' ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                      <div>
                        <h3 className="font-medium">{suite.name}</h3>
                        <p className="text-sm text-gray-600">
                          {suite.tests} tests • {suite.duration} • {suite.coverage}% coverage
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={suite.status === 'passed' ? 'default' : 'destructive'}
                    >
                      {suite.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage">
          <Card>
            <CardHeader>
              <CardTitle>Code Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">87.5%</div>
                    <div className="text-sm text-gray-600">Overall Coverage</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">234</div>
                    <div className="text-sm text-gray-600">Lines Covered</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">1.2s</div>
                    <div className="text-sm text-gray-600">Load Time</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">95</div>
                    <div className="text-sm text-gray-600">Performance Score</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">2.1MB</div>
                    <div className="text-sm text-gray-600">Bundle Size</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bugs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5" />
                Recent Bug Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-red-500 bg-red-50 rounded">
                  <div className="font-medium text-red-800">Template upload validation error</div>
                  <div className="text-sm text-red-600">PDF files over 10MB not properly validated</div>
                </div>
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                  <div className="font-medium text-yellow-800">QR positioning drift</div>
                  <div className="text-sm text-yellow-600">Minor positioning inconsistency on mobile devices</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
