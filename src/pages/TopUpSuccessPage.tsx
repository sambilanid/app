/**
 * Halaman sukses top up.
 * Digunakan saat: Pengguna berhasil melakukan konfirmasi pembayaran top up.
 */
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { PageLayout } from "../components/common/PageLayout";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";

interface TopUpSuccessPageProps {
  amount: string;
  onDone: () => void;
}

export const TopUpSuccessPage: React.FC<TopUpSuccessPageProps> = ({
  amount,
  onDone,
}) => {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount));

  return (
    <PageLayout
      header={
        <PageHeader title="Top Up Berhasil" onBack={onDone} />
      }
      footer={
        <div className="bg-white border-t border-[#dbe4ed] px-5 py-4 pb-8">
          <Button fullWidth size="lg" onClick={onDone}>
            Selesai
          </Button>
        </div>
      }
    >
      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center pt-15 pb-10">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
          <CheckCircle2 size={48} />
        </div>

        <h1 className="text-[#141d23] text-2xl font-bold mb-2">
          Top Up Berhasil!
        </h1>
        <p className="text-[#3e4943] text-base mb-8">
          Saldo sebesar{" "}
          <span className="font-bold text-primary">{formattedAmount}</span>{" "}
          telah berhasil ditambahkan ke dompet kamu.
        </p>

        <div className="w-full bg-[#f6faff] border border-[#dbe4ed] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-[#3e4943] text-sm">Status</span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Sukses
            </span>
          </div>
          <div className="h-px bg-[#dbe4ed] w-full" />
          <div className="flex justify-between items-center">
            <span className="text-[#3e4943] text-sm">Waktu Transaksi</span>
            <span className="text-[#141d23] text-sm font-medium">
              {new Date().toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#3e4943] text-sm">Nominal</span>
            <span className="text-[#141d23] text-sm font-bold">
              {formattedAmount}
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TopUpSuccessPage;
