"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! I am the Quantan AI Assistant. How can I help you with our kiosks and services today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Call our FastAPI backend!
      const payload = sessionId ? { query: userMsg.content, session_id: sessionId } : { query: userMsg.content };
      
      // const response = await fetch("http://127.0.0.1:8000/api/v1/chat/", {
      const response = await fetch("https://quantan-chatbot-api.onrender.com/api/v1/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      // Save the session ID so the AI remembers us next time
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }
      
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "bot", content: data.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "bot", content: "Error connecting to Quantan AI servers." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4 font-sans text-slate-100">
      
      {/* Dynamic Animated Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      
      <Card className="w-full max-w-4xl h-[85vh] flex flex-col bg-slate-950/60 backdrop-blur-xl border-slate-800 shadow-2xl rounded-3xl overflow-hidden">
        
        <CardHeader className="border-b border-slate-800 bg-slate-900/50 p-6 flex flex-row items-center space-x-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Bot size={32} className="text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white tracking-tight">Quantan AI Support</CardTitle>
            <p className="text-slate-400 text-sm font-medium mt-1">Intelligent self-service solutions</p>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden relative">
          <ScrollArea className="h-full p-6 w-full" ref={scrollRef}>
            <div className="space-y-6 max-w-3xl mx-auto pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                >
                  <Avatar className={`w-10 h-10 border-2 shadow-lg ${msg.role === "user" ? "border-blue-500/50" : "border-indigo-500/50"}`}>
                    <AvatarFallback className={msg.role === "user" ? "bg-blue-600 text-white" : "bg-indigo-600 text-white"}>
                      {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div
                    className={`px-5 py-4 rounded-2xl max-w-[80%] text-[15px] leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600/90 text-white rounded-tr-sm"
                        : "bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-sm backdrop-blur-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-4 animate-in fade-in duration-300">
                  <Avatar className="w-10 h-10 border-2 border-indigo-500/50 shadow-lg">
                    <AvatarFallback className="bg-indigo-600 text-white">
                      <Bot size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="px-5 py-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 rounded-tl-sm backdrop-blur-sm flex items-center gap-2 text-slate-400">
                    <Loader2 size={16} className="animate-spin text-indigo-400" />
                    <span className="text-sm font-medium">Quantan AI is typing...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 bg-slate-900/80 border-t border-slate-800 backdrop-blur-md">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex w-full items-center space-x-3 max-w-3xl mx-auto"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about kiosks, installation, or troubleshooting..."
              className="flex-1 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-14 px-6 rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all shadow-inner text-[15px]"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <Send size={20} className="text-white ml-1" />
            </Button>
          </form>
        </CardFooter>

      </Card>
    </div>
  );
}
