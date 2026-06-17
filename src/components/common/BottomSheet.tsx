/**
 * Komponen dasar untuk Bottom Sheet yang dapat digunakan kembali.
 * Digunakan saat: Menampilkan konten yang meluncur dari bawah layar, umum pada antarmuka mobile.
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  // Mengunci scroll body saat bottom sheet terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          
          {/* Sheet Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative bg-white w-full max-w-screen-md rounded-t-[32px] shadow-2xl z-10 overflow-hidden flex flex-col"
          >
            {/* Handle/Indicator */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <div className="px-6 pb-8 pt-2">
              {(title || showCloseButton) && (
                <div className="flex justify-between items-center mb-6">
                  {title ? (
                    <h2 className="text-xl font-bold text-dark">{title}</h2>
                  ) : (
                    <div />
                  )}
                  {showCloseButton && (
                    <button 
                      onClick={onClose} 
                      className="p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              )}
              
              <div className="flex flex-col gap-1">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
