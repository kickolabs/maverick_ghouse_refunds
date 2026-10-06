import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenNotice: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenNotice }) => {
  return (
    <footer className="w-full bg-[#ffffff] border-t border-[#c2c7ce] py-8 sm:py-10 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Shield className="w-4 h-4 text-[#002a42]" />
            <p className="text-[14px] font-bold text-[#002a42] uppercase tracking-wider">
              Maverick Ghouse · Refund &amp; Settlement Desk
            </p>
          </div>
           </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-[#42474d]">
          <button
            type="button"
            onClick={onOpenNotice}
            className="hover:text-[#002a42] underline cursor-pointer"
          >
            Institutional Advisory Notice
          </button>
        </div>

        <p className="text-[12px] text-[#72787e]">
          Developed by Kicko Tech · © 2025 All Rights Reserved
        </p>
      </div>
    </footer>
  );
};
