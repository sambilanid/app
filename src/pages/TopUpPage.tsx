/**
 * Halaman pengisian saldo (Top Up).
 * Digunakan saat: Pengguna ingin menambah saldo ke dalam wallet aplikasi.
 */
import React, { useState } from 'react';
import { 
  Building2, 
  ChevronRight
} from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { AmountInputCard } from '../components/wallet/AmountInputCard';
import { useApp } from '../store/AppContext';

interface TopUpPageProps {
  onBack: () => void;
  onSuccess: (amount: string) => void;
}

interface TopUpSource {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'bank';
}

const topUpSources: TopUpSource[] = [
  { id: 'bri', name: 'BRI', icon: <Building2 size={20} />, category: 'bank' },
  { id: 'bca', name: 'BCA', icon: <Building2 size={20} />, category: 'bank' },
  { id: 'mandiri', name: 'Mandiri', icon: <Building2 size={20} />, category: 'bank' },
  { id: 'bni', name: 'BNI', icon: <Building2 size={20} />, category: 'bank' },
];

const TopUpPage: React.FC<TopUpPageProps> = ({ onBack, onSuccess }) => {
  const { state, topUp, addNotification } = useApp();
  const user = state.user!;
  const [amount, setAmount] = useState<string>('50000');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedMethodType, setSelectedMethodType] = useState<'va' | 'manual' | null>(null);

  const handleSelectSource = (id: string) => {
    setSelectedSourceId(id);
  };

  const handleSelectMethodType = (type: 'va' | 'manual') => {
    setSelectedMethodType(type);
  };

  const handleConfirmPayment = () => {
    const source = topUpSources.find(s => s.id === selectedSourceId);
    const methodLabel = selectedMethodType === 'va' ? 'Virtual Account' : 'Transfer Manual';
    const numAmount = Number(amount);
    const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(numAmount);
    
    // Simulasikan penambahan saldo
    topUp(numAmount);

    addNotification({
      type: 'payment',
      title: 'Top Up Berhasil',
      message: `Saldo sebesar ${formattedAmount} via ${source?.name} (${methodLabel}) telah ditambahkan ke dompet kamu.`
    });
    
    onSuccess(amount);
  };

  if (selectedSourceId && selectedMethodType) {
    const source = topUpSources.find(s => s.id === selectedSourceId);
    const methodLabel = selectedMethodType === 'va' ? 'Virtual Account' : 'Transfer Manual';
    return (
      <PageLayout
        header={
          <PageHeader 
            title={source?.name} 
            subtitle={methodLabel}
            onBack={() => setSelectedMethodType(null)}
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
              {source?.icon}
            </div>
            <h3 className="text-[#141d23] text-[18px] font-bold mb-1">Instruksi Pembayaran</h3>
            <p className="text-[#3e4943] text-[14px]">Gunakan detail di bawah untuk menyelesaikan Top Up kamu via {source?.name} ({methodLabel}).</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white border border-[#dbe4ed] rounded-[16px] p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[#3e4943] text-[12px] font-bold uppercase tracking-wider">
                  {selectedMethodType === 'va' ? 'Nomor Virtual Account' : 'Nomor Rekening'}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[#141d23] text-[20px] font-extrabold tracking-widest">
                    {selectedMethodType === 'va' ? '1234567890123' : '9876543210'}
                  </p>
                  <button className="text-primary text-[14px] font-bold hover:underline">Salin</button>
                </div>
              </div>
              <div className="h-px bg-[#dbe4ed] w-full" />
              <div className="flex flex-col gap-1">
                <p className="text-[#3e4943] text-[12px] font-bold uppercase tracking-wider">Total Pembayaran</p>
                <p className="text-primary text-[20px] font-extrabold">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amount))}
                </p>
              </div>
            </div>
            {/* Rest of the cara pembayaran... */}

            <div className="flex flex-col gap-3">
              <h4 className="text-[#141d23] text-[16px] font-bold px-1">Cara Pembayaran</h4>
              <div className="flex flex-col gap-2">
                {[
                  `Buka aplikasi mobile banking atau ATM ${source?.name}.`,
                  selectedMethodType === 'va' ? "Pilih menu Transfer atau Pembayaran Virtual Account." : "Pilih menu Transfer ke Bank yang sama.",
                  `Masukkan nomor ${selectedMethodType === 'va' ? 'Virtual Account' : 'Rekening'} di atas.`,
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

  if (selectedSourceId) {
    const source = topUpSources.find(s => s.id === selectedSourceId);
    return (
      <PageLayout
        header={
          <PageHeader 
            title={`Metode ${source?.name}`} 
            onBack={() => setSelectedSourceId(null)}
          />
        }
      >
        <div className="px-[20px] pt-[24px] flex flex-col gap-[16px]">
          <h2 className="text-[#141d23] text-[18px] font-bold">Pilih Metode Pembayaran</h2>
          <div className="flex flex-col gap-[12px]">
            <button 
              onClick={() => handleSelectMethodType('va')}
              className="p-4 flex items-center justify-between transition-all rounded-[16px] border-2 border-[#dbe4ed] bg-white active:bg-primary/5 active:border-primary group"
            >
              <div className="flex flex-col text-left">
                <span className="text-[#141d23] font-bold text-[15px]">Virtual Account</span>
                <span className="text-[#3e4943] text-[12px] opacity-70">Proses otomatis, verifikasi instan.</span>
              </div>
              <ChevronRight size={20} className="text-[#bdcac1]" />
            </button>
            <button 
              onClick={() => handleSelectMethodType('manual')}
              className="p-4 flex items-center justify-between transition-all rounded-[16px] border-2 border-[#dbe4ed] bg-white active:bg-primary/5 active:border-primary group"
            >
              <div className="flex flex-col text-left">
                <span className="text-[#141d23] font-bold text-[15px]">Transfer Manual</span>
                <span className="text-[#3e4943] text-[12px] opacity-70">Verifikasi manual, butuh waktu 5-10 menit.</span>
              </div>
              <ChevronRight size={20} className="text-[#bdcac1]" />
            </button>
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
        {/* Balance Section */}
        <BalanceCard balance={user.balance} />

        {/* Amount Input Section */}
        <div className="flex flex-col gap-[12px]">
          <AmountInputCard 
            amount={amount} 
            onAmountChange={setAmount} 
            label="NOMINAL TOP UP"
            quickAmounts={[20000, 50000, 100000, 250000, 500000]}
          />
        </div>


        {/* Payment Method Section */}
        <div className={`flex flex-col gap-[12px] transition-opacity ${!amount || Number(amount) < 10000 ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="flex flex-col px-1">
            <h2 className="text-[#141d23] text-[20px] font-bold">Pilih Sumber Dana</h2>
            {(!amount || Number(amount) < 10000) && (
              <p className="text-red-500 text-[12px] font-medium">Minimal top up Rp 10.000</p>
            )}
          </div>
          
          <div className="bg-white border border-[#dbe4ed] rounded-[16px] p-[20px] flex flex-col gap-[16px]">
            {/* Bank Transfer Category */}
            <div className="flex flex-col gap-[10px]">
              <p className="text-[#3e4943] text-[12px] font-bold tracking-[0.6px] uppercase px-1">Bank</p>
              <div className="flex flex-col gap-[8px]">
                {topUpSources.filter(m => m.category === 'bank').map((source) => (
                  <button 
                    key={source.id}
                    onClick={() => handleSelectSource(source.id)}
                    disabled={!amount || Number(amount) < 10000}
                    className="p-4 flex items-center justify-between transition-all rounded-[12px] border border-[#dbe4ed] bg-[#f6faff] active:bg-primary/5 active:border-primary group disabled:grayscale"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-primary group-active:bg-primary group-active:text-white transition-colors border border-[#dbe4ed]">
                        {source.icon}
                      </div>
                      <span className="text-[#141d23] font-bold text-[15px]">{source.name}</span>
                    </div>
                    <ChevronRight size={18} className="text-[#bdcac1]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TopUpPage;
