
import React, { useEffect } from 'react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    console.log('Layout: Componente montado');
    return () => {
      console.log('Layout: Componente desmontado');
    };
  }, []);

  return (
    <div className="min-h-screen bg-nexus-dark text-white">
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
