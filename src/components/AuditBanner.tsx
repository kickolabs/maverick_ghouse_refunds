import React from 'react';

export const AuditBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#17405c] text-white py-2 px-4 sm:px-6 md:px-10 border-b border-[#002a42]">
      <div className="max-w-[1160px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[12px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-[4px] bg-[#296482] text-white text-[11px] font-semibold tracking-wider uppercase">
            DEMO ENVIRONMENT
          </span>
          <span className="text-[#e5e2e1]">
            Live submissions, email delivery and release dates await formal confirmation.
          </span>
        </div>
        <div className="text-[#86accc] font-mono text-[11px] self-end md:self-auto uppercase tracking-wide">
          REFUND DESK AUDIT PROTOCOL · DOCKET DEMO-2025-MG
        </div>
      </div>
    </div>
  );
};
