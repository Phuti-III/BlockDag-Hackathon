// 8. Enhanced useUpload Hook with Status: src/hooks/useUploadWithStatus.ts
import { useUpload } from '@/hooks/useUpload';
import { useUploadStatus } from '@/context/UploadContext';

interface UploadOptions {
  isPrivate?: boolean;
  encryptionKey?: string;
  metadata?: Record<string, any>;
  showStatus?: boolean;
}

export const useUploadWithStatus = () => {
  const { uploadFile, uploadMultipleFiles, uploading, progress } = useUpload();
  const { addUpload, updateUpload } = useUploadStatus();

  const uploadFileWithStatus = async (file: File, options: UploadOptions = {}) => {
    const { showStatus = true, ...uploadOptions } = options;
    
    let uploadId: string | undefined;
    
    if (showStatus) {
      uploadId = addUpload({
        fileName: file.name,
        status: 'uploading',
        progress: 0
      });
    }

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        if (uploadId) {
          updateUpload(uploadId, {
            progress: Math.min((Math.random() * 20) + 60, 90)
          });
        }
      }, 500);

      const result = await uploadFile(file, uploadOptions);
      clearInterval(progressInterval);

      if (uploadId) {
        if (result.success) {
          updateUpload(uploadId, {
            status: 'success',
            progress: 100,
            ipfsHash: result.ipfsHash,
            transactionHash: result.transactionHash
          });
        } else {
          updateUpload(uploadId, {
            status: 'error',
            progress: 100,
            error: result.error
          });
        }
      }

      return result;
    } catch (error: any) {
      if (uploadId) {
        updateUpload(uploadId, {
          status: 'error',
          progress: 100,
          error: error.message
        });
      }
      throw error;
    }
  };

  const uploadMultipleFilesWithStatus = async (files: File[], options: UploadOptions = {}) => {
    const results = [];
    
    for (const file of files) {
      const result = await uploadFileWithStatus(file, options);
      results.push(result);
      
      // Small delay between uploads
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  };

  return {
    uploadFile: uploadFileWithStatus,
    uploadMultipleFiles: uploadMultipleFilesWithStatus,
    uploading,
    progress
  };
};