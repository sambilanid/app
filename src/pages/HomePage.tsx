/**
 * Halaman utama aplikasi.
 * Digunakan saat: Landing page setelah login yang berisi ringkasan aktivitas dan rekomendasi.
 */
import React from "react";
import { Bell, MessageSquare, Clock, Search } from "lucide-react";
import { Avatar } from "../components/common/Avatar";
import { PageHeader } from "../components/common/PageHeader";
import { WalletSection } from "../components/home/WalletSection";
import { ActiveQuestCard } from "../components/home/ActiveQuestCard";
import { CompactQuestCard } from "../components/home/CompactQuestCard";
import { PageLayout } from "../components/common/PageLayout";
import { useApp } from "../store/AppContext";

interface HomePageProps {
  onTopUp?: () => void;
  onWithdraw?: () => void;
  onNavigate: (
    page: "home" | "search" | "activity" | "profile" | "detail",
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
  const { availableQuests, activeQuests, user, notifications } = state;
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <PageLayout
      hasNavbar
      header={
        <PageHeader
          title={`Selamat Pagi, ${user.name.split(" ")[0]}!`}
          subtitle="Apa yang kamu butuhin hari ini?"
          rightAction={
            <div className="flex items-center gap-[4px]">
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
                  src={user.avatar}
                  initials={user.initials}
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

        <div className="px-[20px] mt-6 flex flex-col gap-4">
          <h2 className="text-[#3e4943] text-[16px] px-1 font-bold">Quest aktif</h2>
          {activeQuests.length > 0 ? (
            activeQuests.map((quest) => (
              <ActiveQuestCard 
                key={quest.id}
                quest={quest}
                onChat={() => onChat(quest.id)} 
                onFinish={() => onFinish(quest.id)} 
                onClick={() => onNavigate('detail', quest.id)}
              />
            ))
          ) : (
            <div className="bg-white border border-gray-100 rounded-[16px] p-8 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-3">
                <Clock size={24} className="text-gray-300" />
              </div>
              <p className="text-[#3e4943] text-[14px] font-medium opacity-60">Belum ada quest aktif yang sedang dikerjakan.</p>
            </div>
          )}
        </div>

        <div className="px-[20px] mt-8 flex flex-col gap-4 pb-8">
          <h2 className="text-[#3e4943] text-[16px] px-1 font-bold">Quest di sekitarmu</h2>
          {availableQuests.length > 0 ? (
            availableQuests.map((quest) => (
              <CompactQuestCard 
                key={quest.id}
                category={quest.category}
                title={quest.title}
                price={quest.price}
                distance={quest.distance}
                image={quest.image}
                onClick={() => onNavigate('detail', quest.id)}
              />
            ))
          ) : (
            <div className="bg-white border border-gray-100 rounded-[16px] p-8 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-3">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-[#3e4943] text-[14px] font-medium opacity-60">Tidak ada quest tersedia di sekitarmu saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
