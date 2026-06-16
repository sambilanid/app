/**
 * Halaman penarikan dana (Withdraw).
 * Digunakan saat: Pengguna ingin mencairkan saldo dari wallet ke rekening bank atau e-wallet.
 */
import React, { useState } from 'react';
import { 
  CreditCard,
  Smartphone, 
  AlertCircle, 
  Building2,
  Bookmark,
  ChevronRight,
  Trash2
} from 'lucide-react';

import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { AmountInputCard } from '../components/wallet/AmountInputCard';
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

  const banks = ['BCA', 'Mandiri', 'BRI', 'BNI'];
  const wallets = ['Gopay', 'OVO', 'Dana', 'LinkAja', 'ShopeePay'];

  const isAmountValid = amount && parseInt(amount) > 0 && parseInt(amount) <= user.balance;

  const handleWithdrawPreset = (preset: WithdrawalPreset) => {
    if (!isAmountValid) return;
    
    withdraw(parseInt(amount));
    
    onSuccess({
      amount,
      method: preset.method === 'bank' ? 'Transfer Bank' : 'E-Wallet',
      destination: preset.bankName ? `${preset.bankName} • ${preset.accountNumber}` : preset.accountNumber
    });
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
    setAccountNumber('');
  };

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Tarik Dana" 
          onBack={onBack}
        />
      }
    >
      <div className="px-[20px] pt-[24px] pb-[40px] flex flex-col gap-[24px]">
        {/* Balance Section */}
        <BalanceCard balance={user.balance} />

        {/* Amount Input Section */}
        <div className="flex flex-col gap-[12px]">
          <h2 className="text-[#141d23] text-[20px] font-bold">Jumlah Penarikan</h2>
          <AmountInputCard 
            amount={amount} 
            onAmountChange={setAmount} 
            label="NOMINAL TARIK DANA"
          />
          {amount && parseInt(amount) > user.balance && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-[12px] border border-red-100 animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertCircle size={16} />
              <p className="text-[12px] font-medium">Nominal melebihi saldo kamu</p>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[#141d23] text-[20px] font-bold">Tujuan Pencairan</h2>
        </div>

        {/* Saved Presets Section */}
        {user.withdrawalPresets.length > 0 && (
          <div className="flex flex-col gap-[12px]">
            <p className="text-[#3e4943] text-[14px] font-semibold tracking-[0.14px]">Tujuan Tersimpan (Klik untuk tarik)</p>
            <div className="flex flex-col gap-[8px]">
              {user.withdrawalPresets.map((preset) => (
                <div 
                  key={preset.id}
                  className={`bg-white border border-[#dbe4ed] rounded-[12px] p-[16px] flex items-center justify-between group ${!isAmountValid ? 'opacity-60 grayscale-[0.5]' : ''}`}
                >
                  <div 
                    className={`flex items-center gap-[12px] flex-1 ${!isAmountValid ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => handleWithdrawPreset(preset)}
                  >
                    <div className="w-[40px] h-[40px] bg-[#f6faff] rounded-full flex items-center justify-center text-primary">
                      {preset.method === 'bank' ? <Building2 size={20} /> : <Smartphone size={20} />}
                    </div>
                    <div className="flex flex-col text-left">
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

            <div className="flex flex-col gap-[8px]">
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
          </div>

          <button 
            onClick={handleSavePreset}
            disabled={!presetName || !accountNumber}
            className="w-full bg-primary text-white py-[14px] rounded-[12px] font-bold text-[14px] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Simpan
          </button>
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
