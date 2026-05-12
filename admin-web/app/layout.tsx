import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/component/layout/AppShell";
import { AuthProvider } from "@/lib/context/AuthContext";

export const metadata: Metadata = {
  title: "HR Portal · Meridian",
  description: "Employee Management System",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        {/*
         * AuthProvider harus wrapping AppShell agar useAuth() bisa diakses
         * di AppShell dan seluruh component tree.
         */}
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}