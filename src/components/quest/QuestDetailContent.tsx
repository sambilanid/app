/**
 * Komponen presentasi detail quest (QuestDetailContent).
 * Deskripsi: Digunakan untuk merender rincian informasi quest seperti gambar hero, kategori,
 * judul, lokasi, deadline, deskripsi, profil pembuat quest (opsional), rincian lokasi dalam kartu,
 * dan preview peta.
 * Kondisi penggunaan: Digunakan di halaman detail quest (QuestDetailPage) dan halaman pengelolaan
 * quest oleh pembuat (ManageQuestPage).
 */
import React from 'react';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { ProfileCard } from '../common/ProfileCard';
import { MiniMapPreview } from './MiniMapPreview';
import { getRelativeTime } from '../../utils/dateUtils';
import { categoryConfig } from '../../utils/questUtils';
import type { Quest, User } from '../../types';

interface QuestDetailContentProps {
  quest: Quest;
  creator?: User | null;
  onViewProfile?: (userId: string) => void;
  evidenceSection?: React.ReactNode;
  extraSection?: React.ReactNode;
}

export const QuestDetailContent: React.FC<QuestDetailContentProps> = ({
  quest,
  creator,
  onViewProfile,
  evidenceSection,
  extraSection,
}) => {
  const creatorQuestsCreated = creator?.questsCreated ?? 0;

  const renderHeroImage = () => (
    <div className="bg-[#8af7c8] h-48 w-full flex items-center justify-center overflow-hidden">
      <img src={quest.image} alt={quest.title} className="w-full h-full object-cover opacity-80" />
    </div>
  );

  const renderHeaderInfo = () => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="w-fit">{quest.category}</Badge>
        <span className="text-[#141d23] text-xs font-semibold opacity-60">
          {getRelativeTime(quest.createdAt)}
        </span>
      </div>
      <h2 className="text-[#141d23] text-2xl font-bold">{quest.title}</h2>
      
      <div className="flex flex-col gap-1 mt-2">
        {quest.location && (
          <div className="flex items-start gap-2 text-[#3e4943]">
            <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">{quest.location}</p>
              {quest.locationDetails && (
                <p className="text-xs text-[#00694b] font-semibold mt-0.5">Patokan: {quest.locationDetails}</p>
              )}
              {quest.locationCoords && (
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                  Coords: {quest.locationCoords.lat.toFixed(6)}, {quest.locationCoords.lng.toFixed(6)}
                </p>
              )}
              {quest.distance && <p className="text-xs text-gray-500 mt-0.5">{quest.distance} dari lokasi</p>}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-[#3e4943]">
          <Clock size={16} className="text-primary" />
          <p className="text-sm font-semibold">Deadline {quest.deadline || 'Hari ini'}</p>
        </div>
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className="flex flex-col gap-2">
      <h3 className="text-[#141d23] text-base font-bold">Deskripsi</h3>
      <p className="text-[#3e4943] text-base leading-6">
        {quest.description}
      </p>
    </div>
  );

  const renderCreatorProfile = () => {
    if (!creator) return null;
    return (
      <ProfileCard 
        name={creator.name}
        avatar={creator.avatar}
        initials={creator.initials}
        rating={creator.rating}
        statsLabel={`${creatorQuestsCreated} quest dibuat`}
        onClick={() => onViewProfile?.(creator.id)}
      />
    );
  };

  const renderLocationDetails = () => {
    if (!quest.location && !quest.fromLocation && !quest.toLocation) return null;

    const hasRoute = !!quest.fromLocation || !!quest.toLocation;

    return (
      <Card className="p-4 flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0 mt-0.5">
          <MapPin size={24} />
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {!hasRoute && quest.location && (
            <div className="text-sm">
              <span className="text-[#3e4943] opacity-60 font-medium block text-xs uppercase tracking-wider mb-0.5">
                {(categoryConfig[quest.category] || categoryConfig['Lainnya']).location || 'Lokasi'}
              </span>
              <span className="text-[#141d23] font-semibold block">{quest.location}</span>
              {quest.locationDetails && (
                <span className="text-xs text-[#00694b] font-semibold block mt-0.5">
                  Patokan: {quest.locationDetails}
                </span>
              )}
              {quest.locationCoords && (
                <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                  Coords: {quest.locationCoords.lat.toFixed(6)}, {quest.locationCoords.lng.toFixed(6)}
                </span>
              )}
            </div>
          )}

          {quest.fromLocation && (
            <div className="text-sm">
              <span className="text-[#3e4943] opacity-60 font-medium block text-xs uppercase tracking-wider mb-0.5">
                {(categoryConfig[quest.category] || categoryConfig['Lainnya']).from}
              </span>
              <span className="text-[#141d23] font-semibold block">{quest.fromLocation}</span>
              {quest.fromLocationDetails && (
                <span className="text-xs text-[#00694b] font-semibold block mt-0.5">
                  Patokan: {quest.fromLocationDetails}
                </span>
              )}
              {quest.fromLocationCoords && (
                <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                  Coords: {quest.fromLocationCoords.lat.toFixed(6)}, {quest.fromLocationCoords.lng.toFixed(6)}
                </span>
              )}
            </div>
          )}
          
          {quest.fromLocation && quest.toLocation && (
            <div className="h-px bg-gray-100 my-1" />
          )}

          {quest.toLocation && (
            <div className="text-sm">
              <span className="text-[#3e4943] opacity-60 font-medium block text-xs uppercase tracking-wider mb-0.5">
                {(categoryConfig[quest.category] || categoryConfig['Lainnya']).to}
              </span>
              <span className="text-[#141d23] font-semibold block">{quest.toLocation}</span>
              {quest.toLocationDetails && (
                <span className="text-xs text-[#00694b] font-semibold block mt-0.5">
                  Patokan: {quest.toLocationDetails}
                </span>
              )}
              {quest.toLocationCoords && (
                <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                  Coords: {quest.toLocationCoords.lat.toFixed(6)}, {quest.toLocationCoords.lng.toFixed(6)}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderMapPreview = () => (
    <MiniMapPreview 
      coords={quest.locationCoords} 
      fromCoords={quest.fromLocationCoords} 
      toCoords={quest.toLocationCoords} 
    />
  );

  return (
    <>
      {renderHeroImage()}
      <div className="px-5 py-4 flex flex-col gap-6">
        {renderHeaderInfo()}
        {quest.needsRevision && quest.revisionNotes && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-xl flex gap-3 animate-in slide-in-from-top duration-300">
            <AlertTriangle className="text-orange-500 shrink-0" size={20} />
            <div className="flex flex-col gap-1 text-left">
              <p className="text-orange-800 text-sm font-bold animate-pulse">Revisi Kerja Diminta</p>
              <p className="text-orange-700 text-xs leading-relaxed font-semibold">
                "{quest.revisionNotes}"
              </p>
            </div>
          </div>
        )}
        {evidenceSection}
        {renderDescription()}
        {creator && renderCreatorProfile()}
        {extraSection}
        {renderLocationDetails()}
        {renderMapPreview()}
      </div>
    </>
  );
};
