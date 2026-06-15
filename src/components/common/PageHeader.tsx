/**
 * Header halaman generik yang digunakan di seluruh aplikasi.
 * Digunakan saat: Bagian atas setiap halaman untuk judul, navigasi, dan aksi.
 */
import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  backIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  centerContent?: React.ReactNode;
  className?: string;
  backButtonClassName?: string;
  variant?: 'default' | 'transparent' | 'primary';
  showBorder?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle,
  onBack, 
  backIcon,
  rightAction, 
  centerContent,
  className = '',
  backButtonClassName = '',
  variant = 'default',
  showBorder = true
}) => {
  const isPrimary = variant === 'primary';
  
  const bgStyles = {
    default: 'bg-[#f6faff]',
    transparent: 'bg-transparent',
    primary: 'bg-primary text-white'
  };

  const borderStyle = (showBorder && !isPrimary && variant !== 'transparent') 
    ? 'border-b border-[#dbe4ed]/50' 
    : '';

  const textColor = isPrimary ? 'text-white' : 'text-[#141d23]';
  const backIconColor = isPrimary ? 'text-white' : 'text-primary';

  return (
    <div className={`h-[80px] flex items-center justify-between px-[20px] z-40 ${bgStyles[variant]} ${borderStyle} ${className}`}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {onBack && (
          <button 
            onClick={onBack}
            className={`p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors shrink-0 ${backButtonClassName}`}
          >
            {backIcon || <ChevronLeft size={24} className={backIconColor} />}
          </button>
        )}
        
        {(title || subtitle) && (
          <div className="flex flex-col min-w-0 flex-1">
            {typeof title === 'string' ? (
              <h1 className={`${textColor} font-bold text-[18px] leading-tight truncate`}>{title}</h1>
            ) : title}
            
            {subtitle && (
              <div className="mt-0.5">
                {typeof subtitle === 'string' ? (
                  <p className={`${isPrimary ? 'text-white/80' : 'text-[#3e4943]'} text-[12px] font-bold tracking-[0.36px]`}>
                    {subtitle}
                  </p>
                ) : subtitle}
              </div>
            )}
          </div>
        )}
        
        {centerContent}
      </div>
      
      {rightAction && <div className="flex items-center ml-2 shrink-0">{rightAction}</div>}
    </div>
  );
};
