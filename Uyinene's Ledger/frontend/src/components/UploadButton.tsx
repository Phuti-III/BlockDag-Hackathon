// 6. Enhanced Upload Button Component: src/components/UploadButton.tsx
"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUpload } from '@/hooks/useUpload';

interface UploadButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showQuickUpload?: boolean;
  maxFiles?: number;
  className?: string;
  children?: React.ReactNode;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  variant = 'default',
  size = 'default',
  showQuickUpload = false,
  maxFiles = 1,
  className = '',
  children
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { uploadMultipleFiles, uploading } = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (files.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Please select up to ${maxFiles} file(s) or use the full upload page.`,
        variant: "destructive"
      });
      return;
    }

    try {
      const results = await uploadMultipleFiles(files, { isPrivate: false });
      const successCount = results.filter(r => r.success).length;
      
      if (successCount > 0) {
        toast({
          title: "Quick Upload Complete",
          description: `${successCount} file(s) uploaded to BlockDAG successfully!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed", 
        description: error.message,
        variant: "destructive"
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (showQuickUpload) {
      fileInputRef.current?.click();
    } else {
      router.push('/upload');
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={handleQuickUpload}
        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.mp3,.wav,.mp4,.mov"
        disabled={uploading}
      />
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={uploading}
        className={`${className} ${variant === 'default' ? 'bg-gradient-primary hover:opacity-90' : ''}`}
      >
        {uploading ? (
          <>
            <Upload className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            {showQuickUpload ? (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {children || 'Quick Add'}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {children || 'Upload Evidence'}
              </>
            )}
          </>
        )}
      </Button>
    </>
  );
};

export default UploadButton;
