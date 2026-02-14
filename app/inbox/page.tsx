"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, User, MoreVertical, Phone, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const MOCK_BUSINESS_ID = "cm730vn6600010clc8x6k0k2j";

export default function InboxPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(true);

    // Auto-scroll logic
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const businessId = MOCK_BUSINESS_ID;

    useEffect(() => {
        fetchConversations();
        // Poll for new messages every 10s? For MVP, just on load/send
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await fetch(`/api/inbox/messages?businessId=${businessId}`);
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations);
                // Select first conversation if none selected
                if (!selectedId && data.conversations.length > 0) {
                    setSelectedId(data.conversations[0].id);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Derived state for current conversation
    const selectedConversation = conversations.find(c => c.id === selectedId);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedId) return;

        try {
            const res = await fetch("/api/inbox/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId,
                    leadId: selectedId,
                    content: messageInput,
                    sender: "USER"
                })
            });

            if (res.ok) {
                setMessageInput("");
                fetchConversations(); // Refresh to see new message
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedConversation?.messages]);

    if (loading) return <div className="p-8">Loading inbox...</div>;

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar List */}
            <div className="w-80 border-r bg-muted/10 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold mb-4">Inbox</h2>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search messages..." className="pl-8" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-2 p-2">
                        {conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedId(conv.id)}
                                className={`flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted ${selectedId === conv.id ? "bg-muted font-medium" : ""
                                    }`}
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{conv.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold truncate">{conv.name}</div>
                                        {conv.lastMessage && (
                                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground truncate">
                                        {conv.lastMessage?.content || "No messages yet"}
                                    </div>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2" />
                                )}
                            </button>
                        ))}
                        {conversations.length === 0 && (
                            <div className="text-center p-8 text-muted-foreground">No conversations yet.</div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Header */}
                        <div className="h-16 border-b flex items-center justify-between px-6 bg-background">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{selectedConversation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold">{selectedConversation.name}</div>
                                    <div className="text-xs text-muted-foreground">{selectedConversation.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                                <Separator orientation="vertical" className="h-6" />
                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                {selectedConversation.messages?.map((msg: any) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === "USER" || msg.sender === "SYSTEM" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg p-3 ${msg.sender === "USER" || msg.sender === "SYSTEM"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 opacity-70 ${msg.sender === "USER" || msg.sender === "SYSTEM" ? "text-primary-foreground" : "text-muted-foreground"
                                                }`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {msg.sender === "SYSTEM" && " • Automated"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t bg-background">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    placeholder="Type your message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={!messageInput.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Select a conversation to start chatting.
                    </div>
                )}
            </div>
        </div>
    );
}
