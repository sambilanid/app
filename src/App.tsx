/**
 * Root component aplikasi.
 * Digunakan saat: Entry point utama yang mengatur navigasi antar halaman.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SearchResultsPage from './pages/SearchResultsPage';
import QuestDetailPage from './pages/QuestDetailPage';
import TopUpPage from './pages/TopUpPage';
import ProfilePage from './pages/ProfilePage';
import ActivityPage from './pages/ActivityPage';
import CreateQuestPage from './pages/CreateQuestPage';
import NotificationsPage from './pages/NotificationsPage';
import ChatListPage from './pages/ChatListPage';
import QuestEvidencePage from './pages/QuestEvidencePage';
import WithdrawPage from './pages/WithdrawPage';
import { BottomNavigationBar } from './components/common/BottomNavigationBar';
import { AppProvider } from './store/AppProvider';

type Page = 'home' | 'search' | 'results' | 'detail' | 'topup' | 'profile' | 'activity' | 'create' | 'notifications' | 'chatList' | 'evidence' | 'withdraw';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [previousPage, setPreviousPage] = useState<Page | null>(null);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  const navigateTo = (page: Page, questId?: string) => {
    if (page !== currentPage) {
      setPreviousPage(currentPage);
    }
    if (questId) {
      setSelectedQuestId(questId);
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onTopUp={() => navigateTo('topup')} 
            onWithdraw={() => navigateTo('withdraw')}
            onNavigate={(p, qId) => navigateTo(p, qId)}
            onNotifications={() => navigateTo('notifications')}
            onChat={() => navigateTo('chatList')}
            onFinish={() => navigateTo('evidence')}
          />
        );
      case 'search':
        return (
          <SearchPage 
            onBack={() => navigateTo('home')}
            onSearch={() => navigateTo('results')}
          />
        );
      case 'results':
        return (
          <SearchResultsPage 
            onBack={() => navigateTo('search')}
            onSelectQuest={(qId) => navigateTo('detail', qId)}
          />
        );
      case 'detail':
        return (
          <QuestDetailPage 
            questId={selectedQuestId}
            onBack={() => navigateTo(previousPage === 'detail' ? 'home' : (previousPage || 'home'))}
          />
        );
      case 'topup':
        return (
          <TopUpPage onBack={() => navigateTo('home')} />
        );
      case 'profile':
        return (
          <ProfilePage 
            onBack={() => navigateTo('home')}
            onTopUp={() => navigateTo('topup')}
            onWithdraw={() => navigateTo('withdraw')}
          />
        );
      case 'activity':
        return (
          <ActivityPage 
            onBack={() => navigateTo('home')}
            onSelectQuest={(qId) => navigateTo('detail', qId)}
          />
        );
      case 'create':
        return (
          <CreateQuestPage onBack={() => navigateTo('home')} />
        );
      case 'notifications':
        return (
          <NotificationsPage onBack={() => navigateTo('home')} />
        );
      case 'chatList':
        return (
          <ChatListPage 
            onBack={() => navigateTo('home')} 
            onSelectChat={() => {}} // Could lead to chat detail
          />
        );
      case 'evidence':
        return (
          <QuestEvidencePage 
            onBack={() => navigateTo('home')}
            onFinish={() => navigateTo('activity')}
          />
        );
      case 'withdraw':
        return (
          <WithdrawPage onBack={() => navigateTo('home')} />
        );
      default:
        return <HomePage 
          onTopUp={() => navigateTo('topup')} 
          onWithdraw={() => navigateTo('withdraw')}
          onNavigate={(p) => navigateTo(p)}
          onNotifications={() => navigateTo('notifications')}
          onChat={() => navigateTo('chatList')}
          onFinish={() => navigateTo('evidence')}
        />;
    }
  };

  const showNavbar = ['home', 'search', 'results', 'activity', 'profile'].includes(currentPage);
  const activeTab = (currentPage === 'results' ? 'search' : currentPage) as 'home' | 'search' | 'activity' | 'profile';

  return (
    <div className="h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-screen-md bg-white relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>

        {showNavbar && (
          <BottomNavigationBar 
            activeTab={activeTab} 
            onNavigate={(p) => navigateTo(p)} 
            onCreateQuest={() => navigateTo('create')} 
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
