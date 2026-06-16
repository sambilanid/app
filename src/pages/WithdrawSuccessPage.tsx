/**
 * Halaman berhasil mengajukan penarikan dana.
 * Digunakan saat: Pengguna telah berhasil mengirimkan permintaan penarikan dana.
 */
import React from 'react';
import { CheckCircle2, Home } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';

interface WithdrawSuccessPageProps {
  amount: string;
  method: string;
  destination: string;
  onHome: () => void;
}

const WithdrawSuccessPage: React.FC<WithdrawSuccessPageProps> = ({ 
  amount, 
  method, 
  destination, 
  onHome
}) => {
  const formattedAmount = new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(parseInt(amount) || 0);

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Status Penarikan" 
          onBack={onHome}
        />
      }
      footer={
        <div className="bg-white border-t border-[#dbe4ed] px-5 py-4 pb-8">
          <Button 
            fullWidth 
            onClick={onHome}
            leftIcon={<Home size={18} />}
          >
            Kembali ke Beranda
          </Button>
        </div>
      }
    >
      <div className="flex flex-col px-5 py-15 items-center text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 size={48} />
        </div>

        {/* Success Message */}
        <h1 className="text-[#141d23] text-2xl font-bold mb-2">Penarikan Diajukan!</h1>
        <p className="text-[#3e4943] text-base mb-8 leading-relaxed">
          Permintaan penarikan dana kamu sedang diproses dan akan masuk dalam maksimal 1x24 jam.
        </p>

        {/* Transaction Summary Card */}
        <div className="w-full bg-[#f6faff] border border-[#dbe4ed] rounded-2xl p-6 flex flex-col gap-4 mb-10 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-[#dbe4ed]">
            <span className="text-[#3e4943] text-sm">Nominal Penarikan</span>
            <span className="text-primary font-bold text-lg">{formattedAmount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#3e4943] text-sm">Metode</span>
            <span className="text-[#141d23] font-bold text-sm capitalize">{method}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#3e4943] text-sm">Tujuan</span>
            <span className="text-[#141d23] font-bold text-sm">{destination}</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WithdrawSuccessPage;
