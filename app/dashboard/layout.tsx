"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { AuthProvider } from "@/components/auth-context";
import { RoleSwitcher } from "@/components/role-switcher";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
                <Sidebar />
                <div className="flex flex-col min-h-screen md:pl-64 transition-all duration-300 ease-in-out">
                    {/* Mobile Header */}
                    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-6 md:hidden">
                        <Link href="/" className="font-bold">CareOps</Link>
                        <RoleSwitcher />
                    </header>

                    <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}
