import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Bot, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface AIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIDialog({ open, onOpenChange }: AIDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Chào bạn! Tôi là trợ lý ảo từ **NHUTCODER TEAM**. Tôi có thể giúp gì cho bạn với Android Server Mini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const agent = window.__PAGE_AGENT_INSTANCE__;
      if (agent && agent.execute) {
        // We use the agent to process the instruction
        // Since it's a demo script, we simulate the conversation flow
        // while the agent performs actions on the background if needed.
        const response = await agent.execute(userMessage);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              response?.data ||
              response?.message ||
              "Tôi đã thực hiện yêu cầu của bạn. Bạn có cần hỗ trợ gì thêm không?",
          },
        ]);
      } else {
        // Fallback if agent not ready
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Xin lỗi, hệ thống AI đang khởi động. Vui lòng thử lại sau giây lát!",
            },
          ]);
          setIsLoading(false);
        }, 1000);
        return;
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Đã có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[9999] sm:max-w-[420px] h-[550px] flex flex-col bg-background/95 backdrop-blur-2xl border-emerald-500/20 p-0 shadow-2xl overflow-hidden gap-0">
        <DialogHeader className="p-4 border-b border-emerald-500/10 bg-emerald-500/5">
          <DialogTitle className="flex items-center gap-2 text-emerald-500">
            <Sparkles className="h-5 w-5 fill-current" /> NHUTCODER AI
          </DialogTitle>
          <DialogDescription className="text-[10px] uppercase tracking-widest font-mono">
            Powered by NHUTCODER TEAM
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "assistant"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "assistant"
                        ? "bg-secondary/50 text-foreground rounded-tl-none"
                        : "bg-emerald-500 text-white rounded-tr-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="bg-secondary/50 rounded-2xl rounded-tl-none px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" />
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-emerald-500/10 bg-background">
          <div className="relative flex items-center gap-2">
            <Input
              placeholder="Nhập yêu cầu của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="pr-12 bg-secondary/30 border-emerald-500/10 h-11 text-sm focus-visible:ring-emerald-500"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-1 h-9 w-9 bg-emerald-500 hover:bg-emerald-600 transition-all"
            >
              <Send size={16} />
            </Button>
          </div>
          <p className="text-[9px] text-center mt-2 text-muted-foreground">
            AI có thể thực hiện thao tác trực tiếp trên trang web này.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
