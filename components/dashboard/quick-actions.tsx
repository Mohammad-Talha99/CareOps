import { Button } from "@/components/ui/button";
import { PlusCircle, Mail, Users, CalendarPlus } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <ActionBtn icon={PlusCircle} label="New Job" href="/book" variant="default" />
            <ActionBtn icon={CalendarPlus} label="Schedule" href="/schedule" variant="outline" />
            <ActionBtn icon={Users} label="Add Client" href="/crm/add" variant="outline" />
            <ActionBtn icon={Mail} label="Broadcast" href="/inbox/broadcast" variant="outline" />
        </div>
    )
}

function ActionBtn({ icon: Icon, label, href, variant }: any) {
    return (
        <Link href={href} className="w-full">
            <Button variant={variant} className="w-full justify-start h-12" size="lg">
                <Icon className="mr-2 h-4 w-4" />
                {label}
            </Button>
        </Link>
    )
}
