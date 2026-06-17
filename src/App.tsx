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
import CreateQuestSuccessPage from "./pages/CreateQuestSuccessPage";
import TopUpSuccessPage from "./pages/TopUpSuccessPage";
import EditProfilePage from "./pages/EditProfilePage";
import OtherProfilePage from "./pages/OtherProfilePage";
import VerificationPage from "./pages/VerificationPage";
import WithdrawPage from "./pages/WithdrawPage";
import WithdrawSuccessPage from "./pages/WithdrawSuccessPage";
import WelcomePage from "./pages/WelcomePage";
import AISearchPage from "./pages/AISearchPage";
import AccountSwitcherPage from "./pages/AccountSwitcherPage";
import AuthLoginPage from "./pages/AuthLoginPage";
import AuthRegisterPage from "./pages/AuthRegisterPage";
import { BottomNavigationBar } from "./components/common/BottomNavigationBar";
import { DialogProvider } from "./components/common/Dialog";
import { useApp } from "./store/AppContext";
import { AppProvider } from "./store/AppProvider";

type Page =
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

interface StackItem {
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

function AppContent() {
  const { state, findOrCreateChat } = useApp();
  const [stack, setStack] = useState<StackItem[]>([
    { id: "home", page: "home" }
  ]);
  const [direction, setDirection] = useState(0);
  const [authView, setAuthView] = useState<"welcome" | "switcher" | "login" | "register">("welcome");

  if (!state.user) {
    const renderAuthView = () => {
      switch (authView) {
        case "welcome":
          return (
            <WelcomePage 
              onLogin={() => setAuthView("login")}
              onRegister={() => setAuthView("register")}
              onSwitchAccount={() => setAuthView("switcher")}
            />
          );
        case "login":
          return (
            <AuthLoginPage 
              onBack={() => setAuthView("welcome")}
              onRegister={() => setAuthView("register")}
              onSuccess={() => {}} // login is handled inside AuthLoginPage
            />
          );
        case "register":
          return (
            <AuthRegisterPage 
              onBack={() => setAuthView("welcome")}
              onLogin={() => setAuthView("login")}
              onSuccess={() => setAuthView("switcher")}
            />
          );
        case "switcher":
          return <AccountSwitcherPage onBack={() => setAuthView("welcome")} />;
        default:
          return null;
      }
    };

    return (
      <div className="h-screen bg-black flex justify-center">
        <div className="w-full max-w-screen-md bg-[#f6faff] relative h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={authView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderAuthView()}
            </motion.div>
          </AnimatePresence>
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
      if (stack.length > 1) {
        setDirection(-1);
        setStack(prev => prev.slice(0, -1));
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [stack.length]);

  const renderPage = (item: StackItem) => {
    const { page, params } = item;
    
    const handleBack = stack.length > 1 ? pop : undefined;

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
            onBack={handleBack}
            onSelectQuest={(qId) => push("detail", { questId: qId })}
            onAISearch={() => push("aiSearch")}
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
            onGoToVerification={() => push("verification")}
            onViewProfile={(userId) => push("otherProfile", { userId })}
          />
        );
      case "otherProfile":
        return (
          <OtherProfilePage
            userId={params?.userId || null}
            onBack={pop}
          />
        );
      case "topup":
        return (
          <TopUpPage 
            onBack={pop} 
            onSuccess={(amt) => replace("topupSuccess", { topupAmount: amt })}
          />
        );
      case "topupSuccess":
        return (
          <TopUpSuccessPage
            amount={params?.topupAmount || "0"}
            onDone={() => push("home")}
          />
        );
      case "profile":
        return (
          <ProfilePage
            onBack={handleBack}
            onTopUp={() => push("topup")}
            onWithdraw={() => push("withdraw")}
            onEditProfile={() => push("editProfile")}
            onVerify={() => push("verification")}
          />
        );
      case "verification":
        return (
          <VerificationPage
            onBack={pop}
            onSuccess={pop}
          />
        );
      case "editProfile":
        return (
          <EditProfilePage
            onBack={pop}
            onSuccess={pop}
          />
        );
      case "activity":
        return (
          <ActivityPage
            onBack={handleBack}
            onSelectQuest={(qId) => push("detail", { questId: qId })}
            onManageQuest={(qId) => push("manage", { questId: qId })}
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
        return (
          <CreateQuestPage 
            onBack={pop} 
            onSuccess={() => replace("createSuccess")}
            onGoToVerification={() => push("verification")}
            onGoToTopUp={() => push("topup")}
          />
        );
      case "createSuccess":
        return (
          <CreateQuestSuccessPage
            onActivity={() => push("activity")}
            onHome={() => push("home")}
            onBack={pop}
          />
        );
      case "manage":
        return (
          <ManageQuestPage 
            questId={params?.questId || null} 
            onBack={pop} 
            onChatWithApplicant={(applicantId) => {
              const chatId = findOrCreateChat([state.currentUserId!, applicantId], params?.questId);
              push("chatDetail", { chatId });
            }}
            onViewProfile={(userId) => push("otherProfile", { userId })}
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
      case "aiSearch":
        return (
          <AISearchPage 
            onBack={pop}
            onSelectQuest={(qId) => push("detail", { questId: qId })}
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

function AppWrapper() {
  const { state } = useApp();
  return <AppContent key={state.user?.id || 'guest'} />;
}

function App() {
  return (
    <AppProvider>
      <DialogProvider>
        <AppWrapper />
      </DialogProvider>
    </AppProvider>
  );
}

export default App;
