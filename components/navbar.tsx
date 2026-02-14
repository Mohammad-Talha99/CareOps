import Link from "next/link";
import { Menu, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                        <Activity className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
                        CareOps
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <ModeToggle />

                <div className="hidden md:flex items-center gap-6">
                    <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
                        <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
                        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                    </nav>
                    <div className="h-6 w-px bg-border"></div>
                </div>

                <Link href="/contact">
                    <Button variant="default" className="rounded-lg shadow-lg shadow-primary/20">
                        Contact Us
                    </Button>
                </Link>

                <button className="md:hidden flex items-center justify-center p-2 text-muted-foreground hover:text-foreground">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </nav>
    )
}
