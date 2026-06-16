/**
 * Root component aplikasi.
 * Digunakan saat: Entry point utama yang mengatur navigasi antar halaman dengan sistem stack.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import QuestDetailPage from "./pages/QuestDetailPage";
import TopUpPage from "./pages/TopUpPage";
import ProfilePage from "./pages/ProfilePage";
import ActivityPage from "./pages/ActivityPage";
import CreateQuestPage from "./pages/CreateQuestPage";
import ManageQuestPage from "./pages/ManageQuestPage";
import NotificationsPage from "./pages/NotificationsPage";
import ChatListPage from "./pages/ChatListPage";
import ChatDetailPage from "./pages/ChatDetailPage";
import QuestEvidencePage from "./pages/QuestEvidencePage";
import QuestEvidenceSuccessPage from "./pages/QuestEvidenceSuccessPage";
import WithdrawPage from "./pages/WithdrawPage";
import WithdrawSuccessPage from "./pages/WithdrawSuccessPage";
import LoginPage from "./pages/LoginPage";
import { BottomNavigationBar } from "./components/common/BottomNavigationBar";
import { DialogProvider } from "./components/common/Dialog";
import { useApp } from "./store/AppContext";
import { AppProvider } from "./store/AppProvider";

type Page =
  | "home"
  | "search"
  | "detail"
  | "topup"
  | "profile"
  | "activity"
  | "create"
  | "manage"
  | "notifications"
  | "chatList"
  | "chatDetail"
  | "evidence"
  | "evidenceSuccess"
  | "withdraw"
  | "withdrawSuccess";

interface StackItem {
  id: string;
  page: Page;
  params?: {
    questId?: string;
    chatId?: string;
    searchQuery?: string;
    withdrawSuccessData?: { amount: string; method: string; destination: string };
  };
}

const TAB_ORDER: Page[] = ["home", "search", "activity", "profile"];

function AppContent() {
  const { state, findOrCreateChat } = useApp();
  const [stack, setStack] = useState<StackItem[]>([
    { id: "home", page: "home" }
  ]);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!state.user) {
      setStack([{ id: "home", page: "home" }]);
      setDirection(0);
    }
  }, [state.user]);

  if (!state.user) {
    return (
      <div className="h-screen bg-black flex justify-center">
        <div className="w-full max-w-screen-md bg-white relative h-screen overflow-hidden">
          <LoginPage />
        </div>
      </div>
    );
  }

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
      return;
    }
    
    setDirection(1);
    setStack(prev => [...prev, { 
      id: `${page}-${Date.now()}`, 
      page, 
      params 
    }]);
  };

  const pop = () => {
    if (stack.length > 1) {
      setDirection(-1);
      setStack(prev => prev.slice(0, -1));
    }
  };

  const replace = (page: Page, params?: StackItem["params"]) => {
    setDirection(0);
    setStack(prev => {
      const newStack = [...prev];
      newStack[newStack.length - 1] = { 
        id: `${page}-${Date.now()}`, 
        page, 
        params 
      };
      return newStack;
    });
  };

  const renderPage = (item: StackItem) => {
    const { page, params } = item;
    
    switch (page) {
      case "home":
        return (
          <HomePage
            onTopUp={() => push("topup")}
            onWithdraw={() => push("withdraw")}
            onNavigate={(p, qId, query) => push(p, { questId: qId, searchQuery: query })}
            onNotifications={() => push("notifications")}
            onChat={(qId) => {
              if (qId) {
                const quest = state.allQuests.find(q => q.id === qId);
                if (quest) {
                  const chatId = findOrCreateChat([state.currentUserId!, quest.creatorId], qId);
                  push("chatDetail", { chatId });
                }
              } else {
                push("chatList");
              }
            }}
            onFinish={(qId) => push("evidence", { questId: qId })}
          />
        );
      case "search":
        return (
          <SearchPage
            onBack={() => push("home")}
            onSelectQuest={(qId) => push("detail", { questId: qId })}
          />
        );
      case "detail":
        return (
          <QuestDetailPage
            questId={params?.questId || null}
            onBack={pop}
            onChat={(qId) => {
              const quest = state.allQuests.find(q => q.id === qId);
              if (quest) {
                const chatId = findOrCreateChat([state.currentUserId!, quest.creatorId], qId);
                push("chatDetail", { chatId });
              }
            }}
            onFinish={(qId) => push("evidence", { questId: qId })}
          />
        );
      case "topup":
        return <TopUpPage onBack={pop} />;
      case "profile":
        return (
          <ProfilePage
            onBack={() => push("home")}
            onTopUp={() => push("topup")}
            onWithdraw={() => push("withdraw")}
          />
        );
      case "activity":
        return (
          <ActivityPage
            onBack={() => push("home")}
            onSelectQuest={(qId) => push("detail", { questId: qId })}
            onFinish={(qId) => push("evidence", { questId: qId })}
            onChat={(qId) => {
              const quest = state.allQuests.find(q => q.id === qId);
              if (quest) {
                const chatId = findOrCreateChat([state.currentUserId!, quest.creatorId], qId);
                push("chatDetail", { chatId });
              }
            }}
          />
        );
      case "create":
        return <CreateQuestPage onBack={pop} />;
      case "manage":
        return (
          <ManageQuestPage 
            questId={params?.questId || null} 
            onBack={pop} 
          />
        );
      case "notifications":
        return <NotificationsPage onBack={pop} />;
      case "chatList":
        return (
          <ChatListPage
            onBack={pop}
            onSelectChat={(chatId) =>
              push("chatDetail", { chatId: chatId })
            }
          />
        );
      case 'chatDetail':
        return (
          <ChatDetailPage 
            chatId={params?.chatId}
            onBack={pop}
          />
        );
      case "evidence":
        return (
          <QuestEvidencePage
            questId={params?.questId || null}
            onBack={pop}
            onFinish={() => replace("evidenceSuccess")}
          />
        );
      case "evidenceSuccess":
        return (
          <QuestEvidenceSuccessPage
            onActivity={() => push("activity")}
            onBack={pop}
          />
        );
      case "withdraw":
        return (
          <WithdrawPage 
            onBack={pop} 
            onSuccess={(data) => {
              replace("withdrawSuccess", { withdrawSuccessData: data });
            }}
          />
        );
      case "withdrawSuccess":
        return (
          <WithdrawSuccessPage 
            amount={params?.withdrawSuccessData?.amount || "0"}
            method={params?.withdrawSuccessData?.method || ""}
            destination={params?.withdrawSuccessData?.destination || ""}
            onHome={() => push("home")}
          />
        );
      default:
        return null;
    }
  };

  const topPage = stack[stack.length - 1];
  const showNavbar = TAB_ORDER.includes(topPage.page);
  
  const activeTab = topPage.page as
    | "home"
    | "search"
    | "activity"
    | "profile";

  return (
    <div className="h-screen bg-black flex justify-center">
      <div className="w-full max-w-screen-md bg-white relative h-screen overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          {stack.map((item, index) => {
            const isTop = index === stack.length - 1;
            return (
              <motion.div
                key={item.id}
                custom={direction}
                initial={{ x: direction > 0 ? "100%" : "-100%" }}
                animate={{ 
                  x: isTop ? 0 : (direction > 0 ? "-20%" : "20%"),
                  scale: isTop ? 1 : 0.96,
                  opacity: isTop ? 1 : 0.5,
                }}
                exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 40,
                  mass: 1
                }}
                className="absolute inset-0 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"
                style={{ zIndex: index }}
              >
                {renderPage(item)}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {showNavbar && (
          <div className="absolute bottom-0 left-0 right-0 z-[9999]">
            <BottomNavigationBar
              activeTab={activeTab}
              onNavigate={(p) => push(p)}
              onCreateQuest={() => push("create")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <DialogProvider>
        <AppContent />
      </DialogProvider>
    </AppProvider>
  );
}

export default App;
