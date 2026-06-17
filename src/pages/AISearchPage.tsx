/**
 * Halaman AI Search (Demo).
 * Digunakan saat: Pengguna ingin mencari quest menggunakan bahasa alami melalui bantuan AI.
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { PageLayout } from "../components/common/PageLayout";
import { useApp } from "../store/AppContext";
import type { Quest } from "../types";
import { StandardQuestCard } from "../components/quest/StandardQuestCard";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  suggestions?: Quest[];
  time: string;
}

interface AISearchPageProps {
  onBack: () => void;
  onSelectQuest: (questId: string) => void;
}

const EXAMPLE_PROMPTS = [
  "Cari pekerjaan yang santai di sore hari",
  "Quest dengan reward tinggi di atas 50rb",
  "Beli makanan di daerah Sukajadi",
];

const AISearchPage: React.FC<AISearchPageProps> = ({ onBack, onSelectQuest }) => {
  const { state } = useApp();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: 'ai',
      text: "Halo! Saya Sambilan AI. Apa yang bisa saya bantu cari hari ini? Kamu bisa tanya apapun, misalnya: 'Cari pekerjaan yang bisa dikerjakan sambil jalan santai'.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = useCallback((text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponseText: string;
      let suggestions: Quest[];

      const query = text.toLowerCase();

      if (query.includes("santai") || query.includes("sore")) {
        aiResponseText = "Tentu! Berikut adalah beberapa quest santai yang cocok dikerjakan di sore hari:";
        suggestions = state.availableQuests.filter(q => 
          q.title.toLowerCase().includes("beli") || 
          q.description.toLowerCase().includes("santai") ||
          q.category.toLowerCase().includes("shopping")
        ).slice(0, 2);
      } else if (query.includes("reward") || query.includes("tinggi") || query.includes("50")) {
        aiResponseText = "Siap! Ini adalah quest dengan reward tertinggi yang tersedia saat ini:";
        suggestions = [...state.availableQuests]
          .sort((a, b) => {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
            const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
            return priceB - priceA;
          })
          .slice(0, 2);
      } else if (query.includes("makanan") || query.includes("sukajadi") || query.includes("beli")) {
        aiResponseText = "Ada beberapa quest terkait makanan di sekitar Sukajadi/Pasteur:";
        suggestions = state.availableQuests.filter(q => 
          q.category.toLowerCase().includes("food") || 
          q.title.toLowerCase().includes("gacoan") ||
          q.description.toLowerCase().includes("makan")
        ).slice(0, 2);
      } else {
        aiResponseText = "Saya menemukan beberapa quest menarik yang mungkin kamu suka:";
        suggestions = state.availableQuests.slice(0, 2);
      }

      if (suggestions.length === 0) {
        aiResponseText = "Maaf, saya tidak menemukan quest yang spesifik untuk kriteria tersebut. Namun, ini adalah beberapa quest populer saat ini:";
        suggestions = state.availableQuests.slice(0, 2);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        suggestions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  }, [state.availableQuests]);

  return (
    <PageLayout
      header={
        <PageHeader
          onBack={onBack}
          title={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles size={18} className="text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-black leading-tight">
                  Sambilan AI
                </span>
                <span className="text-[12px] text-green-500 font-medium">
                  Online
                </span>
              </div>
            </div>
          }
        />
      }
      className="bg-[#F8F9FA]"
      mainClassName="overflow-hidden flex flex-col"
      footer={
        <div className="bg-white border-t border-gray-100 flex flex-col">
          {/* Example Prompts */}
          {messages.length === 1 && (
            <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-50">
              {EXAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 text-[13px] font-medium text-gray-600 hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 flex items-center">
              <input
                type="text"
                placeholder="Tanyakan sesuatu..."
                className="w-full bg-transparent outline-none text-[15px]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && inputText.trim() && handleSend(inputText)}
              />
            </div>

            <button
              onClick={() => handleSend(inputText)}
              disabled={!inputText.trim() || isTyping}
              className={`w-[48px] h-[48px] rounded-2xl flex items-center justify-center transition-all ${
                inputText.trim() && !isTyping
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-100"
                  : "bg-gray-200 text-gray-400 scale-95"
              }`}
            >
              <Send size={20} className={inputText.trim() ? "ml-0.5" : ""} />
            </button>
          </div>
        </div>
      }
    >
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 space-y-6 overflow-y-auto pb-10"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] flex gap-3 ${msg.sender === 'user' ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.sender === 'user' ? "bg-primary" : "bg-white border border-gray-100"
              }`}>
                {msg.sender === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-primary" />
                )}
              </div>
              
              <div className={`flex flex-col ${msg.sender === 'user' ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-[15px] leading-[22px] ${
                    msg.sender === 'user'
                      ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10"
                      : "bg-white text-black rounded-tl-none border border-gray-100 shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-4 flex flex-col gap-3 w-full min-w-[280px]">
                    {msg.suggestions.map(quest => (
                      <StandardQuestCard 
                        key={quest.id}
                        quest={quest}
                        onClick={() => onSelectQuest(quest.id)}
                      />
                    ))}
                  </div>
                )}
                
                <span className="text-[11px] text-gray-400 mt-1.5 px-1 font-medium">
                  {msg.time}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                <Bot size={16} className="text-primary" />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AISearchPage;
