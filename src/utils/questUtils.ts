/**
 * Utility untuk memproses data quest.
 * Digunakan saat: Mentransformasi data quest mentah menjadi informasi yang siap ditampilkan di UI (adapter).
 */
import type { Quest } from '../types';

export type QuestDisplayStatus = 
  | 'available' 
  | 'waiting_adventurer' 
  | 'has_applicants' 
  | 'applying' 
  | 'on_going' 
  | 'waiting_confirmation' 
  | 'disputed'
  | 'completed';

export interface QuestDisplayInfo {
  label: string;
  status: QuestDisplayStatus;
}

export const categoryConfig: Record<string, { from?: string; to?: string; location?: string }> = {
  'Jasa titip': { from: 'Alamat Toko/Tempat Beli', to: 'Alamat Pengantaran' },
  'Jasa antar jemput': { from: 'Titik Jemput', to: 'Titik Antar' },
  'Jasa antar ambil barang': { from: 'Lokasi Ambil Barang', to: 'Lokasi Pengantaran' },
  'Jasa angkut': { from: 'Lokasi Muat', to: 'Lokasi Bongkar' },
  'Jasa pindahan': { from: 'Alamat Asal', to: 'Alamat Tujuan' },
  'Jasa reparasi': { location: 'Lokasi Barang' },
  'Antar orang sakit': { from: 'Alamat Penjemputan', to: 'Tujuan (RS/Klinik)' },
  'Membeli obat': { to: 'Alamat Pengantaran' },
  'Jasa bersih-bersih': { location: 'Lokasi Pembersihan' },
  'Lainnya': { location: 'Lokasi' },
};

/**
 * Menerjemahkan status quest global menjadi status yang relevan bagi user tertentu.
 */
export const getQuestDisplayInfo = (quest: Quest, currentUserId: string | null): QuestDisplayInfo => {
  if (!currentUserId) {
    return { label: 'Tersedia', status: 'available' };
  }

  const isCreator = quest.creatorId === currentUserId;
  const isTaker = quest.takerId === currentUserId;
  const isApplicant = quest.applicantIds?.includes(currentUserId);

  // Jika user adalah pembuat quest
  if (isCreator) {
    if (quest.status === 'available') {
      if ((quest.applicantIds?.length || 0) > 0) {
        return { label: 'Ada Pendaftar', status: 'has_applicants' };
      }
      return { label: 'Menunggu Adventurer', status: 'waiting_adventurer' };
    }
    if (quest.status === 'active') {
      return { label: 'Sedang Dikerjakan', status: 'on_going' };
    }
    if (quest.status === 'pending') {
      return { label: 'Menunggu Konfirmasi', status: 'waiting_confirmation' };
    }
    if (quest.status === 'disputed') {
      return { label: 'Dalam Mediasi', status: 'disputed' };
    }
    if (quest.status === 'completed') {
      return { label: 'Selesai', status: 'completed' };
    }
  }

  // Jika user adalah pengambil/pendaftar quest
  if (isTaker) {
    if (quest.status === 'active') {
      return { label: 'Sedang Dikerjakan', status: 'on_going' };
    }
    if (quest.status === 'pending') {
      return { label: 'Menunggu Konfirmasi', status: 'waiting_confirmation' };
    }
    if (quest.status === 'disputed') {
      return { label: 'Dalam Mediasi', status: 'disputed' };
    }
    if (quest.status === 'completed') {
      return { label: 'Selesai', status: 'completed' };
    }
  }

  if (isApplicant && quest.status === 'available') {
    return { label: 'Menunggu Persetujuan', status: 'applying' };
  }

  // Default untuk quest orang lain yang tersedia
  if (quest.status === 'available') {
    return { label: 'Tersedia', status: 'available' };
  }

  return { label: 'Selesai', status: 'completed' };
};
