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
import { useDialog } from '../components/common/Dialog';
import type { WithdrawalPreset } from '../types';
import { formatIDR } from '../utils/questUtils';

interface WithdrawPageProps {
  onBack: () => void;
  onSuccess: (data: { amount: string; method: string; destination: string }) => void;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({ onBack, onSuccess }) => {
  const { state, withdraw, addWithdrawalPreset, removeWithdrawalPreset } = useApp();
  const { showDialog } = useDialog();

  const [method, setMethod] = useState<'bank' | 'wallet'>('bank');
  const [selectedBank, setSelectedBank] = useState<string>('BCA');
  const [selectedWallet, setSelectedWallet] = useState<string>('Gopay');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [presetName, setPresetName] = useState('');

  const user = state.user;

  if (!user) return null;

  const banks = ['BCA', 'Mandiri', 'BRI', 'BNI'];
  const wallets = ['Gopay', 'OVO', 'Dana', 'LinkAja', 'ShopeePay'];

  const isAmountValid = amount && parseInt(amount) > 0 && parseInt(amount) <= user.balance;

  const handleWithdrawPreset = (preset: WithdrawalPreset) => {
    if (!isAmountValid) return;
    
    const formattedAmount = formatIDR(parseInt(amount));

    showDialog({
      title: 'Konfirmasi Penarikan',
      message: `Apakah kamu yakin ingin menarik saldo sebesar ${formattedAmount} ke ${preset.name} (${preset.bankName ? `${preset.bankName} • ` : ''}${preset.accountNumber})?`,
      confirmLabel: 'Tarik Dana',
      cancelLabel: 'Batal',
      onConfirm: () => {
        withdraw(parseInt(amount));
        
        onSuccess({
          amount,
          method: preset.method === 'bank' ? 'Transfer Bank' : 'E-Wallet',
          destination: preset.bankName ? `${preset.bankName} • ${preset.accountNumber}` : preset.accountNumber
        });
      }
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
      <div className="px-5 pt-6 pb-10 flex flex-col gap-6">
        {/* Balance Section */}
        <BalanceCard balance={user.balance} />

        {/* Amount Input Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[#141d23] text-xl font-bold">Jumlah Penarikan</h2>
          <AmountInputCard 
            amount={amount} 
            onAmountChange={setAmount} 
            label="NOMINAL TARIK DANA"
          />
          {amount && parseInt(amount) > user.balance && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertCircle size={16} />
              <p className="text-xs font-medium">Nominal melebihi saldo kamu</p>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[#141d23] text-xl font-bold">Tujuan Pencairan</h2>
        </div>

        {/* Saved Presets Section */}
        {user.withdrawalPresets.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-[#3e4943] text-sm font-semibold tracking-[0.14px]">Tujuan Tersimpan (Klik untuk tarik)</p>
            <div className="flex flex-col gap-2">
              {user.withdrawalPresets.map((preset) => (
                <div 
                  key={preset.id}
                  className={`bg-white border border-[#dbe4ed] rounded-xl p-4 flex items-center justify-between group ${!isAmountValid ? 'opacity-60 grayscale-[0.5]' : ''}`}
                >
                  <div 
                    className={`flex items-center gap-3 flex-1 ${!isAmountValid ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => handleWithdrawPreset(preset)}
                  >
                    <div className="w-10 h-10 bg-[#f6faff] rounded-full flex items-center justify-center text-primary">
                      {preset.method === 'bank' ? <Building2 size={20} /> : <Smartphone size={20} />}
                    </div>
                    <div className="flex flex-col text-left">
                      <p className="text-[#141d23] text-sm font-bold">{preset.name}</p>
                      <p className="text-[#3e4943] text-xs opacity-60">
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
        <div className="bg-white border border-[#dbe4ed] rounded-2xl p-5 flex flex-col gap-6">
          {/* Method Tabs */}
          <div className="flex flex-col gap-3">
            <p className="text-[#3e4943] text-sm font-semibold tracking-[0.14px]">
              {user.withdrawalPresets.length > 0 ? 'Atau Tambah Baru' : 'Tambah Tujuan Pencairan'}
            </p>
            <div className="flex gap-3 justify-between">
              <button 
                onClick={() => setMethod('bank')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  method === 'bank' 
                    ? 'bg-primary text-white' 
                    : 'bg-[#f6faff] text-[#5c5f60] border border-[#dbe4ed]'
                }`}
              >
                <Building2 size={18} /> Bank
              </button>
              <button 
                onClick={() => setMethod('wallet')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
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
            <div className="flex flex-col gap-3">
              <p className="text-[#3e4943] text-sm font-semibold tracking-[0.14px]">Pilih Bank</p>
              <div className="flex flex-wrap gap-2.5">
                {banks.map((bank) => (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
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
            <div className="flex flex-col gap-3">
              <p className="text-[#3e4943] text-sm font-semibold tracking-[0.14px]">Pilih E-Wallet</p>
              <div className="flex flex-wrap gap-2.5">
                {wallets.map((wallet) => (
                  <button
                    key={wallet}
                    onClick={() => setSelectedWallet(wallet)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
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
          <div className="flex flex-col gap-5 pt-2">
            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-xs font-bold tracking-[0.6px] uppercase">
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
                  className="w-full bg-[#f6faff] border border-[#bdcac1] rounded-xl p-4 pl-12 text-[15px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-xs font-bold tracking-[0.6px] uppercase">NAMA PENYIMPANAN</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                  <Bookmark size={20} />
                </div>
                <input 
                  type="text" 
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Contoh: Rekening Utama, Dana Ade, dll"
                  className="w-full bg-[#f6faff] border border-[#bdcac1] rounded-xl p-4 pl-12 text-[15px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSavePreset}
            disabled={!presetName || !accountNumber}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Simpan
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-[#dbe4ed]/30 border border-[#dbe4ed]/50 p-4 rounded-xl flex gap-3">
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
