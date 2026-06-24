/**
 * Root component aplikasi.
 * Digunakan saat: Entry point utama yang mengatur navigasi antar halaman dengan sistem stack dan menyuplai context global.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomePage from "./pages/WelcomePage";
import AuthLoginPage from "./pages/AuthLoginPage";
import AuthRegisterPage from "./pages/AuthRegisterPage";
import AccountSwitcherPage from "./pages/AccountSwitcherPage";
import { BottomNavigationBar } from "./components/common/BottomNavigationBar";
import { DialogProvider } from "./components/common/Dialog";
import { useApp } from "./store/AppContext";
import { AppProvider } from "./store/AppProvider";
import { useNavigationStack } from "./hooks/useNavigationStack";
import type { Page } from "./hooks/useNavigationStack";
import { AppRouter } from "./components/navigation/AppRouter";

const TAB_ORDER: Page[] = ["home", "search", "activity", "profile"];

function AppContent() {
  const { state } = useApp();
  const { stack, direction, push, pop, replace } = useNavigationStack();
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
                <AppRouter
                  item={item}
                  push={push}
                  pop={pop}
                  replace={replace}
                  hasMoreThanOnePage={stack.length > 1}
                />
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
