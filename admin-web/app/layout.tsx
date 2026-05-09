import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/component/layout/AppShell";

export const metadata: Metadata = {
  title: "HR Portal · Meridian",
  description: "Employee Management System",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}