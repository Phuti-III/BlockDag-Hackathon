

"use client";
import Navigation from "@/components/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { UploadProvider } from "@/context/UploadContext";
import RoleSelection from "@/components/RoleSelection";
import { useAuth } from "@/context/AuthContext";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <RoleSelection />;
  }

  return (
    <UploadProvider>
      <Navigation />
      <main>{children}</main>
    </UploadProvider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <AuthProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}