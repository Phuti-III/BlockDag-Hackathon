"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoIosBook } from "react-icons/io";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { toast } = useToast();

  // Example user state (replace with API or wallet integration)
  const [user, setUser] = useState({
    name: "Uyinene Ledger",
    email: "uyinene@example.com",
    wallet: "",
  });

  const handleUpdateProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        setUser(prev => ({ ...prev, wallet: accounts[0] }));
        toast({
          title: "Wallet Connected",
          description: `Connected wallet: ${accounts[0]}`,
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to connect wallet.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No Wallet Detected",
        description: "Please install Metamask to connect.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-10">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full">
          <IoIosBook size={40} />
        </div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-md flex flex-col gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={user.name}
            onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
          />

          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
          />

          <Label htmlFor="wallet">Wallet Address</Label>
          <Input
            id="wallet"
            type="text"
            value={user.wallet || "Not connected"}
            disabled
          />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={handleUpdateProfile} className="w-full">
            Update Profile
          </Button>
          <Button onClick={connectWallet} variant="outline" className="w-full">
            Connect Metamask Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}
