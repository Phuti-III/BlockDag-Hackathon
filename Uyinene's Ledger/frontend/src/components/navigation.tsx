"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Upload, FileText, Home, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {IoIosBook} from "react-icons/io";
import { useState } from "react";
import LogoutButton from "@/components/logout";


const Navigation = () => {
  const pathname = usePathname(); // Next.js hook for current path
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/list", label: "Documents", icon: FileText },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <IoIosBook size={30} color="black" />
              <span className="text-xl font-semibold text-foreground">Uyinene's Ledger</span>
            </Link>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="ml-4 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
              >
                <span className="sr-only">Profile</span>
                
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="px-4 py-2">
                    <LogoutButton />
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;