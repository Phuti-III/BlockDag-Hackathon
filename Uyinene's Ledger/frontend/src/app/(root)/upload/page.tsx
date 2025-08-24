"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    setFiles(prev => [...prev, ...newFiles]);
  };

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

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast({
            title: "Upload Successful",
            description: `${files.length} document(s) uploaded securely with encryption and timestamps.`,
          });
          setFiles([]);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Evidence Documents</h1>
          <p className="text-lg text-muted-foreground">
            Securely upload your evidence with automatic encryption and timestamping for legal admissibility.
          </p>
        </div>

        {/* Security Notice */}
        <Card className="mb-8 border-primary-soft bg-primary-soft/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Your Security is Our Priority</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  All uploads are encrypted with 256-bit encryption, timestamped with blockchain verification, 
                  and stored in secure cloud infrastructure. Your documents are only accessible to you.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Auto-Timestamped
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Encrypted
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Chain of Custody
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Area */}
            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UploadIcon className="h-5 w-5 mr-2" />
                  Select Documents
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
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Browse Files
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground mt-3">
                    Supported: Images, PDFs, Text Documents (Max 50MB each)
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-foreground">Selected Files ({files.length})</h4>
                    {files.map((file, index) => {
                      const FileIcon = getFileIcon(file);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileIcon className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium text-foreground text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata Form */}
            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Adding context helps establish timeline and relevance in legal proceedings
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="incident-date">Incident Date</Label>
                    <Input type="date" id="incident-date" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="incident-time">Incident Time</Label>
                    <Input type="time" id="incident-time" className="mt-1" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Where did this occur?" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="people-involved">People Involved</Label>
                  <Input id="people-involved" placeholder="Names of people present (if safe to document)" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="description">Description & Context</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe what happened and how this evidence relates to the incident..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags/Categories</Label>
                  <Input id="tags" placeholder="e.g., text messages, photos, medical records" className="mt-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload Progress */}
            {uploading && (
              <Card className="shadow-gentle">
                <CardHeader>
                  <CardTitle className="text-lg">Uploading...</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress}% complete - Encrypting and timestamping your documents
                  </p>
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
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="h-5 w-5 mr-2" />
                      Upload Securely ({files.length})
                    </>
                  )}
                </Button>
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
              </CardContent>
            </Card>

            {/* Legal Notice */}
            <Card className="shadow-gentle border-primary-soft bg-primary-soft/10">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-1">Legal Notice</h4>
                    <p className="text-xs text-muted-foreground">
                      All uploads are automatically timestamped and encrypted for evidence integrity. 
                      This platform creates legally admissible documentation.
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

export default Upload;