import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const activities = [
    {
        user: "Sarah M.",
        action: "booked a new cleaning",
        time: "2 mins ago",
        avatar: "/avatars/01.png",
        initials: "SM"
    },
    {
        user: "System",
        action: "generated invoice #4023",
        time: "15 mins ago",
        avatar: "",
        initials: "SYS"
    },
    {
        user: "Mike T.",
        action: "completed job at 123 Main St",
        time: "1 hour ago",
        avatar: "/avatars/02.png",
        initials: "MT"
    },
    {
        user: "Alert",
        action: "Inventory low: Cleaning Fluid",
        time: "2 hours ago",
        avatar: "",
        initials: "!"
    }
]

export function LiveFeed() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Live Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={activity.avatar} />
                            <AvatarFallback className="text-xs">{activity.initials}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-foreground font-medium leading-none">
                                {activity.user} <span className="text-muted-foreground font-normal">{activity.action}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
