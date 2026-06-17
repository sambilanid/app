/**
 * Picker untuk memilih tanggal dan waktu (deadline) menggunakan BottomSheet.
 * Digunakan saat: Pembuatan atau pengeditan quest untuk menentukan kapan quest harus selesai.
 */
import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from './Button';
import { BottomSheet } from './BottomSheet';

interface DateTimePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (deadline: string) => void;
  initialValue?: string;
}

export const DateTimePickerDialog: React.FC<DateTimePickerDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [time, setTime] = useState('12:00');

  const handleConfirm = () => {
    let dateLabel = '';
    if (selectedDate === todayStr) {
      dateLabel = 'Hari ini';
    } else if (selectedDate === tomorrowStr) {
      dateLabel = 'Besok';
    } else {
      const date = new Date(selectedDate);
      dateLabel = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
    
    onSelect(`${dateLabel}, ${time}`);
    onClose();
  };

  return (
    <BottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Pilih Deadline"
    >
      <div className="flex flex-col gap-6 mt-2">
        <div className="flex flex-col gap-5">
          {/* Date Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#3e4943] uppercase tracking-wider ml-1">Tanggal</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#f6fafe] border border-[#dbe4ed] rounded-2xl p-4 pl-12 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#3e4943] uppercase tracking-wider ml-1">Atur Cepat</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="p-4 rounded-2xl text-sm font-bold transition-all border border-[#bdcac1] bg-white text-[#3e4943] active:bg-gray-100 active:scale-[0.98]"
              >
                Hari Ini
              </button>
              <button
                onClick={() => setSelectedDate(tomorrowStr)}
                className="p-4 rounded-2xl text-sm font-bold transition-all border border-[#bdcac1] bg-white text-[#3e4943] active:bg-gray-100 active:scale-[0.98]"
              >
                Besok
              </button>
            </div>
          </div>

          {/* Time Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#3e4943] uppercase tracking-wider ml-1">Waktu (Jam)</label>
            <div className="relative">
              <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#f6fafe] border border-[#dbe4ed] rounded-2xl p-4 pl-12 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <Button fullWidth size="lg" onClick={handleConfirm} className="rounded-2xl !font-bold py-4">
          Simpan Deadline
        </Button>
      </div>
    </BottomSheet>
  );
};
