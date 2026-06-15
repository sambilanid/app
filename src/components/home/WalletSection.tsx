/**
 * Bagian informasi saldo dan dompet digital.
 * Digunakan saat: Halaman Home atau Profile.
 */
import React from 'react';
import { Button } from '../common/Button';
import { useApp } from '../../store/AppContext';

export const WalletSection: React.FC<{ 
  onTopUp?: () => void;
  onWithdraw?: () => void;
}> = ({ onTopUp, onWithdraw }) => {
  const { state } = useApp();
  const { user } = state;

  return (
    <div className="px-[20px] mt-4">
      <div className="bg-primary rounded-[16px] p-[20px] text-white flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[12px] opacity-80 font-medium">Saldo Tersedia</p>
          <p className="text-[24px] font-bold">
            {new Intl.NumberFormat('id-ID', { 
              style: 'currency', 
              currency: 'IDR', 
              minimumFractionDigits: 0 
            }).format(user.balance)}
          </p>
        </div>
        
        <div className="flex gap-[12px]">
          <Button 
            variant="secondary" 
            fullWidth 
            size="md"
            onClick={onTopUp}
            className="!bg-white !text-primary"
          >
            Top Up
          </Button>
          <Button 
            variant="secondary" 
            fullWidth 
            size="md"
            onClick={onWithdraw}
            className="!bg-white/20 !text-white !border-none hover:!bg-white/30"
          >
            Tarik
          </Button>
        </div>
      </div>
    </div>
  );
};
