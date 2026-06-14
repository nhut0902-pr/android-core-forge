import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

declare global {
  interface Window {
    PageAgent: any;
    __PAGE_AGENT_INSTANCE__: any;
  }
}

interface AIAssistantProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function AIAssistant({ onOpenChange, open }: AIAssistantProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkInstance = () => {
      const agent = window.__PAGE_AGENT_INSTANCE__;

      if (agent) {
        setIsLoaded(true);

        // Hide default button and panel as we use our own Dialog
        const hideDefault = () => {
          const defaultBtn = document.querySelector(".page-agent-trigger");
          if (defaultBtn) (defaultBtn as HTMLElement).style.display = "none";

          if (agent.panel) {
            // Force hide the default panel if it tries to show
            agent.panel.hide();
          }
        };

        hideDefault();
        const timer = setInterval(hideDefault, 1000);
        return () => clearInterval(timer);
      } else {
        setTimeout(checkInstance, 500);
      }
    };

    checkInstance();
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[60] sm:bottom-28 sm:right-8">
      <motion.button
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onOpenChange(true)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all hover:bg-emerald-600"
        aria-label="AI Assistant"
      >
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20"></div>
        <Sparkles className="relative h-7 w-7" />

        <span className="absolute -top-2 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-background">
          AI
        </span>
      </motion.button>

      {!open && (
        <div className="absolute -left-48 bottom-4 hidden w-44 rounded-xl border border-emerald-500/20 bg-background/80 p-3 shadow-xl backdrop-blur-md lg:block">
          <p className="text-[11px] font-medium leading-relaxed">
            Chào bạn! Tôi là trợ lý ảo từ{" "}
            <span className="text-emerald-500 font-bold">NHUTCODER TEAM</span>. Tôi có thể giúp gì
            cho bạn?
          </p>
          <div className="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-r border-t border-emerald-500/20 bg-background/80"></div>
        </div>
      )}
    </div>
  );
}
