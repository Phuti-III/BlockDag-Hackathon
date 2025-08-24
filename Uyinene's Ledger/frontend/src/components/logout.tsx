"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Clear local storage/session (or any auth tokens)
    localStorage.removeItem("user"); // adjust key if you store user info differently
    sessionStorage.removeItem("walletAddress");

    // 2. Optionally disconnect Metamask wallet
    // if using ethers.js / web3, you can call disconnect logic here

    // 3. Redirect to login page
    router.push("/login");
  };

  return (
    <Button
      variant="outline"
      className="w-full text-red-600 hover:bg-red-100 hover:text-red-700"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
