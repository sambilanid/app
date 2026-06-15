/**
 * Komponen navigasi bawah utama.
 * Digunakan saat: Menyediakan akses cepat ke halaman utama seperti Beranda, Cari, Aktivitas, dan Profil.
 */
import { Home, Search, Plus, Clock, User } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <div 
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
  >
    <div className={`${active ? 'text-primary' : 'text-[#5a5c5e]'}`}>
      {icon}
    </div>
    <span className={`text-[12px] font-bold tracking-tight ${active ? 'text-primary' : 'text-[#5a5c5e]'}`}>
      {label}
    </span>
  </div>
);

export const BottomNavigationBar: React.FC<{ 
  activeTab?: 'home' | 'search' | 'activity' | 'profile';
  onNavigate?: (page: 'home' | 'search' | 'activity' | 'profile') => void;
  onCreateQuest?: () => void;
}> = ({ activeTab, onNavigate, onCreateQuest }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-screen-md mx-auto bg-secondary h-[80px] flex items-center justify-between px-[32px] z-50 border-t border-gray-100">
      <NavItem 
        icon={<Home size={20} />} 
        label="Beranda" 
        active={activeTab === 'home'} 
        onClick={() => onNavigate?.('home')}
      />
      <NavItem 
        icon={<Search size={20} />} 
        label="Cari" 
        active={activeTab === 'search'} 
        onClick={() => onNavigate?.('search')}
      />
      
      <div 
        className="flex flex-col items-center justify-center relative -top-3 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onCreateQuest?.();
        }}
      >
        <div className="bg-primary w-[48px] h-[48px] rounded-full flex items-center justify-center text-white">
          <Plus size={24} strokeWidth={3} />
        </div>
        <span className="text-[11px] font-bold tracking-tight mt-1 text-[#5a5c5e]">
          Buat Quest
        </span>
      </div>

      <NavItem 
        icon={<Clock size={20} />} 
        label="Aktivitas" 
        active={activeTab === 'activity'} 
        onClick={() => onNavigate?.('activity')}
      />
      <NavItem 
        icon={<User size={20} />} 
        label="Profil" 
        active={activeTab === 'profile'} 
        onClick={() => onNavigate?.('profile')}
      />
    </div>
  );
};
