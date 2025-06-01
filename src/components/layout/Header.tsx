import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowRight } from 'lucide-react';
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigation = [{
    name: 'Início',
    href: '/'
  }, {
    name: 'Agentes',
    href: '/agentes'
  }, {
    name: 'Contato',
    href: '/contato'
  }];
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  return <header className="fixed top-0 w-full z-50 glass-effect">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-scale">
            <div className="w-10 h-10 bg-purple-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">X</span>
            </div>
            <span className="text-xl font-bold gradient-text">Solandox</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map(item => <Link key={item.name} to={item.href} className={`text-sm font-medium transition-colors duration-200 hover:text-nexus-purple ${isActive(item.href) ? 'text-nexus-purple' : 'text-gray-300'}`}>
                {item.name}
              </Link>)}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/contato">
              <Button className="nexus-button group">
                Fale Conosco
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:bg-white/10">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navigation.map(item => <Link key={item.name} to={item.href} className={`text-sm font-medium transition-colors duration-200 hover:text-nexus-purple ${isActive(item.href) ? 'text-nexus-purple' : 'text-gray-300'}`} onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>)}
              <Link to="/contato" onClick={() => setIsMenuOpen(false)}>
                <Button className="nexus-button w-full group">
                  Fale Conosco
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;