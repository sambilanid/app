/**
 * Halaman penarikan dana (Withdraw).
 * Digunakan saat: Pengguna ingin mencairkan saldo dari wallet ke rekening bank atau e-wallet.
 */
import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Check, 
  ShieldCheck,
  Building2,
  User
} from 'lucide-react';

import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';

interface WithdrawPageProps {
  onBack: () => void;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({ onBack }) => {
  const [method, setMethod] = useState<'bank' | 'wallet'>('bank');
  const [selectedBank, setSelectedBank] = useState<string>('BCA');

  const banks = ['BCA', 'Mandiri', 'BRI', 'BNI'];

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Tarik Dana" 
          onBack={onBack}
        />
      }
      footer={
        <div className="bg-white border-t border-[#dbe4ed] px-[20px] py-[16px] pb-[32px]">
          <button className="w-full bg-primary text-white py-[16px] rounded-[12px] font-bold text-[16px] active:scale-[0.98] transition-all">
            Ajukan Penarikan
          </button>
        </div>
      }
    >
      <div className="px-[20px] pt-[24px] pb-[40px] flex flex-col gap-[24px]">
        {/* Title Section */}
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[#141d23] text-[20px] font-bold">Tujuan Pencairan</h2>
        </div>

        {/* Withdrawal Method Card */}
        <div className="bg-white border border-[#dbe4ed] rounded-[16px] p-[20px] flex flex-col gap-[24px]">
          {/* Method Tabs */}
          <div className="flex flex-col gap-[12px]">
            <p className="text-[#3e4943] text-[14px] font-semibold tracking-[0.14px]">Tambah Tujuan Pencairan</p>
            <div className="flex gap-[12px] justify-between">
              <button 
                onClick={() => setMethod('bank')}
                className={`flex-1 flex items-center justify-center gap-2 py-[12px] rounded-[12px] text-[14px] font-bold transition-all ${
                  method === 'bank' 
                    ? 'bg-primary text-white' 
                    : 'bg-[#f6faff] text-[#5c5f60] border border-[#dbe4ed]'
                }`}
              >
                <Building2 size={18} /> Bank
              </button>
              <button 
                onClick={() => setMethod('wallet')}
                className={`flex-1 flex items-center justify-center gap-2 py-[12px] rounded-[12px] text-[14px] font-bold transition-all ${
                  method === 'wallet' 
                    ? 'bg-primary text-white' 
                    : 'bg-[#f6faff] text-[#5c5f60] border border-[#dbe4ed]'
                }`}
              >
                <Smartphone size={18} /> E-Wallet
              </button>
            </div>
          </div>

          {/* Bank Selection (only if method is bank) */}
          {method === 'bank' && (
            <div className="flex flex-col gap-[12px]">
              <p className="text-[#3e4943] text-[14px] font-semibold tracking-[0.14px]">Pilih Bank</p>
              <div className="flex flex-wrap gap-[10px]">
                {banks.map((bank) => (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`px-[20px] py-[8px] rounded-full text-[14px] font-bold transition-all ${
                      selectedBank === bank 
                        ? 'bg-primary/10 text-primary border-2 border-primary' 
                        : 'bg-[#f6faff] text-[#5c5f60] border border-[#dbe4ed]'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Inputs */}
          <div className="flex flex-col gap-[20px] pt-2">
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#3e4943] text-[12px] font-bold tracking-[0.6px] uppercase">
                {method === 'bank' ? 'NOMOR REKENING' : 'NOMOR E-WALLET'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                  {method === 'bank' ? <CreditCard size={20} /> : <Smartphone size={20} />}
                </div>
                <input 
                  type="text" 
                  placeholder={method === 'bank' ? '1234567890' : '0812XXXXXXX'}
                  className="w-full bg-[#f6faff] border border-[#bdcac1] rounded-[12px] p-4 pl-12 text-[15px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-[#3e4943] text-[12px] font-bold tracking-[0.6px] uppercase">NAMA PEMILIK REKENING</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                  <User size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Sesuai buku tabungan"
                  className="w-full bg-[#f6faff] border border-[#bdcac1] rounded-[12px] p-4 pl-12 text-[15px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <button className="w-full bg-primary text-white py-[14px] rounded-[12px] font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
            <ShieldCheck size={18} /> Simpan Tujuan
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-[#ecf5fe] border border-[#dbe4ed] p-4 rounded-[12px] flex gap-3">
          <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0 mt-0.5">
            <Check size={12} strokeWidth={4} />
          </div>
          <p className="text-[#3e4943] text-[13px] leading-relaxed">
            Dana akan diproses maksimal 1x24 jam hari kerja. Pastikan nomor rekening dan nama sudah sesuai untuk menghindari kegagalan transaksi.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default WithdrawPage;
