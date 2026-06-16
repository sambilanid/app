/**
 * Halaman berhasil mempublikasikan quest.
 * Digunakan saat: Pengguna telah berhasil membuat dan mempublikasikan quest baru.
 */
import React from "react";
import { CheckCircle2, List, Home } from "lucide-react";
import { PageLayout } from "../components/common/PageLayout";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";

interface CreateQuestSuccessPageProps {
  onActivity: () => void;
  onHome: () => void;
  onBack: () => void;
}

const CreateQuestSuccessPage: React.FC<CreateQuestSuccessPageProps> = ({
  onActivity,
  onHome,
  onBack,
}) => {
  return (
    <PageLayout
      header={<PageHeader title="Quest Berhasil" onBack={onBack} />}
      footer={
        <div className="bg-white border-t border-[#dbe4ed] px-5 py-4 pb-8 flex flex-col gap-3">
          <Button
            fullWidth
            size="lg"
            onClick={onActivity}
            leftIcon={<List size={18} />}
          >
            Lihat Aktivitas Saya
          </Button>
          <Button
            fullWidth
            variant="outline"
            size="lg"
            onClick={onHome}
            leftIcon={<Home size={18} />}
          >
            Kembali ke Beranda
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
          Quest Berhasil Dipublikasikan!
        </h1>
        <p className="text-[#3e4943] text-base mb-8 leading-relaxed">
          Quest kamu sekarang sudah tersedia untuk diambil oleh Adventurer lain. 
          Kamu bisa memantau perkembangannya di menu Aktivitas.
        </p>
      </div>
    </PageLayout>
  );
};

export default CreateQuestSuccessPage;
