/**
 * Halaman utama aplikasi.
 * Digunakan saat: Landing page setelah login yang berisi ringkasan aktivitas dan rekomendasi.
 */
import React, { useMemo } from "react";
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
import type { Quest } from "../types";

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

// Define character mapping for AI Suggestions
const CHARACTER_MAP = [
  {
    keywords: ['tech savvy', 'tekno', 'gadget', 'komputer', 'laptop', 'teknik'],
    category: 'Jasa reparasi',
    affirmation: 'Buat kamu yang tech savvy, ini quest-quest yang mungkin kamu suka:'
  },
  {
    keywords: ['pecinta kuliner', 'makan-makan', 'foodie', 'kuliner', 'makan'],
    category: 'Jasa titip',
    affirmation: 'Buat kamu yang pecinta kuliner, ini quest-quest yang mungkin kamu suka:'
  },
  {
    keywords: ['sat set', 'gercep', 'logistik', 'pengantaran', 'cepat', 'kurir'],
    category: 'Jasa antar ambil barang',
    affirmation: 'Buat kamu yang sat set, ini quest-quest yang mungkin kamu suka:'
  },
  {
    keywords: ['tukang bersih', 'rapi', 'resik', 'bersih-bersih', 'kebersihan'],
    category: 'Jasa bersih-bersih',
    affirmation: 'Buat kamu yang tukang bersih, ini quest-quest yang mungkin kamu suka:'
  },
  {
    keywords: ['tenaga kuat', 'pindahan', 'angkat-angkat', 'angkut', 'pindah'],
    category: 'Jasa pindahan',
    affirmation: 'Buat kamu yang punya tenaga kuat, ini quest-quest yang mungkin kamu suka:'
  }
];

interface ScoredQuest extends Quest {
  aiScore: number;
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

  // AI Matching Logic
  const aiSuggestedQuests = useMemo(() => {
    if (!user || !user.bio) return availableQuests;

    const bio = user.bio.toLowerCase();
    
    // Check for special character keyword
    const characterMatch = CHARACTER_MAP.find(char => 
      char.keywords.some(keyword => bio.includes(keyword.toLowerCase()))
    );

    // Hard filter by character category if match found
    let filteredQuests = availableQuests;
    if (characterMatch) {
      filteredQuests = availableQuests.filter(quest => quest.category === characterMatch.category);
    }

    // Scoring system
    const scoredQuests: ScoredQuest[] = filteredQuests.map(quest => {
      let score = 0;
      const title = quest.title.toLowerCase();
      const desc = quest.description.toLowerCase();
      const cat = quest.category.toLowerCase();

      // Keywords matching (secondary sorting within hard-filtered results or fallback)
      if (bio.includes('kuliner') || bio.includes('makan')) {
        if (cat.includes('titip') || title.includes('mie') || title.includes('makan') || desc.includes('makan')) score += 10;
      }
      if (bio.includes('teknik') || bio.includes('gadget') || bio.includes('ngulik')) {
        if (cat.includes('reparasi') || title.includes('laptop') || title.includes('hp') || desc.includes('laptop') || desc.includes('komputer')) score += 10;
      }
      if (bio.includes('bersih') || bio.includes('rapi')) {
        if (cat.includes('bersih') || title.includes('cuci') || desc.includes('bersih') || desc.includes('rapi')) score += 10;
      }
      if (bio.includes('bantu') || bio.includes('senang membantu')) {
        score += 2;
      }

      // Distance factor (smaller is better)
      const distMatch = quest.distance.match(/(\d+(\.\d+)?)/);
      if (distMatch) {
        const dist = parseFloat(distMatch[0]);
        score += Math.max(0, 5 - dist); // Add up to 5 points for close quests
      }

      return { ...quest, aiScore: score };
    });

    return scoredQuests.sort((a, b) => b.aiScore - a.aiScore);
  }, [availableQuests, user]);

  const aiAffirmation = useMemo(() => {
    if (!user || !user.bio) return "Ini beberapa quest yang mungkin kamu suka:";
    
    const bio = user.bio.toLowerCase();
    const name = user.name.split(" ")[0];

    // Check for special character keyword
    const characterMatch = CHARACTER_MAP.find(char => 
      char.keywords.some(keyword => bio.includes(keyword.toLowerCase()))
    );

    if (characterMatch) {
      return characterMatch.affirmation;
    }

    if (bio.includes('kuliner') || bio.includes('makan')) {
      return `Hai ${name}, sebagai pecinta kuliner, kamu pasti suka membantu orang mendapatkan makanan favorit mereka!`;
    }
    if (bio.includes('teknik') || bio.includes('gadget') || bio.includes('elektronik')) {
      return `Halo ${name}! Skill teknismu sangat dibutuhkan di sini. Cek quest yang menantang keahlianmu:`;
    }
    if (bio.includes('bersih') || bio.includes('rapi') || bio.includes('administratif')) {
      return `Spesial buat kamu yang teliti, ${name}. Bantu mereka yang butuh kerapihan dan keteraturan:`;
    }
    if (bio.includes('logistik') || bio.includes('pengantaran')) {
      return `Ayo ${name}, tunjukkan kecepatanmu! Quest ini pas banget buat kamu yang jago urusan antar-jemput barang:`;
    }
    if (bio.includes('serba bisa') || bio.includes('bantuan umum')) {
      return `Halo ${name}, sebagai orang yang serba bisa, bantuanmu akan sangat berarti di berbagai tugas unik ini:`;
    }
    
    return `Berdasarkan karakter unikmu ${name}, AI kami menyarankan quest-quest berikut ini:`;
  }, [user]);

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
