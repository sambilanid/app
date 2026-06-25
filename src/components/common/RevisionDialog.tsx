/**
 * Dialog untuk meminta revisi tugas (RevisionDialog).
 * Deskripsi: Digunakan ketika Quest Creator meninjau bukti kerja (Proof of Work) yang dikirimkan,
 * namun merasa ada bagian yang belum selesai atau tidak sesuai spesifikasi, sehingga meminta
 * Adventurer untuk merevisinya.
 * Kondisi penggunaan: Ditampilkan di halaman pengelolaan quest (ManageQuestPage) saat status quest pending.
 */
import React, { useState } from 'react';
import { X, ClipboardEdit } from 'lucide-react';
import { Button } from './Button';

interface RevisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => void;
  questTitle: string;
}

export const RevisionDialog: React.FC<RevisionDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  questTitle
}) => {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!notes.trim()) return;
    onSubmit(notes);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="p-6 flex flex-col items-center gap-5">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-2 text-center mt-4">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-1">
              <ClipboardEdit size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#141d23]">Minta Revisi Kerja</h2>
            <p className="text-[#3e4943] text-sm leading-relaxed px-4">
              Berikan petunjuk kepada Adventurer tentang bagian mana yang perlu diperbaiki untuk quest <span className="font-bold">"{questTitle}"</span>.
            </p>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="text-xs font-bold text-[#3e4943] uppercase tracking-wider ml-1">Instruksi Revisi <span className="text-red-500">*</span></label>
            <textarea
              placeholder="Contoh: Saus seblak kurang lengkap, tolong beli seblak dengan level pedas 4 sesuai deskripsi awal."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              required
              className="w-full bg-[#f6fafe] border border-[#dbe4ed] rounded-2xl p-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-gray-400"
            />
          </div>

          <Button 
            fullWidth 
            size="lg" 
            onClick={handleSubmit}
            disabled={!notes.trim()}
            className="rounded-2xl !font-bold flex items-center justify-center gap-2"
          >
            Kirim Permintaan Revisi
          </Button>
        </div>
      </div>
    </div>
  );
};
