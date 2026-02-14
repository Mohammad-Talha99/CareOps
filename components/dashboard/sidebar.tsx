"use client";

import Link from "next/link";
// import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Inbox, Calendar, Package, Settings, Users } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { RoleSwitcher } from "@/components/role-switcher";

const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ['OWNER', 'STAFF'] },
    { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, roles: ['OWNER', 'STAFF'] },
    { name: "Customers", href: "/dashboard/customers", icon: Users, roles: ['OWNER', 'STAFF'] },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar, roles: ['OWNER', 'STAFF'] },
    { name: "Inventory", href: "/dashboard/inventory", icon: Package, roles: ['OWNER', 'STAFF'] },
    { name: "Team", href: "/dashboard/team", icon: Users, roles: ['OWNER'] },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ['OWNER'] },
];

export function Sidebar() {
    const { user } = useAuth();

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background pt-8 pb-6 md:flex">
            <div className="px-6 mb-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-bold text-sm tracking-tighter">
                        CO
                    </div>
                    <span className="text-xl font-serif font-bold tracking-tight">CareOps</span>
                </Link>
            </div>

            <div className="px-6 mb-6">
                <RoleSwitcher />
            </div>

            <nav className="flex-1 space-y-1 px-4">
                {sidebarLinks.filter(link => link.roles.includes(user.role)).map((link) => (
                    <SidebarLink key={link.href} link={link} />
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-border px-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {user.name.charAt(0)}
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-muted-foreground text-xs capitalize">{user.role.toLowerCase()}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function SidebarLink({ link }: { link: any }) {
    return (
        <Link
            href={link.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
        >
            <link.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{link.name}</span>
        </Link>
    )
}
