
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Archive, 
  ArchiveRestore,
  Trash2, 
  QrCode,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { qrCodeService, QRCodeFilter, QRCodeAnalytics } from '@/services/qrCodeService';
import { toast } from '@/hooks/use-toast';
import { TagFilter } from '@/components/tags/TagFilter';

interface QRCodeWithRelations {
  id: string;
  name?: string;
  content: string;
  content_type: string;
  created_at: string;
  updated_at: string;
  visibility_status: string;
  stats: any;
  campaigns?: { name: string; status: string };
  projects?: { name: string; color: string };
  tags: string[];
  generation_source: string;
  qr_image_url?: string;
}

export const QRCodeDashboard = () => {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCodeWithRelations[]>([]);
  const [analytics, setAnalytics] = useState<QRCodeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QRCodeFilter>({
    timeRange: '30d',
    visibilityStatus: 'active'
  });
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  const loadQRCodes = async () => {
    if (!user?.id) {
      setError('Please log in to view your QR codes');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await qrCodeService.getQRCodes(
        user.id, 
        {
          ...filters,
          tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined
        }, 
        pagination.currentPage, 
        20
      );
      
      setQrCodes(result.data);
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalCount: result.totalCount
      });

      // Load analytics
      try {
        const analyticsData = await qrCodeService.getQRAnalytics(
          user.id,
          filters.timeRange,
          filters.campaignId,
          filters.projectId
        );
        setAnalytics(analyticsData);
      } catch (analyticsError) {
        console.error('Error loading analytics:', analyticsError);
        // Continue without analytics if it fails
        setAnalytics({
          total_qr_codes: result.totalCount,
          total_scans: 0,
          unique_scans: 0,
          avg_scans_per_qr: 0,
          top_performing_qr: {},
          recent_activity: []
        });
      }

    } catch (error) {
      console.error('Error loading QR codes:', error);
      setError('Failed to load QR codes. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load QR codes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQRCodes();
  }, [user, filters, selectedTagIds, pagination.currentPage]);

  const handleFilterChange = (key: keyof QRCodeFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleArchive = async (id: string) => {
    try {
      await qrCodeService.archiveQRCode(id);
      toast({
        title: "Success",
        description: "QR code archived successfully"
      });
      loadQRCodes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive QR code",
        variant: "destructive"
      });
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await qrCodeService.restoreQRCode(id);
      toast({
        title: "Success",
        description: "QR code restored successfully"
      });
      loadQRCodes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore QR code",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-700 border-green-200',
      archived: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      deleted: 'bg-red-100 text-red-700 border-red-200'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-700';
  };

  const getContentTypeBadge = (type: string) => {
    const colors = {
      'url': 'bg-blue-100 text-blue-800',
      'text': 'bg-gray-100 text-gray-800',
      'email': 'bg-red-100 text-red-800',
      'phone': 'bg-green-100 text-green-800',
      'sms': 'bg-yellow-100 text-yellow-800',
      'wifi': 'bg-purple-100 text-purple-800',
      'vcard': 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  // Error state
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadQRCodes()}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Loading state
  if (loading && qrCodes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-96 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total QR Codes</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.total_qr_codes}</p>
                </div>
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Scans</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.total_scans.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Scans</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.unique_scans.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Scans/QR</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.avg_scans_per_qr}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>QR Code Database ({pagination.totalCount} total)</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            {/* First row: Search and basic filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search QR codes..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filters.timeRange} onValueChange={(value) => handleFilterChange('timeRange', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qrCodeService.getTimeRangeOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.contentType || ''} onValueChange={(value) => handleFilterChange('contentType', value || undefined)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {qrCodeService.getContentTypeOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.visibilityStatus} onValueChange={(value) => handleFilterChange('visibilityStatus', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Second row: Tag filtering */}
            <div className="flex items-center justify-between">
              <TagFilter
                selectedTags={selectedTagIds}
                onTagsChange={setSelectedTagIds}
                className="flex-1"
              />
              {(selectedTagIds.length > 0 || filters.searchTerm) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTagIds([]);
                    setFilters({ timeRange: '30d', visibilityStatus: 'active' });
                  }}
                  className="ml-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* No QR codes state */}
          {qrCodes.length === 0 && !loading && (
            <div className="text-center py-12">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes found</h3>
              <p className="text-gray-500 mb-4">
                {filters.searchTerm || selectedTagIds.length > 0 
                  ? "Try adjusting your filters or search terms"
                  : "Create your first QR code to get started"
                }
              </p>
              <Button onClick={() => window.location.href = '/create'}>
                Create QR Code
              </Button>
            </div>
          )}

          {/* QR Codes Table */}
          {qrCodes.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>QR Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Campaign/Project</TableHead>
                    <TableHead>Scans</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qrCodes.map((qr) => (
                    <TableRow key={qr.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <QrCode className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{qr.name || 'Unnamed QR'}</div>
                            <div className="text-sm text-gray-500 truncate max-w-48">
                              {qr.content}
                            </div>
                            <div className="text-xs text-gray-400">
                              Source: {qr.generation_source}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getContentTypeBadge(qr.content_type)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {qr.tags?.slice(0, 3).map((tag: any) => (
                            <Badge
                              key={tag.id}
                              variant="secondary"
                              className="text-xs"
                              style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                          {qr.tags?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{qr.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {qr.campaigns && (
                            <div className="text-sm font-medium">{qr.campaigns.name}</div>
                          )}
                          {qr.projects && (
                            <div className="text-xs text-gray-500">{qr.projects.name}</div>
                          )}
                          {!qr.campaigns && !qr.projects && (
                            <span className="text-gray-400">No assignment</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{qr.stats?.total_scans || 0}</div>
                          <div className="text-xs text-gray-500">
                            {qr.stats?.unique_scans || 0} unique
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadge(qr.visibility_status)} border`}>
                          {qr.visibility_status.charAt(0).toUpperCase() + qr.visibility_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(qr.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="View Details">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {qr.visibility_status === 'active' ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleArchive(qr.id)}
                              title="Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRestore(qr.id)}
                              title="Restore"
                            >
                              <ArchiveRestore className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount} QR codes
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
