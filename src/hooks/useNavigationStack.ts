/**
 * Hook kustom untuk mengelola tumpukan navigasi (navigation stack).
 * Digunakan saat: Mengatur state halaman aktif, arah transisi halaman, sinkronisasi dengan browser history, dan aksi navigasi seperti push, pop, dan replace.
 */
import { useState, useEffect, useRef } from "react";

export type Page =
  | "home"
  | "search"
  | "detail"
  | "topup"
  | "topupSuccess"
  | "profile"
  | "activity"
  | "create"
  | "manage"
  | "notifications"
  | "chatList"
  | "chatDetail"
  | "evidence"
  | "evidenceSuccess"
  | "createSuccess"
  | "editProfile"
  | "verification"
  | "withdraw"
  | "withdrawSuccess"
  | "aiSearch"
  | "otherProfile";

export interface StackItem {
  id: string;
  page: Page;
  params?: {
    questId?: string;
    chatId?: string;
    userId?: string;
    searchQuery?: string;
    withdrawSuccessData?: { amount: string; method: string; destination: string };
    topupAmount?: string;
  };
}

const TAB_ORDER: Page[] = ["home", "search", "activity", "profile"];

export function useNavigationStack() {
  const [stack, setStack] = useState<StackItem[]>([
    { id: "home", page: "home" }
  ]);
  const [direction, setDirection] = useState(0);
  const isProgrammaticPop = useRef(false);

  const push = (page: Page, params?: StackItem["params"]) => {
    // Jika menavigasi ke tab utama, reset stack
    if (TAB_ORDER.includes(page) && !params?.searchQuery && !params?.questId) {
      const currentIndex = TAB_ORDER.indexOf(stack[stack.length - 1].page);
      const nextIndex = TAB_ORDER.indexOf(page);
      
      if (currentIndex !== -1 && nextIndex !== -1) {
        setDirection(nextIndex > currentIndex ? 1 : -1);
      } else {
        setDirection(0);
      }

      setStack([{ id: page, page }]);
      window.history.replaceState({ page, params, id: page }, "");
      return;
    }
    
    const id = `${page}-${Date.now()}`;
    setDirection(1);
    setStack(prev => [...prev, { 
      id, 
      page, 
      params 
    }]);
    window.history.pushState({ page, params, id }, "");
  };

  const pop = () => {
    if (stack.length > 1) {
      setDirection(-1);
      setStack(prev => prev.slice(0, -1));
      // Trigger browser back if it was a UI-initiated pop
      if (window.history.state?.id === stack[stack.length - 1].id) {
        isProgrammaticPop.current = true;
        window.history.back();
      }
    }
  };

  const replace = (page: Page, params?: StackItem["params"]) => {
    const id = `${page}-${Date.now()}`;
    setDirection(0);
    setStack(prev => {
      const newStack = [...prev];
      newStack[newStack.length - 1] = { 
        id, 
        page, 
        params 
      };
      return newStack;
    });
    window.history.replaceState({ page, params, id }, "");
  };

  // Sync with browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (isProgrammaticPop.current) {
        isProgrammaticPop.current = false;
        return;
      }
      
      if (stack.length > 1) {
        setDirection(-1);
        setStack(prev => prev.slice(0, -1));
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [stack.length]);

  return {
    stack,
    direction,
    push,
    pop,
    replace
  };
}
