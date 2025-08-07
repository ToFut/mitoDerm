import { ReactNode } from 'react';

interface AdminProductsLayoutProps {
  children: ReactNode;
}

export default function AdminProductsLayout({ children }: AdminProductsLayoutProps) {
  return (
    <div className="admin-products-layout">
      {children}
    </div>
  );
} 