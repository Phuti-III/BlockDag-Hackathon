"use client";
import { IoIosBook } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

interface LoginPageProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function LoginPage({ className, ...props }: LoginPageProps) {
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
    } 
    // Basic validation
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <IoIosBook size={30} color="black" />
              </div>
              <span className="sr-only">UL Inc.</span>
            </Link>
            <h1 className="text-xl font-bold">Login</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4 hover:text-blue-600">
                Register
              </Link>
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
                className="border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            variant="outline"
            type="submit"
            className="w-full hover:bg-blue-600 hover:text-white"
          >
           Login
          </Button>

          <div className="relative text-center text-sm">
            <span className="relative z-10 left:5 right:5 bg-background text-muted-foreground">
              Or
            </span>

            <div className="absolute left-5 right-5 top-1/2 h-px bg-border -z-0"></div>
          </div>


          <div className="grid gap-4 sm:grid-cols-1 ">
            <Button variant="outline" type="button" className="w-full hover:bg-blue-600 hover:text-white">
              <FcGoogle />
              Continue with Google
            </Button>
          </div>
        </div>
      </form>

      <div className="text-muted-foreground text-center text-xs">
        By clicking continue, you agree to our{" "}
        <Link href="/termsOfService" className="underline underline-offset-4 text-blue-600">Terms of Service</Link> and{" "}
        <Link href="/privacyPolicy" className="underline underline-offset-4 text-blue-600">Privacy Policy</Link>.
      </div>
    </div>
  );
}
