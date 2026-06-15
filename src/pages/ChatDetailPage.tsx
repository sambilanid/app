/**
 * Halaman detail percakapan (Chat).
 * Digunakan saat: Pengguna berinteraksi dalam satu percakapan spesifik untuk sebuah quest.
 */
import React, { useState, useRef } from "react";
import { Send, Image, MapPin, MoreVertical } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { PageLayout } from "../components/common/PageLayout";
import { useApp } from "../store/AppContext";

interface ChatDetailPageProps {
  chatId?: string;
  onBack: () => void;
}

const ChatDetailPage: React.FC<ChatDetailPageProps> = ({ chatId, onBack }) => {
  const { state, sendMessage } = useApp();
  const [inputText, setInputText] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const quest = state.activeQuests.find((q) => q.id === chatId);

  const messages = [...(quest?.messages || [])].reverse();

  const handleSend = () => {
    if (!inputText.trim() || !chatId) return;
    sendMessage(chatId, inputText);
    setInputText("");
  };

  if (!quest) {
    return (
      <PageLayout header={<PageHeader onBack={onBack} title="Chat" />}>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Percakapan tidak ditemukan.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header={
        <PageHeader
          onBack={onBack}
          title={
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-black leading-tight truncate max-w-[200px]">
                {quest.title}
              </span>
              <span className="text-[12px] text-gray-500 font-medium">
                {quest.creator?.name} • Online
              </span>
            </div>
          }
          rightAction={
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <MoreVertical size={20} className="text-black" />
            </button>
          }
        />
      }
      className="bg-[#F8F9FA]"
      mainClassName="overflow-hidden flex flex-col"
      footer={
        /* Input Area */
        <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
          <div className="flex gap-1">
            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
              <Image size={24} />
            </button>
            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
              <MapPin size={24} />
            </button>
          </div>

          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder="Tulis pesan..."
              className="w-full bg-transparent outline-none text-[15px] py-1"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all ${
              inputText.trim()
                ? "bg-primary text-white scale-100"
                : "bg-gray-200 text-gray-400 scale-90"
            }`}
          >
            <Send size={20} className={inputText.trim() ? "ml-0.5" : ""} />
          </button>
        </div>
      }
    >
      {/* Messages List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col-reverse p-4 space-y-4 space-y-reverse overflow-y-auto"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}
            >
              <div
                className={`px-4 py-2.5 rounded-[18px] text-[15px] leading-[20px] shadow-sm ${
                  msg.sender === "me"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-white text-black rounded-tl-none border border-gray-100"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[11px] text-gray-400 mt-1 px-1">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm italic">
              Belum ada pesan. Mulai percakapan sekarang!
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ChatDetailPage;
