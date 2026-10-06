import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ImportantNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueToForm: () => void;
}

export const ImportantNoticeModal: React.FC<ImportantNoticeModalProps> = ({
  isOpen,
  onClose,
  onContinueToForm,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="notice-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-[#ffffff] text-[#1c1b1b] w-full max-w-[680px] max-h-[88vh] rounded-2xl border border-[#c2c7ce] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5e7eb] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#17405c] text-[22px]">
              notification_important
            </span>
            <h3 id="modal-title" className="text-[17px] sm:text-[18px] font-bold text-[#17405c] tracking-tight">
              Important settlement update
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close Notice"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f0edec] text-[#42474d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 text-[14px] text-[#1c1b1b] leading-relaxed">
          {/* Primary Statement */}
          <div className="space-y-2">
            <p className="font-semibold text-[#1c1b1b] text-[15px] leading-snug">
              Recent unforeseen circumstances have disrupted operations and caused hardship for
              candidates. We recognise your concerns and remain committed to resolving outstanding
              refunds.
            </p>
            <p className="text-[#4b5563] text-[13px] leading-relaxed">
              Our office will operate as usual and remain a constant, accountable point of contact
              throughout the phased settlement procedure.
            </p>
          </div>

          {/* Section: Your designated team */}
          <div className="space-y-2 pt-1">
            <span className="text-[12px] uppercase tracking-wider text-[#17405c] font-bold block">
              YOUR DESIGNATED TEAM
            </span>
            <div className="space-y-2.5 bg-[#f8f9fa] border border-[#e5e7eb] p-4 rounded-xl text-[13px]">
              <div className="border-b border-[#e5e7eb] pb-2.5">
                <strong className="text-[#111827] block text-[15px] font-bold">
                  Mr. Krishnamurthy
                </strong>
                <span className="text-[#4b5563] text-[13px]">
                  Oversees refund verification, phased settlement audits, and candidate communication lines.
                </span>
              </div>
              <div className="border-b border-[#e5e7eb] pb-2.5">
                <strong className="text-[#111827] block text-[15px] font-bold">
                  Mr. Shahid
                </strong>
                <span className="text-[#4b5563] text-[13px]">
                  Manages legal framework compliance, dispute resolutions, and formal claimant correspondence.
                </span>
              </div>
              <div>
                <strong className="text-[#111827] block text-[15px] font-bold">
                  Mr. Ghouse M
                </strong>
                <span className="text-[#4b5563] text-[13px]">
                  Remains involved in the overall settlement process. All enquiries must be directed
                  through designated representatives.
                </span>
              </div>
            </div>
          </div>

          {/* Section: Communication & office visits */}
          <div className="space-y-1">
            <span className="text-[12px] uppercase tracking-wider text-[#17405c] font-bold block">
              COMMUNICATION &amp; OFFICE VISITS
            </span>
            <p className="text-[13px] text-[#4b5563] leading-relaxed">
              To ensure orderly docket handling and accurate review, all office visits and formal
              consultations require an assigned docket appointment. Please submit your refund record
              online prior to scheduling in-person consultations.
            </p>
          </div>

          {/* Demo Advisory Callout */}
          <div className="p-4 bg-[#edf5fa] border-l-4 border-[#002a42] rounded-r text-[13px] text-[#1c1b1b] space-y-1">
            <strong className="text-[11px] uppercase tracking-wider font-bold text-[#002a42] block">
              DEMO ADVISORY NOTICE
            </strong>
            <p className="text-[#4b5563] text-[13px] leading-relaxed">
              This is a demo. Live submissions, email delivery; release dates await confirmation.
              Calculations provided are illustrative and subject to verification and written confirmation.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#e5e7eb] bg-white flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#c2c7ce] text-[#1c1b1b] bg-[#f8f9fa] hover:bg-[#e5e7eb] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Dismiss Notice
          </button>
          <button
            type="button"
            onClick={onContinueToForm}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#002a42] text-white hover:bg-[#17405c] text-[13px] font-bold tracking-wider transition-colors cursor-pointer uppercase"
          >
            CONTINUE TO REFUND FORM
          </button>
        </div>
      </div>
    </div>
  );
};
