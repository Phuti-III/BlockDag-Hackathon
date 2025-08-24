//this page is the list view of all evidence items
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  FileText, 
  Image, 
  File,
  Calendar,
  Download,
  Eye,
  MoreHorizontal,
  Clock,
  CheckCircle,
  Shield,
  SortAsc
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Mock document data - in real app, this would come from your backend
  const documents = [
    {
      id: 1,
      name: "Text Messages - March 15, 2024",
      type: "image",
      category: "Communication",
      date: "2024-03-15T14:30:00Z",
      size: "2.3 MB",
      status: "verified",
      description: "Screenshots of threatening text messages received on March 15th",
      tags: ["messages", "threats", "communication"],
      location: "Home",
      people: "John Doe",
      metadata: {
        device: "iPhone 14",
        timestamp: "2024-03-15T14:30:00Z",
        hash: "sha256:abc123..."
      }
    },
    {
      id: 2,
      name: "Medical Report - Dr. Sarah Smith",
      type: "pdf",
      category: "Medical",
      date: "2024-03-10T09:15:00Z",
      size: "1.1 MB",
      status: "verified",
      description: "Medical examination report documenting injuries from March 8th incident",
      tags: ["medical", "injuries", "doctor"],
      location: "City General Hospital",
      people: "Dr. Sarah Smith",
      metadata: {
        clinic: "City General Hospital",
        timestamp: "2024-03-10T09:15:00Z",
        hash: "sha256:def456..."
      }
    },
    {
      id: 3,
      name: "Incident Photos - March 8",
      type: "image",
      category: "Evidence",
      date: "2024-03-08T21:45:00Z",
      size: "5.7 MB",
      status: "verified",
      description: "Photos documenting physical evidence and injuries from the incident",
      tags: ["photos", "injuries", "evidence"],
      location: "Home - Living Room",
      people: "Self-documented",
      metadata: {
        camera: "iPhone 14 Pro",
        timestamp: "2024-03-08T21:45:00Z",
        gps: "Enabled",
        hash: "sha256:ghi789..."
      }
    },
    {
      id: 4,
      name: "Police Report #2024-031234",
      type: "pdf",
      category: "Legal",
      date: "2024-03-09T16:20:00Z",
      size: "892 KB",
      status: "pending",
      description: "Official police report filed on March 9th",
      tags: ["police", "official", "report"],
      location: "Metro Police Station",
      people: "Officer Johnson",
      metadata: {
        reportNumber: "2024-031234",
        timestamp: "2024-03-09T16:20:00Z",
        hash: "sha256:jkl012..."
      }
    },
    {
      id: 5,
      name: "Voicemail Recording - March 12",
      type: "audio",
      category: "Communication",
      date: "2024-03-12T19:33:00Z",
      size: "1.8 MB",
      status: "verified",
      description: "Threatening voicemail left on March 12th",
      tags: ["voicemail", "threats", "audio"],
      location: "Home Phone",
      people: "Unknown Caller",
      metadata: {
        duration: "2:34",
        timestamp: "2024-03-12T19:33:00Z",
        hash: "sha256:mno345..."
      }
    },
    {
      id: 6,
      name: "Email Thread - February 2024",
      type: "pdf",
      category: "Communication",
      date: "2024-02-28T11:22:00Z",
      size: "654 KB",
      status: "verified",
      description: "Email correspondence showing escalating harassment",
      tags: ["email", "harassment", "timeline"],
      location: "Gmail Account",
      people: "Multiple parties",
      metadata: {
        emailCount: 15,
        timestamp: "2024-02-28T11:22:00Z",
        hash: "sha256:pqr678..."
      }
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'pdf': return FileText;
      case 'audio': return File;
      default: return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'audio': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Medical': return 'bg-purple-100 text-purple-800';
      case 'Legal': return 'bg-indigo-100 text-indigo-800';
      case 'Communication': return 'bg-orange-100 text-orange-800';
      case 'Evidence': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || doc.type === filterType || doc.category.toLowerCase() === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Document Library</h1>
          <p className="text-lg text-muted-foreground">
            Your secure, encrypted evidence collection with full chain of custody documentation.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-8 shadow-gentle">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterType('all')}>All Documents</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('image')}>Images</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('pdf')}>PDFs</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('audio')}>Audio</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setFilterType('medical')}>Medical</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('legal')}>Legal</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('communication')}>Communication</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('evidence')}>Evidence</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <SortAsc className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('date')}>Date (Newest)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('name')}>Name (A-Z)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('type')}>Type</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('size')}>Size</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-gentle">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{documents.length}</p>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </CardContent>
          </Card>
          <Card className="shadow-gentle">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-trust">{documents.filter(d => d.status === 'verified').length}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </CardContent>
          </Card>
          <Card className="shadow-gentle">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-verified">{documents.filter(d => d.status === 'pending').length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="shadow-gentle">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">14.2 MB</p>
              <p className="text-sm text-muted-foreground">Total Size</p>
            </CardContent>
          </Card>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDocuments.map((doc) => {
            const FileIcon = getFileIcon(doc.type);
            return (
              <Card key={doc.id} className="shadow-gentle hover:shadow-trust transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <FileIcon className="h-8 w-8 text-primary mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold line-clamp-2">{doc.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Export Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tags and Categories */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getTypeColor(doc.type)}>
                      {doc.type.toUpperCase()}
                    </Badge>
                    <Badge className={getCategoryColor(doc.category)}>
                      {doc.category}
                    </Badge>
                    <Badge 
                      variant={doc.status === 'verified' ? 'default' : 'secondary'}
                      className={doc.status === 'verified' ? 'bg-trust text-white' : ''}
                    >
                      {doc.status === 'verified' ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Document Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date & Time</p>
                      <p className="font-medium text-foreground">{formatDate(doc.date)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">File Size</p>
                      <p className="font-medium text-foreground">{doc.size}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{doc.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">People Involved</p>
                      <p className="font-medium text-foreground">{doc.people}</p>
                    </div>
                  </div>

                  {/* Security Metadata */}
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <Shield className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium text-foreground">Security Information</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Hash: {doc.metadata.hash}</p>
                      <p>Timestamp: {formatDate(doc.metadata.timestamp)}</p>
                      {doc.metadata.device && <p>Device: {doc.metadata.device}</p>}
                      {doc.metadata.gps && <p>GPS: {doc.metadata.gps}</p>}
                    </div>
                  </div>

                  {/* Action Buttons */}
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
            );
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms or filters.' : 'Upload your first document to get started.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;