/**
 * Bagian informasi saldo dan dompet digital.
 * Digunakan saat: Halaman Home atau Profile.
 */
import React from 'react';
import { Wallet } from 'lucide-react';
import { Card } from '../common/Card';
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
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[#3e4943] text-[10px] font-bold tracking-[0.8px] uppercase">SALDO</p>
            <p className="text-dark text-[20px] font-bold">Rp {user.balance.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onWithdraw}>
            Tarik
          </Button>
          <Button variant="secondary" size="sm" onClick={onTopUp}>
            Top Up
          </Button>
        </div>
      </Card>
    </div>
  );
};
