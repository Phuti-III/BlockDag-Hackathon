// 3. Create: src/components/UserInfo.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const UserInfo: React.FC = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        {user.role === 'user' ? (
          <User className="h-5 w-5 text-primary" />
        ) : (
          <Shield className="h-5 w-5 text-secondary-accent" />
        )}
        <div>
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.address.slice(0, 6)}...{user.address.slice(-4)}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={logout}>
        Logout
      </Button>
    </div>
  );
};

export default UserInfo;
