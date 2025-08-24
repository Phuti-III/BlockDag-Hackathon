// 2. Create: src/components/RoleSelection.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Building, Key, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const RoleSelection: React.FC = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'user' | 'lawEnforcement' | null>(null);

  const handleRoleSelect = (role: 'user' | 'lawEnforcement') => {
    setSelectedRole(role);
    setTimeout(() => {
      login(role);
    }, 500);
  };

  const roles = [
    {
      key: 'user' as const,
      title: 'Individual User',
      description: 'Personal evidence storage and documentation',
      icon: User,
      features: ['Upload personal evidence', 'Secure document storage', 'Share with law enforcement', 'Timeline documentation'],
      address: "0x8732F4d3F2f91BbB19F061F119F397d5cbC17d3c",
      color: 'bg-gradient-primary'
    },
    {
      key: 'lawEnforcement' as const,
      title: 'Law Enforcement',
      description: 'Official evidence management and case handling',
      icon: Shield,
      features: ['Access shared evidence', 'Case file management', 'Official documentation', 'Evidence verification'],
      address: "0x0a213702b6050FbF645925dAb4a143F0002a4B97",
      color: 'bg-gradient-secondary'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-foreground">Uyinene's Ledger</h1>
          </div>
          <h2 className="text-xl text-muted-foreground mb-2">Demo Access Portal</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your role to access the secure evidence management system. 
            This demo environment allows you to explore features specific to each user type.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.key;
            
            return (
              <Card 
                key={role.key} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-gentle'
                }`}
                onClick={() => handleRoleSelect(role.key)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${role.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-6 w-6 text-primary animate-pulse" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Key className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Demo Account</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono break-all">
                        {role.address}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">Available Features:</h4>
                      <ul className="space-y-2">
                        {role.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-trust mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full mt-6 ${role.color} hover:opacity-90`}
                    size="lg"
                    disabled={selectedRole !== null}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In as {role.title}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-amber-200 bg-gradient-warm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Shield className="h-6 w-6 text-accent-foreground mt-1" />
              <div>
                <h3 className="font-semibold text-accent-foreground mb-2">Demo Environment Notice</h3>
                <p className="text-sm text-accent-foreground mb-3">
                  This is a demonstration environment using pre-configured blockchain accounts. 
                  All data is encrypted and stored securely on the BlockDAG network.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs border-accent-foreground text-accent-foreground">
                    BlockDAG Network
                  </Badge>
                  <Badge variant="outline" className="text-xs border-accent-foreground text-accent-foreground">
                    Encrypted Storage
                  </Badge>
                  <Badge variant="outline" className="text-xs border-accent-foreground text-accent-foreground">
                    Demo Accounts
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;
