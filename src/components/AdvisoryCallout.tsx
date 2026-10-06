import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AdvisoryCallout: React.FC = () => {
  return (
    <section className="w-full bg-[#a4dcfe]/20 border-l-4 border-[#002a42] p-5 sm:p-6 rounded-r-lg">
      <div className="flex items-start gap-3 sm:gap-4">
        <ShieldCheck className="w-6 h-6 text-[#002a42] mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-[13px] font-semibold text-[#002a42] tracking-wide uppercase">
            Operational Fiduciary Advisory
          </p>
          <p className="text-[#42474d] text-[14px] leading-relaxed">
            This is a demonstration portal. Live submissions, email delivery and designated release
            dates await confirmation. Payment calculations, schedules and document previews
            generated herein are purely illustrative and strictly subject to verification and
            written confirmation.
          </p>
        </div>
      </div>
    </section>
  );
};
