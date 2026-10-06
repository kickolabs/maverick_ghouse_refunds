import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatINR } from '../data/settlementData';
import { PhaseBreakdown } from '../types/settlement';

interface DocketStatusLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDocketId?: string;
  activeBreakdown: PhaseBreakdown;
}

export const DocketStatusLookupModal: React.FC<DocketStatusLookupModalProps> = ({
  isOpen,
  onClose,
  defaultDocketId,
  activeBreakdown,
}) => {
  const [searchQuery, setSearchQuery] = useState(defaultDocketId || 'MG-REF-892415');
  const [hasSearched, setHasSearched] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-[#ffffff] text-[#1c1b1b] w-full max-w-[620px] rounded-2xl border border-[#c2c7ce] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#c2c7ce] flex items-center justify-between bg-[#f6f3f2]">
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-[#002a42]" />
            <h3 className="text-[18px] font-bold text-[#002a42]">
              Track Settlement Docket
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#e5e2e1] text-[#42474d] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setHasSearched(true);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
              placeholder="Enter Docket Code (e.g. MG-REF-892415)"
              className="flex-1 px-4 py-2.5 border border-[#c2c7ce] rounded-lg font-mono text-[14px] uppercase focus:border-[#296482] focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#002a42] text-white rounded-lg text-[13px] font-semibold hover:bg-[#296482] transition-colors cursor-pointer"
            >
              Verify
            </button>
          </form>

          {/* Docket Results Card */}
          {hasSearched && (
            <div className="bg-[#f6f3f2] border border-[#c2c7ce] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-3">
                <div>
                  <span className="text-[11px] font-mono text-[#72787e] block">
                    ACTIVE DOCKET CASE ID
                  </span>
                  <span className="font-mono font-bold text-[17px] text-[#002a42]">
                    {searchQuery.trim() || 'MG-REF-892415'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#a4dcfe] text-[#25617f] text-[11px] font-bold uppercase tracking-wider">
                  STAGE 02 · AUDIT REVIEW
                </span>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-[#42474d] tracking-wider block">
                  Docket Adjudication Lifecycle
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-[#ffffff] border border-emerald-300 rounded text-emerald-800 font-semibold">
                    ✓ Stage 01: Intake
                  </div>
                  <div className="p-2 bg-[#ffffff] border-2 border-[#296482] rounded text-[#002a42] font-bold">
                    ⏳ Stage 02: Audit
                  </div>
                  <div className="p-2 bg-[#ffffff] border border-[#e5e2e1] rounded text-[#72787e]">
                    Stage 03: Entitlement
                  </div>
                </div>
              </div>

              {/* Authority & Tranche preview */}
              <div className="grid grid-cols-2 gap-3 text-[12px] pt-1">
                <div className="p-3 bg-[#ffffff] rounded border border-[#e5e2e1]">
                  <span className="text-[#72787e] block">Supervisory Desk:</span>
                  <strong className="text-[#002a42]">Mr. Krishnamurthy</strong>
                  <span className="text-[11px] text-[#42474d] block">Onboarding Partner</span>
                </div>
                <div className="p-3 bg-[#ffffff] rounded border border-[#e5e2e1]">
                  <span className="text-[#72787e] block">Validated Entitlement:</span>
                  <strong className="text-[#002a42] font-mono text-[14px]">
                    {formatINR(activeBreakdown.total)}
                  </strong>
                  <span className="text-[11px] text-[#296482] block font-mono">
                    35% / 35% / 30% Protocol
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#a4dcfe]/20 rounded border border-[#a4dcfe] flex items-start gap-2 text-[12px] text-[#42474d]">
                <Clock className="w-4 h-4 text-[#296482] shrink-0 mt-0.5" />
                <span>
                  Ledger cross-matching is currently in progress. Official assurance release notification
                  will be dispatched upon supervisory clearance.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f6f3f2] border-t border-[#c2c7ce] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#c2c7ce] rounded-lg text-[13px] font-semibold text-[#1c1b1b] hover:bg-[#e5e2e1] cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
