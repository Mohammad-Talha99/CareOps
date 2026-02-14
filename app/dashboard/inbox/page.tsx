"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Search, Send, Phone, Mail, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const MOCK_BUSINESS_ID = "8bb0493a-831a-4a5b-95e0-699f6eb1bab1";

export default function InboxPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const businessId = MOCK_BUSINESS_ID;

    useEffect(() => {
        fetchInbox();
        // Poll every 10 seconds for new messages
        const interval = setInterval(fetchInbox, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedConversation]);

    const fetchInbox = async () => {
        try {
            const res = await fetch(`/api/inbox/messages?businessId=${businessId}`);
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations);

                // If we have a selected conversation, update it with new messages
                if (selectedConversation) {
                    const updated = data.conversations.find((c: any) => c.id === selectedConversation.id);
                    if (updated) setSelectedConversation(updated);
                }
            }
        } catch (error) {
            console.error("Failed to fetch inbox", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation) return;

        setIsSending(true);
        try {
            const res = await fetch("/api/inbox/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId,
                    leadId: selectedConversation.id,
                    content: messageInput,
                    sender: "USER"
                })
            });

            if (res.ok) {
                setMessageInput("");
                fetchInbox(); // Refresh to show new message
            } else {
                alert("Failed to send message");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (isLoading && conversations.length === 0) {
        return <div className="p-8 flex items-center justify-center h-full">Loading inbox...</div>;
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-border flex flex-col bg-muted/10">
                <div className="p-4 border-b border-border bg-card">
                    <h2 className="font-semibold mb-4 px-1">Inbox</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input className="w-full bg-muted pl-9 pr-4 py-2 rounded-md text-sm outline-none border-transparent focus:border-primary transition-all" placeholder="Search messages..." />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground text-sm">
                            No conversations yet.
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={cn(
                                    "p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50",
                                    selectedConversation?.id === conv.id ? "bg-muted border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                                )}
                            >
                                <div className="flex justify-between mb-1">
                                    <span className={cn("font-medium", conv.unreadCount > 0 ? "text-foreground font-bold" : "text-foreground/80")}>
                                        {conv.name}
                                    </span>
                                    {conv.lastMessage && (
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <p className={cn("text-sm line-clamp-1", conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                                    {conv.lastMessage?.content || "No messages"}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border bg-background", conv.status === "NEW" ? "border-blue-200 text-blue-600" : "border-gray-200 text-gray-500")}>
                                        {conv.status || "Lead"}
                                    </span>
                                    {conv.unreadCount > 0 && (
                                        <span className="bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Message Detail */}
            <div className="flex-1 flex flex-col bg-card">
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b border-border flex justify-between items-center bg-card/50 shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-bold text-sm">{selectedConversation.name}</h2>
                                    <p className="text-xs text-muted-foreground">{selectedConversation.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8"><Phone className="w-4 h-4" /></Button>
                                <Button variant="outline" size="icon" className="h-8 w-8"><Mail className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-muted/5 scroll-smooth" ref={scrollRef}>
                            {(!selectedConversation.messages || selectedConversation.messages.length === 0) && (
                                <div className="text-center text-muted-foreground py-10">
                                    Start a conversation with {selectedConversation.name}
                                </div>
                            )}

                            {selectedConversation.messages?.map((msg: any) => (
                                <div key={msg.id} className={cn("flex w-full", msg.sender === "USER" || msg.sender === "SYSTEM" ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[75%] p-3 rounded-2xl text-sm shadow-sm",
                                        msg.sender === "USER" ? "bg-primary text-primary-foreground rounded-br-none" :
                                            msg.sender === "SYSTEM" ? "bg-amber-100 text-amber-900 border border-amber-200" :
                                                "bg-muted text-foreground rounded-bl-none"
                                    )}>
                                        <p>{msg.content}</p>
                                        <div className={cn("text-[10px] mt-1 opacity-70 flex justify-end gap-1", msg.sender === "USER" ? "text-primary-foreground" : "text-muted-foreground")}>
                                            {msg.sender === "SYSTEM" && <span className="font-bold">AUTO</span>}
                                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-border bg-card">
                            <div className="flex gap-2 items-end">
                                <textarea
                                    className="flex-1 bg-muted px-4 py-3 rounded-xl border border-input outline-none focus:ring-1 ring-primary resize-none min-h-[50px] max-h-[150px]"
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim() || isSending}
                                    className="h-[50px] w-[50px] rounded-xl shrink-0"
                                >
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                Press Enter to send, Shift + Enter for new line
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="font-medium">Select a conversation</p>
                        <p className="text-sm">Choose a lead from the sidebar to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
