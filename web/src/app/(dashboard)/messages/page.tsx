"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Message = {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
};

export default function MessagesPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // For demo, hardcoding the "other" user.
    // Ideally, you'd select from a list of users.
    const otherUserId = user?.id === "ADMIN-01" ? "ST-001" : "ADMIN-01"; // Admin <-> Student demo

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (user) {
            fetchMessages();

            // Auto-refresh every 3 seconds for real-time feel
            const interval = setInterval(() => {
                fetchMessages();
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/messages?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !user) return;

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: user.id,
                    receiverId: otherUserId,
                    content: newMessage,
                }),
            });

            if (res.ok) {
                setNewMessage("");
                fetchMessages(); // Refresh
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-[calc(100vh-theme(spacing.24))] flex-col rounded-xl border bg-card shadow-sm">
            <div className="flex items-center border-b px-6 py-4">
                <h2 className="text-lg font-semibold">Chat with School</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {loading ? (
                    <div className="text-center text-muted-foreground">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-muted-foreground">No messages yet. Say hello!</div>
                ) : (
                    <>
                        {messages.map((msg) => {
                            const isMe = msg.senderId === user?.id;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-3 ${isMe
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                        <p className={`mt-1 text-xs ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="border-t p-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={sendMessage}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
