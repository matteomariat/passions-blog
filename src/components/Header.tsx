import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border] bg-[--color-bg]/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link 
          to="/" 
          className="font-mono text-lg font-semibold tracking-tight text-[--color-text] hover:opacity-80 transition-opacity"
        >
          matteo_mariat
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex sm:items-center sm:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm transition-colors ${
                location.pathname === item.href
                  ? 'text-[--color-text]'
                  : 'text-[--color-text-secondary] hover:text-[--color-text]'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="sm:hidden -m-2 p-2 text-[--color-text-secondary] hover:text-[--color-text]"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open menu</span>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-[--color-bg] border-l border-[--color-border] p-6">
            <div className="flex items-center justify-between mb-8">
              <Link 
                to="/" 
                className="font-mono text-lg font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                matteo_mariat
              </Link>
              <button
                type="button"
                className="-m-2 p-2 text-[--color-text-secondary] hover:text-[--color-text]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-2 text-lg ${
                    location.pathname === item.href
                      ? 'text-[--color-text]'
                      : 'text-[--color-text-secondary]'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
