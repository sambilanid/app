import React from 'react';

interface AmountInputCardProps {
  amount: string;
  onAmountChange: (value: string) => void;
  label: string;
  quickAmounts?: number[];
  className?: string;
}

/**
 * Komponen input nominal finansial.
 * Digunakan untuk input top-up atau tarik dana dengan format mata uang dan pilihan cepat.
 */
export const AmountInputCard: React.FC<AmountInputCardProps> = ({
  amount,
  onAmountChange,
  label,
  quickAmounts = [50000, 100000, 200000, 500000],
  className = ''
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    onAmountChange(value);
  };

  return (
    <div className={`bg-white border border-[#dbe4ed] rounded-[16px] p-[20px] flex flex-col gap-[16px] ${className}`}>
      <div className="flex flex-col gap-[8px]">
        <label className="text-[#3e4943] text-[12px] font-bold tracking-[0.6px] uppercase">
          {label}
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-[18px]">
            Rp
          </div>
          <input 
            type="text" 
            value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
            onChange={handleInputChange}
            placeholder="0"
            className="w-full bg-[#f6faff] border border-[#bdcac1] rounded-[12px] p-4 pl-12 text-[20px] font-bold focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
      <div className="flex gap-[8px]">
        {quickAmounts.map((val) => (
          <button
            key={val}
            onClick={() => onAmountChange(val.toString())}
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
  );
};
