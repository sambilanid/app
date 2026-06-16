/**
 * Halaman pengisian saldo (Top Up).
 * Digunakan saat: Pengguna ingin menambah saldo ke dalam wallet aplikasi.
 */
import React, { useState } from 'react';
import { 
  Building2, 
  Smartphone, 
  ChevronRight, 
  CreditCard
} from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { useApp } from '../store/AppContext';

interface TopUpPageProps {
  onBack: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'bank' | 'wallet' | 'retail';
}

const paymentMethods: PaymentMethod[] = [
  { id: 'bca', name: 'BCA Virtual Account', icon: <Building2 size={20} />, category: 'bank' },
  { id: 'mandiri', name: 'Mandiri Virtual Account', icon: <Building2 size={20} />, category: 'bank' },
  { id: 'gopay', name: 'GoPay', icon: <Smartphone size={20} />, category: 'wallet' },
  { id: 'ovo', name: 'OVO', icon: <Smartphone size={20} />, category: 'wallet' },
  { id: 'dana', name: 'Dana', icon: <Smartphone size={20} />, category: 'wallet' },
  { id: 'alfamart', name: 'Alfamart', icon: <CreditCard size={20} />, category: 'retail' },
];

const TopUpPage: React.FC<TopUpPageProps> = ({ onBack }) => {
  const { addNotification } = useApp();
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  const handleSelectMethod = (id: string) => {
    setSelectedMethodId(id);
  };

  const handleConfirmPayment = () => {
    const method = paymentMethods.find(m => m.id === selectedMethodId);
    addNotification({
      type: 'payment',
      title: 'Top Up Menunggu Pembayaran',
      message: `Instruksi pembayaran via ${method?.name} telah dikirim ke email kamu. Selesaikan pembayaran segera.`
    });
    onBack();
  };

  if (selectedMethodId) {
    const method = paymentMethods.find(m => m.id === selectedMethodId);
    return (
      <PageLayout
        header={
          <PageHeader 
            title={method?.name} 
            onBack={() => setSelectedMethodId(null)}
          />
        }
        footer={
          <div className="bg-white border-t border-[#dbe4ed] px-[20px] py-[16px] pb-[32px]">
            <Button 
              fullWidth
              size="lg"
              onClick={handleConfirmPayment}
            >
              Konfirmasi Pembayaran
            </Button>
          </div>
        }
      >
        <div className="px-[20px] pt-[24px] pb-[40px] flex flex-col gap-[24px]">
          <div className="bg-[#ecf5fe] border border-primary/20 rounded-[16px] p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              {method?.icon}
            </div>
            <h3 className="text-[#141d23] text-[18px] font-bold mb-1">Instruksi Pembayaran</h3>
            <p className="text-[#3e4943] text-[14px]">Gunakan detail di bawah untuk menyelesaikan Top Up kamu.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white border border-[#dbe4ed] rounded-[16px] p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[#3e4943] text-[12px] font-bold uppercase tracking-wider">Nomor Virtual Account</p>
                <div className="flex items-center justify-between">
                  <p className="text-[#141d23] text-[20px] font-extrabold tracking-widest">1234567890123</p>
                  <button className="text-primary text-[14px] font-bold hover:underline">Salin</button>
                </div>
              </div>
              <div className="h-px bg-[#dbe4ed] w-full" />
              <div className="flex flex-col gap-1">
                <p className="text-[#3e4943] text-[12px] font-bold uppercase tracking-wider">Total Pembayaran</p>
                <p className="text-primary text-[20px] font-extrabold">Rp 50.000</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#141d23] text-[16px] font-bold px-1">Cara Pembayaran</h4>
              <div className="flex flex-col gap-2">
                {[
                  "Buka aplikasi mobile banking atau ATM kamu.",
                  "Pilih menu Transfer atau Pembayaran.",
                  "Masukkan nomor Virtual Account di atas.",
                  "Pastikan nominal sesuai dengan tagihan.",
                  "Simpan bukti transaksi setelah selesai."
                ].map((step, i) => (
                  <div key={i} className="flex gap-3 items-start bg-white p-3 rounded-[12px] border border-[#dbe4ed]/50">
                    <span className="w-6 h-6 bg-[#e6eff8] rounded-full flex items-center justify-center text-primary text-[12px] font-bold shrink-0">{i+1}</span>
                    <p className="text-[#3e4943] text-[14px] leading-tight">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Top Up Saldo" 
          onBack={onBack}
        />
      }
    >
      <div className="px-[20px] pt-[24px] pb-[40px] flex flex-col gap-[32px]">
        {/* Payment Method Section */}
        <div className="flex flex-col gap-[16px]">
          <h2 className="text-[#141d23] text-[18px] font-bold">Pilih Metode Pembayaran</h2>
          
          <div className="flex flex-col gap-[12px]">
            {/* Bank Transfer Category */}
            <div className="flex flex-col gap-[8px]">
              <p className="text-[#3e4943] text-[12px] font-bold tracking-[0.6px] uppercase px-1">Transfer Bank / VA</p>
              {paymentMethods.filter(m => m.category === 'bank').map((method) => (
                <button 
                  key={method.id}
                  onClick={() => handleSelectMethod(method.id)}
                  className="p-4 flex items-center justify-between transition-all rounded-[16px] border-2 border-[#dbe4ed] bg-white active:bg-primary/5 active:border-primary group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e6eff8] text-primary group-active:bg-primary group-active:text-white transition-colors">
                      {method.icon}
                    </div>
                    <span className="text-[#141d23] font-bold text-[15px]">{method.name}</span>
                  </div>
                  <ChevronRight size={20} className="text-[#bdcac1]" />
                </button>
              ))}
            </div>

            {/* E-Wallet Category */}
            <div className="flex flex-col gap-[8px] mt-2">
              <p className="text-[#3e4943] text-[12px] font-bold tracking-[0.6px] uppercase px-1">E-Wallet</p>
              {paymentMethods.filter(m => m.category === 'wallet').map((method) => (
                <button 
                  key={method.id}
                  onClick={() => handleSelectMethod(method.id)}
                  className="p-4 flex items-center justify-between transition-all rounded-[16px] border-2 border-[#dbe4ed] bg-white active:bg-primary/5 active:border-primary group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e6eff8] text-primary group-active:bg-primary group-active:text-white transition-colors">
                      {method.icon}
                    </div>
                    <span className="text-[#141d23] font-bold text-[15px]">{method.name}</span>
                  </div>
                  <ChevronRight size={20} className="text-[#bdcac1]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TopUpPage;
