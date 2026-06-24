/**
 * Halaman utama aplikasi.
 * Digunakan saat: Landing page setelah login yang berisi ringkasan aktivitas dan rekomendasi.
 */
import React from "react";
import { Bell, MessageSquare, Clock, Search, Sparkles } from "lucide-react";
import { Avatar } from "../components/common/Avatar";
import { PageHeader } from "../components/common/PageHeader";
import { WalletSection } from "../components/home/WalletSection";
import { ActiveQuestCard } from "../components/quest/ActiveQuestCard";
import { StandardQuestCard } from "../components/quest/StandardQuestCard";
import { QuestCard } from "../components/quest/QuestCard";
import { PageLayout } from "../components/common/PageLayout";
import { useApp } from "../store/AppContext";
import { getQuestDisplayInfo } from "../utils/questUtils";
import { getTimeGreeting } from "../utils/dateUtils";
import { useQuestRecommendations } from "../hooks/useQuestRecommendations";

interface HomePageProps {
  onTopUp?: () => void;
  onWithdraw?: () => void;
  onNavigate: (
    page: "home" | "search" | "activity" | "profile" | "detail" | "manage",
    questId?: string,
    query?: string,
  ) => void;
  onNotifications: () => void;
  onChat: (questId?: string) => void;
  onFinish: (questId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  onTopUp,
  onWithdraw,
  onNavigate,
  onNotifications,
  onChat,
  onFinish,
}) => {
  const { state } = useApp();
  const { availableQuests, activeQuests, pendingQuests, user } = state;
  const unreadCount = user!.notifications.filter((n) => n.unread).length;

  const { aiSuggestedQuests, aiAffirmation } = useQuestRecommendations(availableQuests, user);

  return (
    <PageLayout
      hasNavbar
      header={
        <PageHeader
          title={`${getTimeGreeting()}, ${user!.name.split(" ")[0]}!`}
          subtitle="Apa yang kamu butuhin hari ini?"
          rightAction={
            <div className="flex items-center gap-1">
              <button
                onClick={() => onChat()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MessageSquare size={20} className="text-dark" />
              </button>
              <button
                onClick={onNotifications}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              >
                <Bell size={20} className="text-dark" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
                )}
              </button>
              <button
                onClick={() => onNavigate("profile")}
                className="ml-1 active:scale-95 transition-transform"
              >
                <Avatar
                  size="sm"
                  src={user!.avatar}
                  initials={user!.initials}
                  className="border border-gray-100"
                />
              </button>
            </div>
          }
        />
      }
    >
      <div>
        <WalletSection onTopUp={onTopUp} onWithdraw={onWithdraw} />

        <div className="px-5 mt-6 flex flex-col gap-4">
          <h2 className="text-[#3e4943] text-base px-1 font-bold">Quest aktif</h2>
          {activeQuests.length > 0 ? (
            activeQuests.map((quest) => (
              <ActiveQuestCard 
                key={quest.id}
                quest={quest}
                onFinish={() => onFinish(quest.id)} 
                onClick={() => onNavigate('detail', quest.id)}
              />
            ))
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-3">
                <Clock size={24} className="text-gray-300" />
              </div>
              <p className="text-[#3e4943] text-sm font-medium opacity-60">Belum ada quest aktif yang sedang dikerjakan.</p>
            </div>
          )}
        </div>

        {pendingQuests.length > 0 && (
          <div className="px-5 mt-8 flex flex-col gap-4">
            <h2 className="text-[#3e4943] text-base px-1 font-bold">Menunggu persetujuan</h2>
            {pendingQuests.map((quest) => (
              <ActiveQuestCard 
                key={quest.id}
                quest={quest}
                onClick={() => onNavigate('detail', quest.id)}
              />
            ))}
          </div>
        )}

        {state.allQuests.filter(q => q.creatorId === state.currentUserId && (q.status === 'available' || q.status === 'active' || q.status === 'pending' || q.status === 'disputed')).length > 0 && (
          <div className="px-5 mt-8 flex flex-col gap-4">
            <h2 className="text-[#3e4943] text-base px-1 font-bold">Quest buatanmu</h2>
            {state.allQuests
              .filter(q => q.creatorId === state.currentUserId && (q.status === 'available' || q.status === 'active' || q.status === 'pending' || q.status === 'disputed'))
              .sort((a, b) => {
                if (a.status === 'disputed' && b.status !== 'disputed') return -1;
                if (a.status === 'pending' && b.status !== 'pending' && b.status !== 'disputed') return -1;
                if (a.status === 'active' && b.status === 'available') return -1;
                if (a.status === 'available' && b.status === 'active') return 1;
                return 0;
              })
              .map((quest) => {
                const displayInfo = getQuestDisplayInfo(quest, state.currentUserId);
                let badgeClass = "text-primary bg-primary/10";

                if (displayInfo.status === 'disputed') badgeClass = "text-red-500 bg-red-500/10";
                else if (displayInfo.status === 'on_going') badgeClass = "text-[#7ea400] bg-[#7ea400]/10";
                else if (displayInfo.status === 'waiting_confirmation') badgeClass = "text-orange-500 bg-orange-500/10";
                else if (displayInfo.status === 'has_applicants') badgeClass = "text-blue-500 bg-blue-500/10";
                else if (displayInfo.status === 'waiting_adventurer') badgeClass = "text-gray-400 bg-gray-100";
                return (
                  <QuestCard 
                    key={quest.id}
                    variant="active"
                    category={quest.category}
                    title={quest.title}
                    price={quest.price}
                    distance={quest.distance}
                    image={quest.image}
                    createdAt={quest.createdAt}
                    onClick={() => onNavigate('manage', quest.id)}
                    footer={
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                        {displayInfo.status === 'has_applicants' 
                          ? `${quest.applicantIds?.length || 0} pemohon` 
                          : displayInfo.label}
                      </span>
                    }
                  />
                );
              })
            }
          </div>
        )}

        <div className="px-5 mt-8 flex flex-col gap-4 pb-8">
          <div className="flex items-center gap-2 px-1">
            <Sparkles size={18} className="text-primary fill-primary/20" />
            <h2 className="text-[#3e4943] text-base font-bold">Saran Quest AI</h2>
          </div>
          
          {aiSuggestedQuests.length > 0 ? (
            <>
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-2xl border-l-4 border-primary mb-2">
                <p className="text-[#3e4943] text-sm font-medium leading-relaxed">
                  "{aiAffirmation}"
                </p>
              </div>
              {aiSuggestedQuests.map((quest) => (
                <StandardQuestCard 
                  key={quest.id}
                  quest={quest}
                  onClick={() => onNavigate('detail', quest.id)}
                />
              ))}
            </>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-3">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-[#3e4943] text-sm font-medium opacity-60">Tidak ada quest tersedia di sekitarmu saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
