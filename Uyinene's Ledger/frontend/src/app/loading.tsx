"use client";

import { IoIosBook } from "react-icons/io";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
            <span className="animate-bounce">
                <IoIosBook size={60} color="black" />
            </span>
            <div className="flex mt-4 space-x-2">
                <span className="w-2 h-2 bg-black-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-black-600 rounded-full animate-bounce delay-200"></span>
                <span className="w-2 h-2 bg-black-600 rounded-full animate-bounce delay-400"></span>
                <span className="w-2 h-2 bg-black-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-black-600 rounded-full animate-bounce delay-200"></span>
                <span className="w-2 h-2 bg-black-600 rounded-full animate-bounce delay-400"></span>
            </div>
        </div>
        </div>
    );
}