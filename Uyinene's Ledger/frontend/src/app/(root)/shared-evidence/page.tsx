// ==========================================
// 7. Create: src/app/(root)/shared-evidence/page.tsx (for Law Enforcement)
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  Download,
  Eye,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApiWithAuth } from '@/hooks/useApiWithAuth';

const SharedEvidencePage: React.FC = () => {
  const { user } = useAuth();
  const { makeApiCall } = useApiWithAuth();
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'lawEnforcement') {
      fetchSharedEvidence();
    }
  }, [user]);

  const fetchSharedEvidence = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall(`/files/shared-with/${user?.address}`);
      setSharedFiles(response.files || []);
    } catch (error) {
      console.error('Error fetching shared evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect non-law enforcement users
  if (user?.role !== 'lawEnforcement') {
    return (
      <div className="min-h-screen bg-background pt-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">This page is only accessible to law enforcement users.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-8 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 animate-spin text-primary" />
              <span>Loading shared evidence...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-secondary-accent" />
            <h1 className="text-3xl font-bold text-foreground">Shared Evidence</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Evidence shared with law enforcement for investigation purposes.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-gentle">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-foreground">{sharedFiles.length}</p>
              <p className="text-sm text-muted-foreground">Total Shared Files</p>
            </CardContent>
          </Card>
          <Card className="shadow-gentle">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-trust">{sharedFiles.filter((f: any) => !f.isPrivate).length}</p>
              <p className="text-sm text-muted-foreground">Public Evidence</p>
            </CardContent>
          </Card>
          <Card className="shadow-gentle">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-secondary-accent">{sharedFiles.filter((f: any) => f.isPrivate).length}</p>
              <p className="text-sm text-muted-foreground">Private Evidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Evidence List */}
        {sharedFiles.length === 0 ? (
          <Card className="shadow-gentle">
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Shared Evidence</h3>
              <p className="text-muted-foreground">
                No evidence has been shared with your law enforcement account yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sharedFiles.map((file: any) => (
              <Card key={file.id} className="shadow-gentle hover:shadow-trust transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-8 w-8 text-secondary-accent mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">{file.fileName}</CardTitle>
                        <p className="text-sm text-muted-foreground">Shared by: {file.owner}</p>
                      </div>
                    </div>
                    <Badge variant={file.isPrivate ? "destructive" : "default"}>
                      {file.isPrivate ? "Private" : "Public"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Upload Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(file.uploadTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">File Size</p>
                      <p className="font-medium text-foreground">{file.fileSize} bytes</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">File Type</p>
                      <p className="font-medium text-foreground">{file.fileType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Evidence ID</p>
                      <p className="font-medium text-foreground">#{file.id}</p>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <Shield className="h-4 w-4 text-secondary-accent mr-2" />
                      <span className="text-sm font-medium text-foreground">Chain of Custody</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>IPFS Hash: {file.ipfsHash}</p>
                      <p>Blockchain Verified</p>
                      <p>Encrypted Storage</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedEvidencePage;
