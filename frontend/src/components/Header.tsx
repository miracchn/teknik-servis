'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Anasayfa', href: '/' },
  { name: 'Hizmetlerimiz', href: '/services' },
  { name: 'Hakkımızda', href: '/about' },
  { name: 'İletişim', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isHomePage) return;
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, isHomePage]);

  useEffect(() => {
    document.body.classList.add('bg-gradient-to-b', 'from-white', 'to-gray-50');
    
    return () => {
      document.body.classList.remove('bg-gradient-to-b', 'from-white', 'to-gray-50');
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isHomePage 
            ? scrolled
              ? 'bg-white/90 backdrop-blur-md shadow-md'
              : 'bg-black/30 backdrop-blur-sm'
            : 'bg-white shadow-md'
        }`}
      >
        <div className="container mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center h-22 md:h-22">
            {/* Logo */}
            <div className="flex-1 flex-shrink-0 relative mr-4">
              <Link href="/" className="flex items-center">
                <div className="w-80 h-24 relative">
                  {/* Show inverted logo when NOT scrolled on homepage, normal logo when scrolled or on other pages */}
                  {isHomePage && !scrolled ? (
                    <Image
                      src="/logo-inverted.png"
                      alt="Logo"
                      fill
                      className="object-contain object-left"
                      sizes="(max-width: 768px) 200px, 300px"
                      priority
                    />
                  ) : (
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      fill
                      className="object-contain object-left"
                      sizes="(max-width: 768px) 200px, 300px"
                      priority
                    />
                  )}
                </div>
              </Link>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      pathname === item.href
                        ? isHomePage && scrolled === false
                          ? 'text-white bg-white/20'
                          : 'text-gray-900 bg-gray-100'
                        : isHomePage && scrolled === false
                          ? 'text-gray-100 hover:text-white hover:bg-white/20'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden relative z-50 flex-shrink-0">
              <button
                type="button"
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  isHomePage && scrolled === false
                    ? 'text-white hover:text-white hover:bg-white/20'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-expanded={isMenuOpen ? 'true' : 'false'}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu - Sliding sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Sidebar */}
        <div 
          className={`absolute top-0 right-0 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="pt-20 px-4 pb-6 h-full overflow-y-auto">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-3 text-base font-medium rounded-md transition-colors ${
                    pathname === item.href
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
} 