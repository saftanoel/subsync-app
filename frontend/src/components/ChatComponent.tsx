import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Manage WebSocket connection
  useEffect(() => {
    if (!user?.username) return;

    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${user.username}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle history (array of messages) or single message
        if (Array.isArray(data)) {
          // It's the initial history, but in our backend we send history one by one:
          // for msg in history: await websocket.send_json(msg)
          // Wait, actually the backend sends them one by one. So we only receive objects.
        } else if (data.sender_username && data.text) {
          setMessages((prev) => {
            // Avoid duplicate messages if _id is the same (happens with React Strict Mode re-mounts)
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
    <div className="glass flex flex-col rounded-xl border border-border/50 bg-secondary/20 shadow-sm h-[400px]">
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3 bg-secondary/40 rounded-t-xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
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
            className="h-9 w-9 gradient-primary text-primary-foreground shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
