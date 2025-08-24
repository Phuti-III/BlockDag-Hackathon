// 2. Quick Upload Component: src/components/QuickUpload.tsx
"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface QuickUploadProps {
  className?: string;
  maxFiles?: number;
  onUploadComplete?: (results: any[]) => void;
}

const QuickUpload: React.FC<QuickUploadProps> = ({ 
  className = "", 
  maxFiles = 3,
  onUploadComplete 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.includes('pdf')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const availableSlots = maxFiles - files.length;
    
    if (selectedFiles.length > availableSlots) {
      toast({
        title: "Too Many Files",
        description: `You can only add ${availableSlots} more file(s). Use the full upload page for more files.`,
        variant: "destructive"
      });
      return;
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userAddress', user?.address || '');
    formData.append('isPrivate', 'false'); // Quick upload defaults to public

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/files/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-User-Address': user?.address || '',
          'X-User-Role': user?.role || '',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleQuickUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    const results = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await uploadFile(file);
        
        results.push({
          file: file.name,
          success: true,
          fileId: result.fileId,
          ipfsHash: result.ipfsHash,
          transactionHash: result.transactionHash
        });

        setUploadProgress(((i + 1) / totalFiles) * 100);
        
        // Small delay between uploads
        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (error: any) {
        results.push({
          file: file.name,
          success: false,
          error: error.message
        });
      }
    }
    
    setUploading(false);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    if (successCount > 0) {
      toast({
        title: "Quick Upload Complete",
        description: `${successCount} file(s) uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ''}.`,
      });
      setFiles([]);
      onUploadComplete?.(results);
    }

    if (failCount > 0) {
      toast({
        title: "Some Uploads Failed",
        description: "Use the full upload page for detailed error information.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`shadow-gentle ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Quick Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.mp3,.wav,.mp4,.mov"
            disabled={uploading}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            disabled={uploading || files.length >= maxFiles}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Files ({files.length}/{maxFiles})
          </Button>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file);
              return (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center space-x-2">
                    <FileIcon className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  {!uploading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Uploading to BlockDAG...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleQuickUpload}
            disabled={files.length === 0 || uploading}
            className="flex-1 bg-gradient-primary hover:opacity-90"
            size="sm"
          >
            {uploading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Quick Upload
              </>
            )}
          </Button>
          <Button
            onClick={() => router.push('/upload')}
            variant="outline"
            size="sm"
          >
            Full Upload
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-3 w-3 mt-0.5 text-primary" />
            <div>
              <p className="font-medium mb-1">Quick Upload Info:</p>
              <p>• Files are uploaded as public evidence</p>
              <p>• For private files or metadata, use Full Upload</p>
              <p>• Maximum {maxFiles} files at once</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickUpload;
