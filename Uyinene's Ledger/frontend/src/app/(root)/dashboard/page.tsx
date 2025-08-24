"use client";

import { useState } from "react";
import Image from "next/image";
import { IoIosAlert, IoIosCheckmarkCircle, IoIosCloudUpload } from "react-icons/io";
import { cn } from "@/lib/utils";
import logo from "@/components/images/logo.jpg";
import Link from "next/link";

export default function Dashboard() {
  // Sample user and evidence data
  const user = {
    name: "Uyinene",
    role: "Verified User",
    avatar: logo,
  };

  const [evidences, setEvidences] = useState([
    { id: 1, title: "Evidence 1", status: "Verified", date: "2025-08-20" },
    { id: 2, title: "Evidence 2", status: "Pending", date: "2025-08-21" },
    { id: 3, title: "Evidence 3", status: "Expired", date: "2025-07-30" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-white w-full md:w-64 p-6 shadow-md flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-8">
          <Image src={user.avatar} alt="User Logo" className="h-10 w-10 rounded-full" />
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-4">
          <Link href="#" className="hover:text-blue-600 font-medium">Dashboard</Link>
          <Link href="#" className="hover:text-blue-600 font-medium">Upload Evidence</Link>
          <Link href="#" className="hover:text-blue-600 font-medium">Evidence History</Link>
          <Link href="#" className="hover:text-blue-600 font-medium">Profile</Link>
          <Link href="#" className="hover:text-blue-600 font-medium">Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12">
        <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name}!</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link
            href="#"
            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <IoIosCloudUpload size={30} color="blue" />
            <div>
              <p className="font-semibold">Upload Evidence</p>
              <p className="text-sm text-muted-foreground">Securely upload new evidence</p>
            </div>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <IoIosCheckmarkCircle size={30} color="green" />
            <div>
              <p className="font-semibold">Verify Evidence</p>
              <p className="text-sm text-muted-foreground">Confirm authenticity of evidence</p>
            </div>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <IoIosAlert size={30} color="red"/>
            <div>
              <p className="font-semibold">Alerts</p>
              <p className="text-sm text-muted-foreground">View urgent notifications</p>
            </div>
          </Link>
        </div>

        {/* Recent Evidence */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Evidence</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {evidences.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">{e.title}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-sm font-semibold",
                          e.status === "Verified"
                            ? "bg-green-100 text-green-700"
                            : e.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4">{e.date}</td>
                    <td className="p-4">
                      <Link href="#" className="text-blue-600 hover:text-blue-800 underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
