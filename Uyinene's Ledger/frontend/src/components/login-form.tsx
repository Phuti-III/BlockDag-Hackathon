"use client";
import { IoIosBook } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy validation (replace with API / Firebase auth)
    if (email === "test@example.com" && password === "password@123") {
      setError("");
      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <IoIosBook size={30} color="black"/>
              </div>
              <span className="sr-only">Acme Inc.</span>
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4 hover:text-blue-600">
                Register
              </Link>
            </div>
          </div>
        </div>

        

        <div className="flex flex-col gap-6">
            <div className="grid gap-3">
             <Label htmlFor="email">Email</Label>
              <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 mb-4">{error}</p>}
        </div>

        <Button type="submit" className="w-full hover:bg-blue-600 hover:text-white">
          Login
        </Button>
      </form>
    </div>
  );
}
