/**
 * Komponen Router Aplikasi (AppRouter).
 * Digunakan saat: Merender komponen halaman yang sesuai berdasarkan tumpukan navigasi saat ini (StackItem).
 */
import React from "react";
import type { StackItem, Page } from "../../hooks/useNavigationStack";
import { useApp } from "../../store/AppContext";

import HomePage from "../../pages/HomePage";
import SearchPage from "../../pages/SearchPage";
import QuestDetailPage from "../../pages/QuestDetailPage";
import TopUpPage from "../../pages/TopUpPage";
import ProfilePage from "../../pages/ProfilePage";
import ActivityPage from "../../pages/ActivityPage";
import CreateQuestPage from "../../pages/CreateQuestPage";
import ManageQuestPage from "../../pages/ManageQuestPage";
import NotificationsPage from "../../pages/NotificationsPage";
import ChatListPage from "../../pages/ChatListPage";
import ChatDetailPage from "../../pages/ChatDetailPage";
import QuestEvidencePage from "../../pages/QuestEvidencePage";
import QuestEvidenceSuccessPage from "../../pages/QuestEvidenceSuccessPage";
import CreateQuestSuccessPage from "../../pages/CreateQuestSuccessPage";
import TopUpSuccessPage from "../../pages/TopUpSuccessPage";
import EditProfilePage from "../../pages/EditProfilePage";
import OtherProfilePage from "../../pages/OtherProfilePage";
import VerificationPage from "../../pages/VerificationPage";
import WithdrawPage from "../../pages/WithdrawPage";
import WithdrawSuccessPage from "../../pages/WithdrawSuccessPage";
import AISearchPage from "../../pages/AISearchPage";

interface AppRouterProps {
  item: StackItem;
  push: (page: Page, params?: StackItem["params"]) => void;
  pop: () => void;
  replace: (page: Page, params?: StackItem["params"]) => void;
  hasMoreThanOnePage: boolean;
}

export const AppRouter: React.FC<AppRouterProps> = ({
  item,
  push,
  pop,
  replace,
  hasMoreThanOnePage,
}) => {
  const { state, findOrCreateChat } = useApp();
  const { page, params } = item;

  const handleBack = hasMoreThanOnePage ? pop : undefined;

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
