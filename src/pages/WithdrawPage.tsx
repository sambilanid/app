/**
 * Halaman penarikan dana (Withdraw).
 * Digunakan saat: Pengguna ingin mencairkan saldo dari wallet ke rekening bank atau e-wallet.
 */
import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  AlertCircle, 
  ShieldCheck,
  Building2,
  Bookmark,
  ChevronRight,
  Trash2
} from 'lucide-react';

import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { useApp } from '../store/AppContext';
import type { WithdrawalPreset } from '../types';

interface WithdrawPageProps {
  onBack: () => void;
  onSuccess: (data: { amount: string; method: string; destination: string }) => void;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({ onBack, onSuccess }) => {
  const { state, withdraw, addWithdrawalPreset, removeWithdrawalPreset } = useApp();
  const user = state.user!;
  const [method, setMethod] = useState<'bank' | 'wallet'>('bank');
  const [selectedBank, setSelectedBank] = useState<string>('BCA');
  const [selectedWallet, setSelectedWallet] = useState<string>('Gopay');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [presetName, setPresetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const banks = ['BCA', 'Mandiri', 'BRI', 'BNI'];
  const wallets = ['Gopay', 'OVO', 'Dana', 'LinkAja', 'ShopeePay'];

  const handleWithdraw = () => {
    if (!accountNumber || !amount || parseInt(amount) <= 0) return;
    
    withdraw(parseInt(amount));
    
    onSuccess({
      amount,
      method: method === 'bank' ? 'Transfer Bank' : 'E-Wallet',
      destination: method === 'bank' ? `${selectedBank} • ${accountNumber}` : `${selectedWallet} • ${accountNumber}`
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
  };

  const handleSavePreset = () => {
    if (!accountNumber || !presetName) return;
    
    addWithdrawalPreset({
      name: presetName,
      method,
      accountNumber,
      bankName: method === 'bank' ? selectedBank : selectedWallet,
    });
    
    setPresetName('');
    setShowSaveForm(false);
  };

  const handleSelectPreset = (preset: WithdrawalPreset) => {
    setMethod(preset.method);
    setAccountNumber(preset.accountNumber);
    if (preset.method === 'bank' && preset.bankName) {
      setSelectedBank(preset.bankName);
    } else if (preset.method === 'wallet' && preset.bankName) {
      setSelectedWallet(preset.bankName);
    }
    setShowSaveForm(false);
  };

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
          <button 
            onClick={handleWithdraw}
            disabled={!accountNumber || !amount || parseInt(amount) <= 0}
            className="w-full bg-primary text-white py-[16px] rounded-[12px] font-bold text-[16px] active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            Ajukan Penarikan
          </button>
        </div>
      }
    >
      <div className="px-[20px] pt-[24px] pb-[40px] flex flex-col gap-[24px]">
        {/* Balance Section */}
        <div className="bg-primary rounded-[16px] p-[20px] text-white flex flex-col gap-[4px]">
          <p className="text-[12px] opacity-80 font-medium">Saldo Tersedia</p>
          <p className="text-[24px] font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(user.balance)}</p>
        </div>

        {/* Amount Input Section */}
        <div className="flex flex-col gap-[12px]">
          <h2 className="text-[#141d23] text-[20px] font-bold">Jumlah Penarikan</h2>
          <div className="bg-white border border-[#dbe4ed] rounded-[16px] p-[20px] flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#3e4943] text-[12px] font-bold tracking-[0.6px] uppercase">NOMINAL TARIK DANA</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-[18px]">
                  Rp
                </div>
                <input 
                  type="text" 
                  value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full bg-[#f6faff] border border-[#bdcac1] rounded-[12px] p-4 pl-12 text-[20px] font-bold focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-[8px]">
              {[50000, 100000, 200000, 500000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`flex-1 py-[8px] rounded-full text-[12px] font-bold transition-all ${
                    amount === val.toString()
                      ? 'bg-primary text-white'
                      : 'bg-[#e0e9f2] text-[#3e4943] hover:bg-primary/5'
                  }`}
                >
                  {val / 1000}k
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[#141d23] text-[20px] font-bold">Tujuan Pencairan</h2>
        </div>

        {/* Saved Presets Section */}
        {user.withdrawalPresets.length > 0 && (
          <div className="flex flex-col gap-[12px]">
            <p className="text-[#3e4943] text-[14px] font-semibold tracking-[0.14px]">Tujuan Tersimpan</p>
            <div className="flex flex-col gap-[8px]">
              {user.withdrawalPresets.map((preset) => (
                <div 
                  key={preset.id}
                  className="bg-white border border-[#dbe4ed] rounded-[12px] p-[16px] flex items-center justify-between group"
                >
                  <div 
                    className="flex items-center gap-[12px] flex-1 cursor-pointer"
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <div className="w-[40px] h-[40px] bg-[#f6faff] rounded-full flex items-center justify-center text-primary">
                      {preset.method === 'bank' ? <Building2 size={20} /> : <Smartphone size={20} />}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[#141d23] text-[14px] font-bold">{preset.name}</p>
                      <p className="text-[#3e4943] text-[12px] opacity-60">
                        {preset.bankName ? `${preset.bankName} • ` : ''}{preset.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => removeWithdrawalPreset(preset.id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <ChevronRight size={18} className="text-[#bdcac1]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Withdrawal Method Card */}
        <div className="bg-white border border-[#dbe4ed] rounded-[16px] p-[20px] flex flex-col gap-[24px]">
          {/* Method Tabs */}
          <div className="flex flex-col gap-[12px]">
            <p className="text-[#3e4943] text-[14px] font-semibold tracking-[0.14px]">
              {user.withdrawalPresets.length > 0 ? 'Atau Tambah Baru' : 'Tambah Tujuan Pencairan'}
            </p>
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
                        ? 'bg-primary text-white' 
                        : 'bg-[#e0e9f2] text-[#3e4943]'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Wallet Selection (only if method is wallet) */}
          {method === 'wallet' && (
            <div className="flex flex-col gap-[12px]">
              <p className="text-[#3e4943] text-[14px] font-semibold tracking-[0.14px]">Pilih E-Wallet</p>
              <div className="flex flex-wrap gap-[10px]">
                {wallets.map((wallet) => (
                  <button
                    key={wallet}
                    onClick={() => setSelectedWallet(wallet)}
                    className={`px-[20px] py-[8px] rounded-full text-[14px] font-bold transition-all ${
                      selectedWallet === wallet 
                        ? 'bg-primary text-white' 
                        : 'bg-[#e0e9f2] text-[#3e4943]'
                    }`}
                  >
                    {wallet}
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
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={method === 'bank' ? '1234567890' : '0812XXXXXXX'}
                  className="w-full bg-[#f6faff] border border-[#bdcac1] rounded-[12px] p-4 pl-12 text-[15px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {showSaveForm && (
              <div className="flex flex-col gap-[8px] animate-in slide-in-from-top-2 duration-300">
                <label className="text-[#3e4943] text-[12px] font-bold tracking-[0.6px] uppercase">NAMA PENYIMPANAN</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                    <Bookmark size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Contoh: Rekening Utama, Dana Ade, dll"
                    className="w-full bg-[#f6faff] border border-[#bdcac1] rounded-[12px] p-4 pl-12 text-[15px] focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {!showSaveForm ? (
            <button 
              onClick={() => setShowSaveForm(true)}
              className="w-full bg-primary/10 text-primary py-[14px] rounded-[12px] font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Bookmark size={18} /> Simpan Tujuan Ini
            </button>
          ) : (
            <div className="flex gap-[12px]">
              <button 
                onClick={() => setShowSaveForm(false)}
                className="flex-1 bg-gray-100 text-[#5c5f60] py-[14px] rounded-[12px] font-bold text-[14px] active:scale-[0.98] transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleSavePreset}
                disabled={!presetName || !accountNumber}
                className="flex-[2] bg-primary text-white py-[14px] rounded-[12px] font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <ShieldCheck size={18} /> Konfirmasi Simpan
              </button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-[#dbe4ed]/30 border border-[#dbe4ed]/50 p-4 rounded-[12px] flex gap-3">
          <AlertCircle size={18} className="text-[#3e4943] flex-shrink-0 mt-0.5" />
          <p className="text-[#3e4943] text-[13px] leading-relaxed">
            Dana akan diproses maksimal 1x24 jam hari kerja. Pastikan nomor rekening sudah sesuai untuk menghindari kegagalan transaksi.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default WithdrawPage;
