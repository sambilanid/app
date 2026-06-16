/**
 * Halaman pengelolaan quest oleh pemilik quest.
 * Digunakan saat: User ingin mengedit, menghapus, atau mengelola pemohon quest miliknya.
 */
import React from 'react';
import { Share2, MapPin, Clock, Trash2, Edit2, UserCheck, UserX } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';

import mapPreview from '../assets/map-preview.png';

import { useApp } from '../store/AppContext';
import { useDialog } from '../components/common/Dialog';
import { getRelativeTime } from '../utils/dateUtils';

interface ManageQuestPageProps {
  questId: string | null;
  onBack: () => void;
  onEdit?: (questId: string) => void;
}

const ManageQuestPage: React.FC<ManageQuestPageProps> = ({ questId, onBack, onEdit }) => {
  const { state, deleteQuest, acceptApplicant, rejectApplicant } = useApp();
  const { showDialog } = useDialog();
  const quest = state.allQuests.find(q => q.id === questId);
  const applicants = quest?.applicantIds?.map(id => state.users.find(u => u.id === id)).filter(Boolean) || [];

  if (!quest) {
    return (
      <PageLayout
        header={<PageHeader title="Quest tidak ditemukan" onBack={onBack} />}
      >
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-text">
          <p>Quest yang Anda cari tidak tersedia.</p>
        </div>
      </PageLayout>
    );
  }

  const handleDelete = () => {
    showDialog({
      title: 'Hapus Quest?',
      message: 'Quest yang dihapus tidak dapat dikembalikan. Adventurer lain tidak akan bisa melihat quest ini lagi.',
      confirmLabel: 'Ya, Hapus',
      cancelLabel: 'Batal',
      variant: 'danger',
      onConfirm: () => {
        deleteQuest(quest.id);
        onBack();
      }
    });
  };

  return (
    <PageLayout
      header={
        <PageHeader
          title="Kelola quest"
          onBack={onBack}
          rightAction={
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit?.(quest.id)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-primary"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-red-500"
              >
                <Trash2 size={20} />
              </button>
              <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 size={20} className="text-[#141d23]" />
              </button>
            </div>
          }
        />
      }
      footer={
        <div className="backdrop-blur-[6px] bg-[rgba(246,250,255,0.9)] border-t border-[#bdcac1] p-4 max-w-screen-md mx-auto">
          <div className="flex justify-between items-center px-2">
            <div>
              <p className="text-[#3e4943] text-[12px] font-bold uppercase tracking-wider">Reward ditawarkan</p>
              <p className="text-primary text-[20px] font-bold">{quest.price}</p>
            </div>
            <div className="text-right">
              <p className="text-[#3e4943] text-[12px] font-bold uppercase tracking-wider">Status Quest</p>
              <Badge variant={quest.status === 'available' ? 'primary' : 'secondary'}>
                {quest.status === 'available' ? 'Mencari Adventurer' : 
                 quest.status === 'active' ? 'Sedang Dikerjakan' : quest.status}
              </Badge>
            </div>
          </div>
        </div>
      }
    >
      <div className="pb-40">
        {/* Hero Image */}
        <div className="bg-[#8af7c8] h-[192px] w-full flex items-center justify-center overflow-hidden">
          <img src={quest.image} alt={quest.title} className="w-full h-full object-cover opacity-80" />
        </div>

        <div className="px-[20px] py-[16px] flex flex-col gap-6">
          {/* Header Info */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="w-fit">{quest.category}</Badge>
              <span className="text-[#141d23] text-[12px] font-semibold opacity-60">
                Dibuat {getRelativeTime(quest.createdAt)}
              </span>
            </div>
            <h2 className="text-[#141d23] text-[24px] font-bold">{quest.title}</h2>
            
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2 text-[#3e4943]">
                <MapPin size={16} className="text-primary" />
                <div>
                  <p className="text-[14px] font-semibold">{quest.location}</p>
                  <p className="text-[12px]">{quest.distance} dari lokasi</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#3e4943]">
                <Clock size={16} className="text-primary" />
                <p className="text-[14px] font-semibold">Deadline {quest.deadline || 'Hari ini'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[#141d23] text-[16px] font-bold">Deskripsi</h3>
            <p className="text-[#3e4943] text-[16px] leading-[24px]">
              {quest.description}
            </p>
          </div>

          {/* Applicants Management Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[#141d23] text-[16px] font-bold">Daftar Pemohon ({applicants.length})</h3>
              {applicants.length > 0 && <span className="text-primary text-[12px] font-bold">Lihat Semua</span>}
            </div>
            
            {applicants.length > 0 ? (
              <div className="flex flex-col gap-3">
                {applicants.map((applicant) => applicant && (
                  <Card key={applicant.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar initials={applicant.initials} src={applicant.avatar} size="sm" />
                        <div>
                          <p className="text-[#141d23] text-[14px] font-bold">{applicant.name}</p>
                          <div className="flex items-center gap-1 text-[#3e4943] text-[11px] font-bold">
                            <span>★ {applicant.rating}</span>
                            <span>•</span>
                            <span>{applicant.questsCompleted} selesai</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="!p-2 rounded-full border-red-200 text-red-500 hover:bg-red-50"
                          onClick={() => rejectApplicant(quest.id, applicant.id)}
                        >
                          <UserX size={18} />
                        </Button>
                        <Button 
                          size="sm" 
                          className="!p-2 rounded-full"
                          onClick={() => acceptApplicant(quest.id, applicant.id)}
                        >
                          <UserCheck size={18} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                <p className="text-gray-400 text-[14px]">Belum ada yang mendaftar untuk quest ini.</p>
              </div>
            )}
          </div>

          {/* Map Preview */}
          <div className="bg-[#e0e9f2] border border-[#bdcac1] h-[128px] rounded-[16px] overflow-hidden relative">
             <img 
               src={mapPreview} 
               alt="map" 
               className="w-full h-full object-cover opacity-60"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <MapPin size={32} className="text-primary" />
             </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ManageQuestPage;
