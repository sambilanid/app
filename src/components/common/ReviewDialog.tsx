/**
 * Dialog untuk memberikan ulasan (rating & komentar).
 * Digunakan saat: Quest telah selesai dan pengguna (Creator atau Adventurer) ingin mengulas pihak lain.
 */
import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import { Button } from './Button';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  revieweeName: string;
  role: 'adventurer' | 'creator'; // Peran dari yang diulas
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  revieweeName,
  role
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="p-6 flex flex-col items-center gap-6">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-2 text-center mt-4">
            <h2 className="text-xl font-bold text-[#141d23]">Beri Ulasan</h2>
            <p className="text-[#3e4943] text-sm leading-relaxed px-4">
              Bagaimana pengalamanmu berinteraksi dengan <span className="font-bold">{revieweeName}</span> sebagai {role}?
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  size={36} 
                  fill={(hoveredRating || rating) >= star ? "#ffc107" : "transparent"} 
                  className={(hoveredRating || rating) >= star ? "text-[#ffc107]" : "text-gray-300"} 
                />
              </button>
            ))}
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="text-xs font-bold text-[#3e4943] uppercase tracking-wider ml-1">Komentar (Opsional)</label>
            <textarea
              placeholder="Ceritakan pengalamanmu..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full bg-[#f6fafe] border border-[#dbe4ed] rounded-2xl p-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <Button 
            fullWidth 
            size="lg" 
            onClick={handleSubmit}
            disabled={rating === 0}
            className="rounded-2xl !font-bold flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Kirim Ulasan
          </Button>
        </div>
      </div>
    </div>
  );
};
