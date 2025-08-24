// 10. Enhanced Navigation with Upload Highlight: src/components/navigation.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Upload, 
  FileText, 
  User, 
  Shield, 
  Building,
  Eye,
  Share,
  Settings,
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UserInfo from '@/components/UserInfo';
import UploadButton from '@/components/UploadButton';

type NavigationItem = {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  highlight?: boolean;
};

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Navigation items based on user role
  const getNavigationItems = (): NavigationItem[] => {
    const commonItems: NavigationItem[] = [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
      { href: '/list', label: 'Documents', icon: FileText },
    ];

    if (user?.role === 'user') {
      return [
        ...commonItems,
        { href: '/upload', label: 'Upload Evidence', icon: Upload, highlight: true },
        { href: '/profile', label: 'Profile', icon: User },
      ];
    } else if (user?.role === 'lawEnforcement') {
      return [
        ...commonItems,
        { href: '/shared-evidence', label: 'Shared Evidence', icon: Share },
        { href: '/case-files', label: 'Case Files', icon: Shield },
        { href: '/profile', label: 'Profile', icon: User },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Uyinene's Ledger</span>
            </Link>
            
            {/* Role Badge */}
            {user && (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  user.role === 'user' 
                    ? 'border-primary text-primary' 
                    : 'border-secondary-accent text-secondary-accent'
                }`}
              >
                {user.role === 'user' ? (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    Individual
                  </>
                ) : (
                  <>
                    <Shield className="h-3 w-3 mr-1" />
                    Law Enforcement
                  </>
                )}
              </Badge>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 relative ${
                      active 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    } ${item.highlight ? 'ring-2 ring-primary/20 ring-offset-2' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.highlight && (
                      <Badge className="ml-1 bg-primary text-primary-foreground text-xs px-1">
                        NEW
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
            
            {/* Quick Upload Button for Individual Users */}
            {user?.role === 'user' && (
              <UploadButton
                variant="outline"
                size="sm"
                showQuickUpload={true}
                maxFiles={3}
                className="ml-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Quick Add
              </UploadButton>
            )}
          </div>

          {/* User Info */}
          <UserInfo />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <div className="flex items-center justify-around py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                      active 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{item.label.split(' ')[0]}</span>
                    {item.highlight && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </Button>
                </Link>
              );
            })}
            
            {/* Mobile Quick Upload */}
            {user?.role === 'user' && (
              <UploadButton
                variant="ghost"
                size="sm"
                showQuickUpload={true}
                maxFiles={1}
                className="flex flex-col items-center space-y-1 h-auto py-2 px-3"
              >
                <Plus className="h-4 w-4" />
                <span className="text-xs">Add</span>
              </UploadButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;