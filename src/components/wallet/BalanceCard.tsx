import React from 'react';

interface BalanceCardProps {
  balance: number;
  className?: string;
}

/**
 * Komponen kartu saldo.
 * Digunakan untuk menampilkan saldo tersedia pengguna dalam format mata uang IDR.
 */
export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, className = '' }) => {
  return (
    <div className={`bg-primary rounded-[16px] p-[20px] text-white flex flex-col gap-[4px] ${className}`}>
      <p className="text-[12px] opacity-80 font-medium">Saldo Tersedia</p>
      <p className="text-[24px] font-bold">
        {new Intl.NumberFormat('id-ID', { 
          style: 'currency', 
          currency: 'IDR', 
          minimumFractionDigits: 0 
        }).format(balance)}
      </p>
    </div>
  );
};
