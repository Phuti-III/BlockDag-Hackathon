"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Upload,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  TrendingUp,
  Activity
} from "lucide-react";
import QuickUpload from "@/components/QuickUpload";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  const recentDocuments = [
    { id: 1, name: "Text Messages - March 2024", type: "Screenshots", date: "2024-03-15", status: "verified", size: "2.3 MB" },
    { id: 2, name: "Medical Report - Dr. Smith", type: "PDF", date: "2024-03-10", status: "pending", size: "1.1 MB" },
    { id: 3, name: "Incident Photos - March 8", type: "Images", date: "2024-03-08", status: "verified", size: "5.7 MB" },
  ];

  const stats = { 
    totalDocuments: 15, 
    verifiedDocuments: 12, 
    pendingReview: 3, 
    storageUsed: 45, 
    lastActivity: "2 hours ago",
    blockchainUploads: 8,
    ipfsStorage: "24.7 MB"
  };

  const handleQuickUploadComplete = (results: any[]) => {
    // Handle upload completion - could refresh stats, show notifications, etc.
    console.log('Quick upload completed:', results);
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Your Secure Evidence Center, {user?.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            Your progress in building a comprehensive case record. Every document is encrypted and stored on BlockDAG blockchain.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-secondary border-0 shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground text-sm font-medium">Total Documents</p>
                  <p className="text-3xl font-bold text-secondary-foreground">{stats.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-secondary-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-primary border-0 shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground text-sm font-medium">BlockDAG Verified</p>
                  <p className="text-3xl font-bold text-primary-foreground">{stats.blockchainUploads}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-warm border-0 shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground text-sm font-medium">IPFS Storage</p>
                  <p className="text-3xl font-bold text-accent-foreground">{stats.ipfsStorage}</p>
                </div>
                <Shield className="h-8 w-8 text-accent-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Last Activity</p>
                  <p className="text-lg font-bold text-foreground">{stats.lastActivity}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-gentle">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Recent Documents</CardTitle>
                <Link href="/list" passHref>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-10 w-10 text-primary bg-primary-soft p-2 rounded-lg" />
                        <div>
                          <h4 className="font-medium text-foreground">{doc.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                            <span className="text-sm text-muted-foreground">{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={doc.status === "verified" ? "default" : "secondary"} className={doc.status === "verified" ? "bg-trust text-white" : ""}>
                          {doc.status === "verified" ? "Verified" : "Pending"}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{new Date(doc.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Upload Component */}
            <QuickUpload 
              maxFiles={3} 
              onUploadComplete={handleQuickUploadComplete}
            />

            {/* Quick Actions */}
            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/upload">
                  <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                    <Upload className="h-5 w-5 mr-2" />
                    Full Upload Page
                  </Button>
                </Link>
                <Link href="/list">
                  <Button variant="outline" className="w-full" size="lg">
                    <FileText className="h-5 w-5 mr-2" />
                    Browse Documents
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-trust" />
                  BlockDAG Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Blockchain</span>
                  <Badge className="bg-trust text-white">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IPFS Storage</span>
                  <Badge className="bg-trust text-white">Connected</Badge>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Storage</span>
                    <span className="text-sm text-foreground">{stats.storageUsed}%</span>
                  </div>
                  <Progress value={stats.storageUsed} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Helpful Tip */}
            <Card className="shadow-gentle border-amber-200 bg-gradient-warm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center text-accent-foreground">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Helpful Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-accent-foreground">
                  Use Quick Upload for immediate evidence storage, or the Full Upload page for private files and detailed metadata.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}