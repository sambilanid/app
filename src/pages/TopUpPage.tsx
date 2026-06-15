/**
 * Halaman pengisian saldo (Top Up).
 * Digunakan saat: Pengguna ingin menambah saldo ke dalam wallet aplikasi.
 */
import React, { useState } from 'react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { useApp } from '../store/AppContext';

interface TopUpPageProps {
  onBack: () => void;
}

const TopUpPage: React.FC<TopUpPageProps> = ({ onBack }) => {
  const { addNotification } = useApp();
  const [amount, setAmount] = useState<string>('0');

  const quickAmounts = [
    { label: '10rb', value: '10000' },
    { label: '25rb', value: '25000' },
    { label: '50rb', value: '50000' },
    { label: '100rb', value: '100000' },
    { label: '250rb', value: '250000' },
    { label: '500rb', value: '500000' },
  ];

  const handleQuickSelect = (value: string) => {
    setAmount(value);
  };

  const formatAmount = (val: string) => {
    if (!val || val === '0') return '0';
    return parseInt(val).toLocaleString('id-ID');
  };

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Top Up" 
          onBack={onBack}
        />
      }
      footer={
        <div className="bg-white border-t border-[#dbe4ed] px-[20px] py-[16px] pb-[32px]">
          <Button 
            fullWidth
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              addNotification({
                type: 'payment',
                title: 'Top Up Menunggu Pembayaran',
                message: `Permintaan top up sebesar Rp${formatAmount(amount)} sudah dibuat. Selesaikan pembayaran segera.`
              });
              onBack();
            }}
          >
            Lanjut Bayar
          </Button>
        </div>
      }
    >
      <div className="px-[20px] pt-[32px] pb-[120px] flex flex-col gap-[24px]">
        {/* Title Section */}
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[#141d23] text-[28px] font-extrabold leading-[36px]">Top Up Wallet</h2>
          <p className="text-[#3e4943] text-[16px]">Masukkan nominal top up</p>
        </div>

        {/* Input Section */}
        <div className="relative">
          <div className="bg-white border border-[#bdcac1] rounded-[12px] px-[16px] py-[21px] flex items-center">
            <span className="text-primary text-[24px] font-bold mr-2">Rp</span>
            <div className="flex-1 text-right">
              <span className="text-[#141d23] text-[28px] font-extrabold">
                {formatAmount(amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Select Grid */}
        <div className="grid grid-cols-3 gap-[16px] pt-[8px]">
          {quickAmounts.map((item) => (
            <button
              key={item.value}
              onClick={(e) => {
                e.stopPropagation();
                handleQuickSelect(item.value);
              }}
              className={`py-[13px] border rounded-full text-[14px] font-semibold transition-all
                ${amount === item.value 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-[#141d23] border-[#bdcac1] hover:border-primary/50'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default TopUpPage;
