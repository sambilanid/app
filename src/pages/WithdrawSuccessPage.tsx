/**
 * Halaman berhasil mengajukan penarikan dana.
 * Digunakan saat: Pengguna telah berhasil mengirimkan permintaan penarikan dana.
 */
import React from 'react';
import { CheckCircle2, Home } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
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
    <PageLayout>
      <div className="h-full flex flex-col px-[20px] py-[60px] items-center text-center">
        {/* Success Icon */}
        <div className="w-[80px] h-[80px] bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 size={48} />
        </div>

        {/* Success Message */}
        <h1 className="text-[#141d23] text-[24px] font-bold mb-2">Penarikan Diajukan!</h1>
        <p className="text-[#3e4943] text-[16px] mb-8 leading-relaxed">
          Permintaan penarikan dana kamu sedang diproses dan akan masuk dalam maksimal 1x24 jam.
        </p>

        {/* Transaction Summary Card */}
        <div className="w-full bg-[#f6faff] border border-[#dbe4ed] rounded-[20px] p-[24px] flex flex-col gap-4 mb-10 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-[#dbe4ed]">
            <span className="text-[#3e4943] text-[14px]">Nominal Penarikan</span>
            <span className="text-primary font-bold text-[18px]">{formattedAmount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#3e4943] text-[14px]">Metode</span>
            <span className="text-[#141d23] font-bold text-[14px] capitalize">{method}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#3e4943] text-[14px]">Tujuan</span>
            <span className="text-[#141d23] font-bold text-[14px]">{destination}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mt-auto">
          <Button 
            fullWidth 
            onClick={onHome}
            leftIcon={<Home size={18} />}
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default WithdrawSuccessPage;
