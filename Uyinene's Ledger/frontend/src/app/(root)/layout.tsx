import Navigation from "@/components/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
