import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

export const OnboardingPartnerCard: React.FC = () => {
  return (
    <section className="w-full bg-[#17405c] text-white rounded-xl p-6 sm:p-8 md:p-10 border border-[#002a42] shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="space-y-3 max-w-[680px]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#86accc]" />
            <span className="font-semibold text-[11px] uppercase tracking-widest text-[#86accc]">
              WELCOMING OUR ONBOARDING PARTNER
            </span>
          </div>

          <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-bold text-white tracking-tight">
            Mr. Krishnamurthy
          </h2>

          <p className="text-[14px] font-semibold text-[#a4dcfe]">
            Singapore · Refunds &amp; settlements
          </p>

          <p className="text-[#e5e2e1] text-[15px] pt-1 leading-relaxed">
            Our onboarding partner will oversee refund verification, phased settlements,
            reconciliation protocols, and all related candidate communications.
          </p>

          <div className="pt-4 border-t border-[#296482]/60 mt-4">
            <p className="text-[13px] text-[#86accc] italic">
              We sincerely thank Mr. Krishnamurthy for supporting the settlement process and ensuring
              rigorous administrative stewardship.
            </p>
          </div>
        </div>

        {/* Representative Matrix */}
        <div className="bg-[#002a42]/70 border border-[#c2c7ce]/30 rounded-lg p-5 shrink-0 w-full md:w-[280px] space-y-3 shadow-inner">
          <div className="flex items-center justify-between pb-2 border-b border-[#c2c7ce]/20">
            <span className="text-[11px] font-bold uppercase text-[#86accc] tracking-wider">
              Representative Role
            </span>
            <span className="w-2 h-2 rounded-full bg-[#a4dcfe] animate-pulse" />
          </div>

          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between py-1 border-b border-[#c2c7ce]/20">
              <span className="text-[#dcd9d9]">Desk Function:</span>
              <span className="text-white font-medium">Head of Review</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#c2c7ce]/20">
              <span className="text-[#dcd9d9]">Escrow Oversight:</span>
              <span className="text-white font-medium">Phased 35/35/30</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#dcd9d9]">Jurisdiction:</span>
              <span className="text-white font-medium">Singapore / India</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#86accc] flex items-center gap-1.5 border-t border-[#c2c7ce]/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#a4dcfe]" />
            <span>Authorized Escrow Signatory</span>
          </div>
        </div>
      </div>
    </section>
  );
};
