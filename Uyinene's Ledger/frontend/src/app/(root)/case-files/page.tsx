// ==========================================
// 8. Create: src/app/(root)/case-files/page.tsx (for Law Enforcement)
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertCircle, FileText, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const CaseFilesPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect non-law enforcement users
  if (user?.role !== 'lawEnforcement') {
    return (
      <div className="min-h-screen bg-background pt-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">This page is only accessible to law enforcement users.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-secondary-accent" />
            <h1 className="text-3xl font-bold text-foreground">Case Files</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage official case files and evidence documentation.
          </p>
        </div>

        <Card className="shadow-gentle">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Case Files Management</h3>
            <p className="text-muted-foreground mb-4">
              This feature will allow law enforcement to create and manage official case files.
            </p>
            <Badge variant="outline" className="text-sm">
              <Clock className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseFilesPage;