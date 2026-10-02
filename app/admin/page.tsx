"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, MessageSquare, LayoutDashboard } from "lucide-react";

type Conversation = {
  id: number;
  session_id: string;
  title: string;
  started_at: string;
  message_count: number;
};

export default function AdminDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // In a real application, you would first get the JWT token from a Login page
    // For now, this demonstrates where the RBAC-secured API call happens
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          setError("No authentication token found. Please login as Admin.");
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/api/v1/admin/conversations", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 403) setError("Forbidden: You do not have Admin privileges.");
          else if (res.status === 401) setError("Unauthorized: Please login again.");
          else setError("Failed to fetch data.");
          return;
        }

        const data = await res.json();
        setConversations(data);
      } catch (err) {
        setError("Network error connecting to backend.");
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-indigo-400">Quantan Admin</h2>
        <nav className="space-y-4 flex-1">
          <a href="#" className="flex items-center gap-3 text-indigo-300 font-medium bg-slate-800 p-3 rounded-lg">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors p-3">
            <MessageSquare size={20} /> Conversations
          </a>
          <a href="#" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors p-3">
            <Users size={20} /> User Roles
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-hidden flex flex-col">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Conversation Intelligence</h1>
          <p className="text-slate-500 mt-2">Monitor all customer interactions with the AI Chatbot.</p>
        </header>

        {error ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6 text-red-600 font-medium">
              {error}
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <div className="grid gap-4">
              {conversations.map((conv) => (
                <Card key={conv.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Avatar className="bg-indigo-100 text-indigo-600">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg text-slate-800">{conv.title}</CardTitle>
                          <p className="text-sm text-slate-500 font-mono mt-1">Session: {conv.session_id.split("-")[0]}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-700">{conv.message_count} messages</p>
                        <p className="text-xs text-slate-400">{new Date(conv.started_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
              {conversations.length === 0 && !error && (
                <div className="text-center py-20 text-slate-400">
                  <p>No conversations found.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </main>

    </div>
  );
}
