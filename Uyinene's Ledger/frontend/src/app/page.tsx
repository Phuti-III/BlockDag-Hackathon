"use client";
import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/components/images/logo.jpg';


export default function LandingPage() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="relative z-10 container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="backdrop-blur-sm">
              <Image
                src={logo}
                alt="Uyinene logo"
                className="h-25 w-30 "
              />
            </div>
            <div >
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                Secure. Verify. Empower.
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl text-center">
                Uyinene’s Ledger helps South African women safely store and manage critical digital evidence, giving you control over your own story.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">

              <Button className="shadow-sm transition-shadow hover:shadow" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" className="group" asChild>
                <Link href="/register">
                Register
                </Link>
              </Button>
            </div>
            <div className="mt-20 flex flex-col items-center gap-5">
              <p className="font-medium text-red-600 lg:text-left ">
                EMERGENCY
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-icon.svg"
                    alt="shadcn/ui logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/typescript-icon.svg"
                    alt="TypeScript logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>

                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-icon.svg"
                    alt="React logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/police-icon.svg"
                    alt="Police logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { LandingPage };
