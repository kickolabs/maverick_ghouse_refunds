import React, { useState } from 'react';
import { Menu, X, Shield, Search } from 'lucide-react';

interface NavbarProps {
  onOpenNotice: () => void;
  onOpenDocketLookup: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotice,
  onOpenDocketLookup,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Refund Form', href: '#refund-form', id: 'refund-form' },
    { label: 'Settlement Plan', href: '#settlement-plan', id: 'settlement-plan' },
    { label: 'Documents', href: '#documents', id: 'documents' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#ffffff] border-b border-[#c2c7ce] transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Brand Lockup */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#17405c] rounded">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-[#002a42] text-[17px] sm:text-[18px] uppercase font-sans">
              MAVERICK GHOUSE
            </span>
            <span className="hidden sm:inline-block w-px h-5 bg-[#c2c7ce]" />
            <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-widest text-[#42474d]">
              REFUND &amp; SETTLEMENT DESK
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-5 text-[13px] font-semibold">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`transition-colors py-1 ${
                  activeSection === link.id
                    ? 'text-[#002a42] border-b-2 border-[#002a42]'
                    : 'text-[#42474d] hover:text-[#002a42]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onOpenNotice}
              className="text-[#296482] hover:text-[#002a42] transition-colors py-1 flex items-center gap-1 cursor-pointer font-semibold"
            >
              Important Notice
            </button>
          </nav>

          <div className="flex items-center gap-3 pl-2 border-l border-[#c2c7ce]">
            {/* <button
              type="button"
              onClick={onOpenDocketLookup}
              className="text-[12px] font-semibold text-[#17405c] bg-[#f0edec] hover:bg-[#e5e2e1] px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Track submitted docket status"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Docket</span>
            </button> */}

            {/* <div
              className="w-8 h-8 rounded-full bg-[#002a42] text-white flex items-center justify-center shrink-0 cursor-default select-none shadow-sm"
              title="Administrative Desk Officer"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div> */}
          </div>
        </div>

        {/* Mobile Action & Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onOpenDocketLookup}
            className="text-[12px] font-semibold text-[#17405c] bg-[#f0edec] px-2.5 py-1.5 rounded flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px]">Track</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded text-[#42474d] hover:text-[#002a42] hover:bg-[#f6f3f2]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#c2c7ce] bg-[#ffffff] px-4 py-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e5e2e1] text-[11px] text-[#42474d] font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-[#296482]" />
            Maverick Ghouse Escrow &amp; Restitution
          </div>
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[14px] font-medium text-[#1c1b1b] hover:text-[#296482] py-1.5 px-2 rounded hover:bg-[#f6f3f2]"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenNotice();
              }}
              className="text-left text-[14px] font-semibold text-[#296482] hover:text-[#002a42] py-1.5 px-2 rounded hover:bg-[#f6f3f2] flex items-center justify-between"
            >
              <span>Important Settlement Notice</span>
              <span className="text-[10px] bg-[#a4dcfe] text-[#25617f] px-1.5 py-0.5 rounded font-bold uppercase">
                Advisory
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
