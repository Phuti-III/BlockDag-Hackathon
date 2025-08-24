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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const recentDocuments = [
    { id: 1, name: "Text Messages - March 2024", type: "Screenshots", date: "2024-03-15", status: "verified", size: "2.3 MB" },
    { id: 2, name: "Medical Report - Dr. Smith", type: "PDF", date: "2024-03-10", status: "pending", size: "1.1 MB" },
    { id: 3, name: "Incident Photos - March 8", type: "Images", date: "2024-03-08", status: "verified", size: "5.7 MB" },
  ];

  const stats = { totalDocuments: 15, verifiedDocuments: 12, pendingReview: 3, storageUsed: 45, lastActivity: "2 hours ago" };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Your Secure Evidence Center</h1>
          <p className="text-lg text-muted-foreground">Your progress in building a comprehensive case record. Every document is encrypted and timestamped.</p>
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
                  <p className="text-primary-foreground text-sm font-medium">Verified</p>
                  <p className="text-3xl font-bold text-primary-foreground">{stats.verifiedDocuments}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-warm border-0 shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground text-sm font-medium">Pending Review</p>
                  <p className="text-3xl font-bold text-accent-foreground">{stats.pendingReview}</p>
                </div>
                <Clock className="h-8 w-8 text-accent-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Storage Used</p>
                  <p className="text-3xl font-bold text-foreground">{stats.storageUsed}%</p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
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
            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/upload">
                  <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload New Evidence
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

            <Card className="shadow-gentle">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-trust" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Encryption</span>
                  <Badge className="bg-trust text-white">Active</Badge>
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

            <Card className="shadow-gentle border-amber-200 bg-gradient-warm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center text-accent-foreground">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Helpful Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-accent-foreground">
                  Remember to include dates, times, and locations with your evidence uploads.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
