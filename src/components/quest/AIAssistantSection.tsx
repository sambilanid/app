/**
 * Bagian interaksi dengan asisten AI untuk membantu pencarian atau saran quest.
 * Digunakan saat: Halaman pencarian atau home.
 */
import React from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Card } from '../common/Card';

export const AIAssistantSection: React.FC<{ onSearch?: () => void }> = ({ onSearch }) => {
  return (
    <div className="px-[20px] mt-6">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={22} className="text-primary" />
          <h2 className="text-dark text-[16px]">Asisten AI</h2>
        </div>
        
        <div className="bg-[rgba(0,105,75,0.05)] border border-[rgba(0,105,75,0.1)] p-3 rounded-[8px] mb-4">
          <p className="text-[#3e4943] text-[16px] italic leading-[24px]">
            “Saya punya waktu 2 jam siang ini, bawa motor, ada quest apa?”
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 bg-[#ecf5fe] rounded-[12px] px-4 py-3">
            <input 
              type="text" 
              placeholder="Ceritakan kondisimu..." 
              className="w-full bg-transparent outline-none text-[16px] text-gray-text"
            />
          </div>
          <button 
            onClick={onSearch}
            className="bg-primary p-3 rounded-[12px] text-white active:scale-95 transition-transform"
          >
            <Send size={22} />
          </button>
        </div>
      </Card>
    </div>
  );
};
