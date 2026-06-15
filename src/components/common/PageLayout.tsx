/**
 * Wrapper struktur halaman.
 * Digunakan saat: Di setiap root komponen halaman.
 */
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  mainClassName?: string;
  hasNavbar?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  header, 
  footer,
  className = '',
  mainClassName = '',
  hasNavbar = false
}) => {
  return (
    <div className={`flex flex-col h-screen bg-[#f6faff] ${className}`}>
      {header && <div className="shrink-0 z-40">{header}</div>}
      <main className={`flex-1 overflow-x-hidden relative ${hasNavbar ? 'pb-[80px]' : ''} ${mainClassName || 'overflow-y-auto'}`}>
        {children}
      </main>
      {footer && <div className="shrink-0 z-50">{footer}</div>}
    </div>
  );
};
