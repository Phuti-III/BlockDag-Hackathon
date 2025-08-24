
// ==========================================
// 3. Upload Hook: src/hooks/useUpload.ts
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UploadOptions {
  isPrivate?: boolean;
  encryptionKey?: string;
  metadata?: Record<string, any>;
}

interface UploadResult {
  success: boolean;
  file: string;
  fileId?: string;
  ipfsHash?: string;
  transactionHash?: string;
  error?: string;
}

export const useUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userAddress', user.address);
    formData.append('isPrivate', (options.isPrivate || false).toString());
    
    if (options.isPrivate && options.encryptionKey) {
      formData.append('encryptionKey', options.encryptionKey);
    }

    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/files/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'X-User-Address': user.address,
            'X-User-Role': user.role,
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      return {
        success: true,
        file: file.name,
        fileId: result.fileId,
        ipfsHash: result.ipfsHash,
        transactionHash: result.transactionHash
      };
    } catch (error: any) {
      return {
        success: false,
        file: file.name,
        error: error.message
      };
    }
  };

  const uploadMultipleFiles = async (
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResult[]> => {
    setUploading(true);
    setProgress(0);

    const results: UploadResult[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await uploadFile(file, options);
        results.push(result);
        
        if (result.success) {
          toast({
            title: "File Uploaded",
            description: `${file.name} uploaded successfully to BlockDAG`,
          });
        } else {
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}: ${result.error}`,
            variant: "destructive"
          });
        }
      } catch (error: any) {
        results.push({
          success: false,
          file: file.name,
          error: error.message
        });
      }
      
      setProgress(((i + 1) / totalFiles) * 100);
      
      // Small delay between uploads
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setUploading(false);
    return results;
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    uploading,
    progress
  };
};
