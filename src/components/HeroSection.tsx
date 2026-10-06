import React from 'react';
import { Info, ArrowDown, FileText } from 'lucide-react';

interface HeroSectionProps {
  onOpenNotice: () => void;
  onPreviewDocs: () => void;
  onScrollToForm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenNotice,
  onPreviewDocs,
  onScrollToForm,
}) => {
  return (
    <section className="flex flex-col gap-6 pt-2">
      {/* Category Header Tag */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-1 rounded-[6px] bg-[#ebe7e7] text-[#002a42] text-[11px] font-semibold uppercase tracking-wider">
          Maverick Ghouse Refund Desk
        </span>
        <span className="text-[#c2c7ce]">•</span>
        <span className="text-[11px] uppercase tracking-widest text-[#42474d] font-semibold">
          REFUND · SETTLEMENT · INFORMATION
        </span>
      </div>

      {/* Main Headline */}
      <div className="space-y-4 max-w-[900px]">
        <h1 className="text-[34px] sm:text-[44px] md:text-[52px] font-bold leading-[1.1] text-[#002a42] tracking-tight">
          Your settlement. A clear way forward.
        </h1>
        <p className="text-[15px] sm:text-[17px] text-[#42474d] max-w-[780px] leading-relaxed">
          Register your refund details for administrative review and preview the applicable
          structured settlement documentation. This portal allows candidates to examine phased
          distribution metrics, track docket schedules, and download draft instruments.
        </p>
      </div>

      {/* Quick Action Button Group */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onScrollToForm}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#002a42] text-white text-[13px] font-semibold hover:bg-[#296482] transition-colors focus:ring-2 focus:ring-[#002a42] focus:outline-none shadow-sm cursor-pointer"
        >
          <span>Proceed to Refund Form</span>
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onPreviewDocs}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#ffffff] text-[#1c1b1b] text-[13px] font-semibold border border-[#c2c7ce] hover:bg-[#f0edec] transition-colors focus:ring-2 focus:ring-[#002a42] focus:outline-none cursor-pointer"
        >
          <FileText className="w-4 h-4 text-[#296482]" />
          <span>Preview Documents</span>
        </button>

        <button
          type="button"
          onClick={onOpenNotice}
          className="inline-flex items-center gap-1.5 text-[#296482] hover:text-[#002a42] text-[13px] font-semibold px-2 py-2 underline underline-offset-4 cursor-pointer"
        >
          <Info className="w-4 h-4 text-[#296482]" />
          <span>View Settlement Notice</span>
        </button>
      </div>
    </section>
  );
};
