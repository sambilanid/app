/**
 * Halaman notifikasi aplikasi.
 * Digunakan saat: Memberitahu pengguna tentang pembaruan status quest, pembayaran, atau pesan sistem lainnya.
 */
import React from 'react';
import { CreditCard, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { useApp } from '../store/AppContext';

interface NotificationsPageProps {
  onBack: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const { state, markAllNotificationsAsRead, markNotificationAsRead } = useApp();
  const { user } = state;
  const { notifications } = user!;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="text-primary" size={24} />;
      case 'quest':
        return <ShoppingBag className="text-primary" size={24} />;
      case 'system':
        return <CheckCircle2 className="text-primary" size={24} />;
      default:
        return <CheckCircle2 className="text-primary" size={24} />;
    }
  };

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Notifikasi" 
          onBack={onBack}
          rightAction={
            <button 
              onClick={markAllNotificationsAsRead}
              className="text-primary text-[14px] font-semibold px-3 py-1 rounded-lg hover:bg-primary/5 transition-colors"
            >
              Tandai dibaca
            </button>
          }
        />
      }
    >
      <div className="flex flex-col gap-1 py-4 pb-20">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            onClick={() => markNotificationAsRead(notif.id)}
            className={`px-4 py-4 flex gap-4 transition-colors cursor-pointer ${notif.unread ? 'bg-primary/5' : 'bg-white'} border-b border-gray-50`}
          >
            <div className="flex-shrink-0">
              <div className="w-[48px] h-[48px] bg-primary/10 rounded-full flex items-center justify-center">
                {getNotificationIcon(notif.type)}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h3 className={`text-[15px] ${notif.unread ? 'font-bold text-[#111827]' : 'font-semibold text-[#374151]'}`}>
                  {notif.title}
                </h3>
                {notif.unread && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                )}
              </div>
              <p className="text-[14px] text-gray-500 leading-normal">
                {notif.message}
              </p>
              <span className="text-[12px] text-gray-400 mt-1">
                {notif.time}
              </span>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
            <p className="text-gray-500">Belum ada notifikasi untuk saat ini.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default NotificationsPage;
