"use client";

import { useAuth } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { UserCog, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleSwitcher() {
    const { user, switchRole } = useAuth();

    return (
        <div className="grid grid-cols-2 p-1 bg-muted/50 rounded-lg border">
            <Button
                variant={user.role === 'OWNER' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchRole('OWNER')}
                className={cn(
                    "text-xs font-medium rounded-md shadow-sm",
                    user.role === 'OWNER' ? "bg-white text-foreground hover:bg-white/90 shadow-sm" : "hover:bg-transparent text-muted-foreground"
                )}
            >
                <UserCog className="w-3 h-3 mr-2" />
                Owner
            </Button>
            <Button
                variant={user.role === 'STAFF' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchRole('STAFF')}
                className={cn(
                    "text-xs font-medium rounded-md",
                    user.role === 'STAFF' ? "bg-white text-foreground hover:bg-white/90 shadow-sm" : "hover:bg-transparent text-muted-foreground"
                )}
            >
                <Users className="w-3 h-3 mr-2" />
                Staff
            </Button>
        </div>
    )
}
