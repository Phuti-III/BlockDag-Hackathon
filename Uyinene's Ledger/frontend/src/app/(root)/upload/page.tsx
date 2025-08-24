// 1. Enhanced Upload Page: src/app/(root)/upload/page.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

import { 
  Upload as UploadIcon, 
  File, 
  Image, 
  FileText, 
  Camera,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Info,
  X,
  Lock,
  Unlock,
  Hash,
  Upload as UpIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useApiWithAuth } from "@/hooks/useApiWithAuth";

interface FileWithMetadata extends File {
  id: string;
  metadata?: {
    description?: string;
    location?: string;
    peopleInvolved?: string;
    tags?: string;
    incidentDate?: string;
    incidentTime?: string;
  };
}

const UploadPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { makeApiCall } = useApiWithAuth();
  
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploads, setCurrentUploads] = useState<{[key: string]: number}>({});
  const [uploadResults, setUploadResults] = useState<any[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState("");

  // Global metadata (applies to all files)
  const [globalMetadata, setGlobalMetadata] = useState({
    incidentDate: "",
    incidentTime: "",
    location: "",
    peopleInvolved: "",
    description: "",
    tags: ""
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const filesWithMetadata: FileWithMetadata[] = newFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      metadata: { ...globalMetadata }
    }));
    setFiles(prev => [...prev, ...filesWithMetadata]);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.includes('pdf')) return FileText;
    if (file.type.startsWith('audio/')) return File;
    if (file.type.startsWith('video/')) return Camera;
    return File;
  };

  const getFileTypeColor = (file: File) => {
    if (file.type.startsWith('image/')) return 'bg-blue-100 text-blue-800';
    if (file.type.includes('pdf')) return 'bg-red-100 text-red-800';
    if (file.type.startsWith('audio/')) return 'bg-green-100 text-green-800';
    if (file.type.startsWith('video/')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const updateFileMetadata = (fileId: string, metadata: Partial<FileWithMetadata['metadata']>) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, metadata: { ...file.metadata, ...metadata } }
        : file
    ));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: FileWithMetadata): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userAddress', user?.address || '');
    formData.append('isPrivate', isPrivate.toString());
    if (isPrivate && encryptionKey) {
      formData.append('encryptionKey', encryptionKey);
    }

    // Add metadata as JSON string if available
    if (file.metadata) {
      formData.append('metadata', JSON.stringify(file.metadata));
    }

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

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload.",
        variant: "destructive"
      });
      return;
    }

    if (isPrivate && !encryptionKey.trim()) {
      toast({
        title: "Encryption Key Required",
        description: "Please provide an encryption key for private files.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadResults([]);
    setCurrentUploads({});

    const results: {
      file: string;
      success: boolean;
      fileId?: string;
      ipfsHash?: string;
      transactionHash?: string;
      mockIPFS?: boolean;
      error?: string;
    }[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Update current upload progress for this specific file
        setCurrentUploads(prev => ({ ...prev, [file.id]: 0 }));
        
        // Simulate progress for individual file
        const progressInterval = setInterval(() => {
          setCurrentUploads(prev => ({
            ...prev,
            [file.id]: Math.min((prev[file.id] || 0) + 20, 90)
          }));
        }, 200);

        const result = await uploadFile(file);
        
        clearInterval(progressInterval);
        setCurrentUploads(prev => ({ ...prev, [file.id]: 100 }));

        results.push({
          file: file.name,
          success: true,
          fileId: result.fileId,
          ipfsHash: result.ipfsHash,
          transactionHash: result.transactionHash,
          mockIPFS: result.mockIPFS
        });

        // Update overall progress
        setUploadProgress(((i + 1) / totalFiles) * 100);

        toast({
          title: "File Uploaded Successfully",
          description: `${file.name} has been uploaded and stored on BlockDAG${result.mockIPFS ? ' (using mock IPFS)' : ''}.`,
        });

        // Small delay between uploads to avoid overwhelming the API
        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error: any) {
        results.push({
          file: file.name,
          success: false,
          error: error.message
        });

        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}: ${error.message}`,
          variant: "destructive"
        });

        setCurrentUploads(prev => ({ ...prev, [file.id]: -1 })); // -1 indicates error
      }
    }

    setUploadResults(results);
    setUploading(false);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    if (successCount > 0) {
      toast({
        title: "Upload Complete",
        description: `${successCount} file(s) uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ''}.`,
      });

      // Clear successful uploads after a delay
      setTimeout(() => {
        setFiles(prev => prev.filter((_, i) => !results[i]?.success));
        setCurrentUploads({});
      }, 3000);
    }
  };

  const getUploadStatusIcon = (fileId: string) => {
    const progress = currentUploads[fileId];
    if (progress === undefined) return null;
    if (progress === -1) return <X className="h-4 w-4 text-destructive" />;
    if (progress === 100) return <CheckCircle className="h-4 w-4 text-trust" />;
    return <Clock className="h-4 w-4 text-primary animate-spin" />;
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Evidence to BlockDAG</h1>
          <p className="text-lg text-muted-foreground">
            Securely upload your evidence with automatic encryption, timestamping, and blockchain verification.
          </p>
        </div>

        {/* Security Notice */}
        <Card className="mb-8 border-primary-soft bg-primary-soft/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">BlockDAG Blockchain Security</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  All uploads are encrypted with AES-256, timestamped with blockchain verification, 
                  and stored on IPFS with immutable hashes. Your documents maintain full legal admissibility.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Hash className="h-3 w-3 mr-1" />
                    IPFS Storage
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    AES-256 Encrypted
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    BlockDAG Verified
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Area */}
            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UploadIcon className="h-5 w-5 mr-2" />
                  Select Evidence Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary-soft/20' : 'border-border hover:border-primary'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Drag and drop your files here
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Or click to browse your device
                  </p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.mp3,.wav,.mp4,.mov"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Browse Files
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground mt-3">
                    Supported: Images, PDFs, Documents, Audio, Video (Max 50MB each)
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Selected Files ({files.length})</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFiles([])}
                        className="text-destructive hover:text-destructive"
                      >
                        Clear All
                      </Button>
                    </div>
                    {files.map((file, index) => {
                      const FileIcon = getFileIcon(file);
                      const progress = currentUploads[file.id];
                      const isUploaded = progress === 100;
                      const hasError = progress === -1;
                      
                      return (
                        <div key={file.id} className={`p-4 border rounded-lg transition-colors ${
                          isUploaded ? 'border-trust bg-trust/5' : 
                          hasError ? 'border-destructive bg-destructive/5' : 
                          'border-border bg-muted/30'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <FileIcon className="h-8 w-8 text-primary" />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium text-foreground text-sm">{file.name}</p>
                                  {getUploadStatusIcon(file.id)}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className={`text-xs ${getFileTypeColor(file)}`}>
                                    {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                                </div>
                              </div>
                            </div>
                            {!uploading && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          {/* Upload Progress */}
                          {progress !== undefined && progress >= 0 && progress < 100 && (
                            <div className="mb-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Uploading to BlockDAG...</span>
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-1" />
                            </div>
                          )}

                          {/* Individual File Metadata */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <Input
                              placeholder="Description (optional)"
                              value={file.metadata?.description || ''}
                              onChange={(e) => updateFileMetadata(file.id, { description: e.target.value })}
                              disabled={uploading}
                            />
                            <Input
                              placeholder="Tags (optional)"
                              value={file.metadata?.tags || ''}
                              onChange={(e) => updateFileMetadata(file.id, { tags: e.target.value })}
                              disabled={uploading}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Global Metadata Form */}
            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle>Evidence Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  This information will be applied to all uploaded files for proper documentation
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="incident-date">Incident Date</Label>
                    <Input 
                      type="date" 
                      id="incident-date" 
                      className="mt-1"
                      value={globalMetadata.incidentDate}
                      onChange={(e) => setGlobalMetadata(prev => ({ ...prev, incidentDate: e.target.value }))}
                      disabled={uploading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="incident-time">Incident Time</Label>
                    <Input 
                      type="time" 
                      id="incident-time" 
                      className="mt-1"
                      value={globalMetadata.incidentTime}
                      onChange={(e) => setGlobalMetadata(prev => ({ ...prev, incidentTime: e.target.value }))}
                      disabled={uploading}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="Where did this occur?" 
                    className="mt-1"
                    value={globalMetadata.location}
                    onChange={(e) => setGlobalMetadata(prev => ({ ...prev, location: e.target.value }))}
                    disabled={uploading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="people-involved">People Involved</Label>
                  <Input 
                    id="people-involved" 
                    placeholder="Names of people present (if safe to document)" 
                    className="mt-1"
                    value={globalMetadata.peopleInvolved}
                    onChange={(e) => setGlobalMetadata(prev => ({ ...prev, peopleInvolved: e.target.value }))}
                    disabled={uploading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description & Context</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe what happened and how this evidence relates to the incident..."
                    className="mt-1 min-h-[100px]"
                    value={globalMetadata.description}
                    onChange={(e) => setGlobalMetadata(prev => ({ ...prev, description: e.target.value }))}
                    disabled={uploading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags/Categories</Label>
                  <Input 
                    id="tags" 
                    placeholder="e.g., text messages, photos, medical records" 
                    className="mt-1"
                    value={globalMetadata.tags}
                    onChange={(e) => setGlobalMetadata(prev => ({ ...prev, tags: e.target.value }))}
                    disabled={uploading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy Settings */}
            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {isPrivate ? <Lock className="h-5 w-5 mr-2" /> : <Unlock className="h-5 w-5 mr-2" />}
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="private"
                    checked={isPrivate}
                    onChange={e => setIsPrivate(e.target.checked)}
                    disabled={uploading}
                  />
                  <Label htmlFor="private" className="text-sm">
                    Make files private (requires encryption key)
                  </Label>
                </div>
                
                {isPrivate && (
                  <div>
                    <Label htmlFor="encryption-key">Encryption Key</Label>
                    <Input
                      id="encryption-key"
                      type="password"
                      placeholder="Enter encryption key"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      disabled={uploading}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep this key safe - you'll need it to decrypt your files
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {uploading && (
              <Card className="shadow-gentle">
                <CardHeader>
                  <CardTitle className="text-lg">Uploading to BlockDAG...</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress.toFixed(0)}% complete - Processing {files.length} file(s)
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>• Encrypting files...</p>
                    <p>• Generating IPFS hashes...</p>
                    <p>• Recording on BlockDAG...</p>
                    <p>• Creating immutable timestamps...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Results */}
            {uploadResults.length > 0 && (
              <Card className="shadow-gentle">
                <CardHeader>
                  <CardTitle className="text-lg">Upload Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {uploadResults.map((result, index) => (
                      <div key={index} className={`text-sm p-2 rounded ${
                        result.success ? 'bg-trust/10 text-trust' : 'bg-destructive/10 text-destructive'
                      }`}>
                        <div className="flex items-center">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <X className="h-4 w-4 mr-2" />
                          )}
                          <span className="font-medium">{result.file}</span>
                        </div>
                        {result.success ? (
                          <div className="text-xs mt-1 space-y-1">
                            <p>File ID: {result.fileId}</p>
                            <p>IPFS: {result.ipfsHash}</p>
                            <p>TX: {result.transactionHash}</p>
                          </div>
                        ) : (
                          <p className="text-xs mt-1">{result.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Button */}
            <Card className="shadow-gentle">
              <CardContent className="p-6">
                <Button 
                  onClick={handleUpload}
                  disabled={files.length === 0 || uploading}
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Uploading to BlockDAG...
                    </>
                  ) : (
                    <>
                      <UpIcon className="h-5 w-5 mr-2" />
                      Upload {files.length} File{files.length !== 1 ? 's' : ''} to BlockDAG
                    </>
                  )}
                </Button>
                
                {files.length > 0 && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      Total size: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-gentle border-amber-200 bg-gradient-warm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center text-accent-foreground">
                  <Info className="h-5 w-5 mr-2" />
                  Upload Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-accent-foreground space-y-2">
                <p>• Screenshot messages immediately to preserve timestamps</p>
                <p>• Take clear photos with good lighting</p>
                <p>• Include full conversation context in screenshots</p>
                <p>• Document medical visits and police reports</p>
                <p>• Save original files without editing when possible</p>
                <p>• Use private mode for sensitive evidence</p>
              </CardContent>
            </Card>

            {/* Blockchain Info */}
            <Card className="shadow-gentle border-primary-soft bg-primary-soft/10">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Hash className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-1">BlockDAG Integration</h4>
                    <p className="text-xs text-muted-foreground">
                      Files are stored on IPFS and recorded on BlockDAG blockchain for 
                      immutable proof of existence and timestamps. Each upload creates 
                      a legally admissible digital certificate.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;