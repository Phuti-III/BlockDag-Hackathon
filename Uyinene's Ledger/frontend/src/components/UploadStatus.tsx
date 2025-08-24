// 5. Upload Status Component: src/components/UploadStatus.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  CheckCircle, 
  X, 
  Clock, 
  AlertCircle,
  FileText,
  Hash
} from 'lucide-react';

interface UploadStatus {
  id: string;
  fileName: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  ipfsHash?: string;
  transactionHash?: string;
  error?: string;
}

interface UploadStatusProps {
  uploads: UploadStatus[];
  onRemove?: (id: string) => void;
  className?: string;
}

const UploadStatusWidget: React.FC<UploadStatusProps> = ({ 
  uploads, 
  onRemove,
  className = "" 
}) => {
  const [visibleUploads, setVisibleUploads] = useState<UploadStatus[]>([]);

  useEffect(() => {
    setVisibleUploads(uploads.slice(-3)); // Show only last 3 uploads
  }, [uploads]);

  if (visibleUploads.length === 0) return null;

  return (
    <div className={`fixed bottom-4 right-4 w-80 space-y-2 z-50 ${className}`}>
      {visibleUploads.map((upload) => (
        <Card key={upload.id} className="shadow-lg border-l-4 border-l-primary bg-card/95 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1">
                  {upload.status === 'uploading' && (
                    <Clock className="h-4 w-4 text-primary animate-spin" />
                  )}
                  {upload.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-trust" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {upload.fileName}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        upload.status === 'success' ? 'border-trust text-trust' :
                        upload.status === 'error' ? 'border-destructive text-destructive' :
                        'border-primary text-primary'
                      }`}
                    >
                      {upload.status === 'uploading' && 'Uploading'}
                      {upload.status === 'success' && 'Success'}
                      {upload.status === 'error' && 'Failed'}
                    </Badge>
                  </div>

                  {upload.status === 'uploading' && (
                    <div className="mb-2">
                      <Progress value={upload.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {upload.progress}% - Uploading to BlockDAG...
                      </p>
                    </div>
                  )}

                  {upload.status === 'success' && (
                    <div className="space-y-1">
                      {upload.ipfsHash && (
                        <div className="flex items-center space-x-1">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground font-mono">
                            {upload.ipfsHash.slice(0, 12)}...
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-trust">Stored on BlockDAG blockchain</p>
                    </div>
                  )}

                  {upload.status === 'error' && upload.error && (
                    <p className="text-xs text-destructive">{upload.error}</p>
                  )}
                </div>
              </div>

              {onRemove && (upload.status === 'success' || upload.status === 'error') && (
                <button
                  onClick={() => onRemove(upload.id)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UploadStatusWidget;
