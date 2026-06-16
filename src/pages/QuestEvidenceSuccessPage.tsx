/**
 * Halaman berhasil mengirimkan bukti quest.
 * Digunakan saat: Pengguna telah berhasil mengirimkan bukti penyelesaian quest.
 */
import React from "react";
import { CheckCircle2, List } from "lucide-react";
import { PageLayout } from "../components/common/PageLayout";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";

interface QuestEvidenceSuccessPageProps {
  onActivity: () => void;
  onBack: () => void;
}

const QuestEvidenceSuccessPage: React.FC<QuestEvidenceSuccessPageProps> = ({
  onActivity,
  onBack,
}) => {
  return (
    <PageLayout
      header={<PageHeader title="Bukti Quest" onBack={onBack} />}
      footer={
        <div className="bg-white border-t border-[#dbe4ed] px-5 py-4 pb-8">
          <Button
            fullWidth
            size="lg"
            onClick={onActivity}
            leftIcon={<List size={18} />}
          >
            Lihat Aktivitas
          </Button>
        </div>
      }
    >
      <div className="h-full flex flex-col px-5 py-15 items-center text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 size={48} />
        </div>

        {/* Success Message */}
        <h1 className="text-[#141d23] text-2xl font-bold mb-2">
          Bukti Berhasil Dikirim!
        </h1>
        <p className="text-[#3e4943] text-base mb-8 leading-relaxed">
          Tunggu konfirmasi dari pemberi quest. Saldo akan otomatis masuk ke
          dompetmu setelah quest dikonfirmasi.
        </p>
      </div>
    </PageLayout>
  );
};

export default QuestEvidenceSuccessPage;
