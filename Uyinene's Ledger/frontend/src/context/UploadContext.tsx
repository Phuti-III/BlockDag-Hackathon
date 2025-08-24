// 7. Global Upload Provider: src/contexts/UploadContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import UploadStatusWidget from '@/components/UploadStatus';

interface UploadStatus {
  id: string;
  fileName: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  ipfsHash?: string;
  transactionHash?: string;
  error?: string;
}

interface UploadContextType {
  uploads: UploadStatus[];
  addUpload: (upload: Omit<UploadStatus, 'id'>) => string;
  updateUpload: (id: string, updates: Partial<UploadStatus>) => void;
  removeUpload: (id: string) => void;
  clearUploads: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);

  const addUpload = useCallback((upload: Omit<UploadStatus, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setUploads(prev => [...prev, { ...upload, id }]);
    return id;
  }, []);

  const updateUpload = useCallback((id: string, updates: Partial<UploadStatus>) => {
    setUploads(prev => prev.map(upload => 
      upload.id === id ? { ...upload, ...updates } : upload
    ));
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  }, []);

  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  const value = {
    uploads,
    addUpload,
    updateUpload,
    removeUpload,
    clearUploads
  };

  return (
    <UploadContext.Provider value={value}>
      {children}
      <UploadStatusWidget 
        uploads={uploads} 
        onRemove={removeUpload}
      />
    </UploadContext.Provider>
  );
};

export const useUploadStatus = () => {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUploadStatus must be used within an UploadProvider');
  }
  return context;
};
