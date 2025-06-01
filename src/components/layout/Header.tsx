import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20">
          {/* Logo Centralizada e Maior */}
          <Link to="/" className="flex items-center space-x-3 hover-scale">
            <span className="text-2xl font-bold gradient-text">Solandox</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;