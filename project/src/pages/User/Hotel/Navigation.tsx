import React, { useState } from 'react';
import { Phone, Mail, MapPin, Menu, X, Facebook, Instagram, Twitter } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rooms', href: '/rooms' },
    { name: 'Facilities', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-900'>
      {/* --- NAVBAR --- */}
      <nav className='sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-20'>
            {/* Logo */}
            <div className='flex-shrink-0 flex items-center'>
              <span className='text-2xl font-black tracking-tighter text-blue-900'>
                LUXE<span className='text-blue-600'>STAY</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex space-x-8 items-center'>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className='text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200'
                >
                  {link.name}
                </a>
              ))}
              <a
                href='/contact'
                className='bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200'
              >
                Book Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className='md:hidden'>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors'
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className='md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300'>
            <div className='px-4 pt-2 pb-6 space-y-1'>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className='block px-3 py-4 text-base font-medium text-slate-700 border-b border-slate-50 last:border-0'
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className='relative'>{children}</main>

      {/* --- STICKY CALL BUTTON (Mobile Only) --- */}
      <a
        href='tel:+91XXXXXXXXXX'
        className='md:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl z-50 animate-bounce'
        aria-label='Call Us'
      >
        <Phone size={24} fill='currentColor' />
      </a>

      {/* --- FOOTER --- */}
      <footer className='bg-slate-900 text-slate-300 pt-16 pb-8 px-6'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12'>
          {/* Brand Info */}
          <div className='col-span-1 md:col-span-1'>
            <h3 className='text-2xl font-bold text-white mb-4'>LUXE STAY</h3>
            <p className='text-sm leading-relaxed mb-6 text-slate-400'>
              Experience luxury and comfort in the heart of Kolkata. Your premium destination for a
              peaceful and affordable stay.
            </p>
            <div className='flex space-x-4'>
              <Facebook
                size={20}
                className='cursor-pointer hover:text-blue-500 transition-colors'
              />
              <Instagram
                size={20}
                className='cursor-pointer hover:text-pink-500 transition-colors'
              />
              <Twitter size={20} className='cursor-pointer hover:text-blue-400 transition-colors' />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-white font-bold mb-6'>Quick Links</h4>
            <ul className='space-y-4 text-sm'>
              <li>
                <a href='/rooms' className='hover:text-white transition-colors'>
                  Our Rooms
                </a>
              </li>
              <li>
                <a href='/about' className='hover:text-white transition-colors'>
                  Facilities
                </a>
              </li>
              <li>
                <a href='/contact' className='hover:text-white transition-colors'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition-colors'>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className='col-span-1 md:col-span-2'>
            <h4 className='text-white font-bold mb-6'>Contact Us</h4>
            <div className='space-y-4 text-sm'>
              <p className='flex items-start gap-3'>
                <MapPin size={18} className='text-blue-500 flex-shrink-0' />
                <span>
                  123 Street Name, Park Street Area,
                  <br />
                  Kolkata, West Bengal, India
                </span>
              </p>
              <p className='flex items-center gap-3'>
                <Phone size={18} className='text-blue-500' />
                <span>+91 98765 43210</span>
              </p>
              <p className='flex items-center gap-3'>
                <Mail size={18} className='text-blue-500' />
                <span>booking@luxestay.com</span>
              </p>
            </div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500'>
          <p>© {new Date().getFullYear()} Luxe Stay Hotel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
