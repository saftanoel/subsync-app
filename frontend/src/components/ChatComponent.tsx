import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { API_BASE, WS_BASE } from "@/config/api";

interface ChatMessage {
  _id?: string;
  sender_username: string;
  text: string;
  timestamp: string;
}

export function ChatComponent() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Manage WebSocket connection
  useEffect(() => {
    if (!user?.username) return;

    const wsUrl = `${WS_BASE}/ws/chat/${user.username}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle history or single message
        if (Array.isArray(data)) {
          // not used right now since backend sends messages 1 by 1
        } else if (data.sender_username && data.text) {
          setMessages((prev) => {
            if (data._id && prev.some((m) => m._id === data._id)) {
              return prev;
            }
            return [...prev, data];
          });
        }
      } catch (error) {
        console.error("Error parsing websocket message:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [user?.username]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(inputText.trim());
    setInputText("");
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full gradient-primary shadow-lg glow-primary p-0 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] origin-bottom-right"
          >
            <div className="glass flex flex-col rounded-xl border border-border/50 bg-secondary/20 shadow-xl h-[450px]">
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-secondary/40 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-sm">
                    <MessageSquare className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold">Live Chat</h3>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className={cn("h-1.5 w-1.5 rounded-full", isConnected ? "bg-emerald-500" : "bg-destructive")}></span>
                      {isConnected ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:bg-secondary/50 rounded-full" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender_username === user?.username;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg._id || idx}
                      className={cn("flex flex-col max-w-[85%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}
                    >
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {isMe ? "You" : msg.sender_username}
                        </span>
                        <span className="text-[9px] text-muted-foreground/60">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "px-3 py-2 rounded-2xl text-sm",
                          isMe 
                            ? "gradient-primary text-primary-foreground rounded-tr-sm" 
                            : "bg-secondary text-secondary-foreground rounded-tl-sm border border-border/50"
                        )}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-secondary/30 rounded-b-xl border-t border-border/50">
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-background/50 border-border/50 text-sm h-9"
                    disabled={!isConnected}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!isConnected || !inputText.trim()} 
                    className="h-9 w-9 gradient-primary text-primary-foreground shrink-0 rounded-full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
