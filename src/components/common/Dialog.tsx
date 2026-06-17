/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface DialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);

  const showDialog = (options: DialogOptions) => setDialog(options);
  const hideDialog = () => setDialog(null);

  const handleConfirm = () => {
    dialog?.onConfirm?.();
    hideDialog();
  };

  const handleCancel = () => {
    dialog?.onCancel?.();
    hideDialog();
  };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      <AnimatePresence>
        {dialog && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2 text-center">
                <h3 className="text-[#141d23] text-[20px] font-bold">{dialog.title}</h3>
                <p className="text-[#3e4943] text-[16px] leading-[24px] opacity-70">{dialog.message}</p>
              </div>
              
              <div className="flex gap-3 mt-2">
                {dialog.cancelLabel && (
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    {dialog.cancelLabel}
                  </Button>
                )}
                <Button 
                  size="lg"
                  variant={dialog.variant === 'danger' ? 'danger' : 'primary'}
                  onClick={handleConfirm}
                  className="flex-1"
                >
                  {dialog.confirmLabel || 'OK'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
