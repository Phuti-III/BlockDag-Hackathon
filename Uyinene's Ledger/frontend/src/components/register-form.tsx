"use client";

import { IoIosBook } from "react-icons/io";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent default submission
    setError(""); // reset error

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Password match check
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Password minimum length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Example: submit form (replace with API call)
    console.log("Form submitted successfully:", { email, password });
    alert("Account created successfully!");
    form.reset();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <IoIosBook size={30} color="black" />
              </div>
              <span className="sr-only">UL Inc.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Uyinene's Ledger</h1>
            <div className="text-center text-sm">Create an account to get started</div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="uyinene@example.com"
                required
                className="border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                required
                className="border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="********"
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
            Create Account
          </Button>
          

          <div className="relative text-center text-sm">

            <span className="relative z-10 px-2 bg-background text-muted-foreground">

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

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-blue-600">
              Log in
            </Link>
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
