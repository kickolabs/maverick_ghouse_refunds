import React, { useState } from 'react';
import { RefundFormData, PhaseBreakdown } from '../types/settlement';
import { formatINR } from '../data/settlementData';
import { Printer, Download, Check, ShieldAlert, Award, FileCheck } from 'lucide-react';

interface EvidentiaryDocumentPreviewsProps {
  formData: RefundFormData;
  breakdown: PhaseBreakdown;
  activeTab: 'assurance' | 'notice';
  onTabChange: (tab: 'assurance' | 'notice') => void;
}

export const EvidentiaryDocumentPreviews: React.FC<EvidentiaryDocumentPreviewsProps> = ({
  formData,
  breakdown,
  activeTab,
  onTabChange,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const candidateName = formData.fullName.trim() || 'Candidate Name (Pending Entry)';
  const fileRef = formData.candidateRef.trim() || 'REF-PENDING-ENTRY';
  const serviceCat = formData.serviceCategory || 'Study Visa';

  const today = new Date();
  const formattedDate = today
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDoc = (docType: 'Assurance_Letter' | 'Settlement_Notice') => {
    // Generate text/markdown docket export
    const title =
      docType === 'Assurance_Letter'
        ? 'FORMAL LETTER OF ASSURANCE - MAVERICK GHOUSE'
        : 'FORMAL SETTLEMENT NOTICE - LEGAL & DISPUTE SECRETARIAT';

    const content = `
================================================================================
${title}
DATE: ${formattedDate}
STATUS: DEMO PREVIEW · DOCKET AUDIT PROTOCOL
================================================================================

CANDIDATE INFORMATION:
----------------------
Candidate Name:    ${candidateName}
File Reference:    ${fileRef}
Service Category:  ${serviceCat}
Total Entitlement: ${formatINR(breakdown.total)}

STRUCTURED 35% / 35% / 30% DISTRIBUTION BREAKDOWN:
--------------------------------------------------
* Phase 1 (35%):   ${formatINR(breakdown.phase1)} (Day 45 Milestone - Verification Allocation)
* Phase 2 (35%):   ${formatINR(breakdown.phase2)} (Day 55 Milestone - Mid-term Disbursement)
* Phase 3 (30%):   ${formatINR(breakdown.phase3)} (Day 60 Milestone - Final Closure Allocation)

DESK AUTHORITIES & OVERSIGHT:
-----------------------------
Onboarding Partner:   Mr. Krishnamurthy (Singapore · Refunds & Settlements)
Legal Secretariat:    Mr. Shahid (Legal & Dispute Resolution)
Executive Sponsor:    Mr. Ghouse M

VERIFICATION CAVEAT:
-------------------
This draft document conveys institutional intent. Live disbursements, banking release
dates, and value credits remain contingent on written notification by desk representatives.

================================================================================
MAVERICK GHOUSE REFUND & SETTLEMENT DESK · DOCKET DEMO-2025-MG
================================================================================
`.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docType}_${fileRef.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(docType);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <section id="documents" className="space-y-5 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-widest text-[#296482] font-bold">
            Evidentiary Documentation
          </span>
          <h2 className="text-[24px] sm:text-[26px] font-bold text-[#002a42] tracking-tight">
            Instrument Previews
          </h2>
          <p className="text-[#42474d] text-[14px]">
            Examine real-time generated statutory settlement dockets.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-[#ebe7e7] p-1 rounded-lg">
          <button
            type="button"
            id="tab-btn-assurance"
            onClick={() => onTabChange('assurance')}
            className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'assurance'
                ? 'bg-[#ffffff] text-[#002a42] shadow-sm font-bold'
                : 'text-[#42474d] hover:text-[#1c1b1b]'
            }`}
          >
            Assurance Letter
          </button>
          <button
            type="button"
            id="tab-btn-notice"
            onClick={() => onTabChange('notice')}
            className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'notice'
                ? 'bg-[#ffffff] text-[#002a42] shadow-sm font-bold'
                : 'text-[#42474d] hover:text-[#1c1b1b]'
            }`}
          >
            Settlement Notice
          </button>
        </div>
      </div>

      {/* Document Display Shell */}
      <div className="printable-document bg-[#ffffff] border border-[#c2c7ce] rounded-xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Watermark / Demo Badge */}
        <div className="flex flex-wrap items-center justify-end gap-2 pb-4 border-b border-[#e5e2e1] mb-6">
          <span className="px-2.5 py-0.5 rounded-[4px] bg-[#ffdad6] text-[#93000a] font-mono text-[11px] font-bold">
            DEMO PREVIEW — NOT FINAL
          </span>
          <span className="px-2.5 py-0.5 rounded-[4px] bg-[#ebe7e7] text-[#42474d] font-mono text-[11px]">
            STATUS: PREVIEW / DEMO
          </span>
        </div>

        {/* 1. TAB: ASSURANCE LETTER */}
        {activeTab === 'assurance' && (
          <div className="space-y-6" id="doc-tab-assurance">
            <div className="space-y-1.5">
              <div className="text-[12px] uppercase tracking-widest text-[#296482] font-bold font-mono">
                MAVERICK GHOUSE REFUND &amp; SETTLEMENT DESK
              </div>
              <h3 className="text-[24px] sm:text-[28px] font-bold text-[#002a42] tracking-tight">
                FORMAL LETTER OF ASSURANCE
              </h3>
              <p className="text-[12px] text-[#72787e] font-mono">
                DOCUMENT IDENTIFIER: MG-LOA-2025-PREVIEW · DATE:{' '}
                <span id="doc-date-loa" className="font-semibold text-[#1c1b1b]">
                  {formattedDate}
                </span>
              </p>
            </div>

            {/* Candidate Metadata Summary Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f6f3f2] p-5 sm:p-6 rounded-lg text-[13px]">
              <div>
                <span className="text-[#42474d] block text-[11px] font-bold uppercase tracking-wider">
                  CANDIDATE NAME:
                </span>
                <strong className="text-[#1c1b1b] text-[15px]" id="preview-loa-name">
                  {candidateName}
                </strong>
              </div>
              <div>
                <span className="text-[#42474d] block text-[11px] font-bold uppercase tracking-wider">
                  FILE REFERENCE:
                </span>
                <strong
                  className="text-[#1c1b1b] font-mono text-[15px]"
                  id="preview-loa-ref"
                >
                  {fileRef}
                </strong>
              </div>
              <div>
                <span className="text-[#42474d] block text-[11px] font-bold uppercase tracking-wider">
                  SERVICE CATEGORY:
                </span>
                <span className="text-[#1c1b1b] font-medium" id="preview-loa-service">
                  {serviceCat}
                </span>
              </div>
              <div>
                <span className="text-[#42474d] block text-[11px] font-bold uppercase tracking-wider">
                  TOTAL ENTITLEMENT ADJUDICATED:
                </span>
                <span
                  className="text-[#002a42] font-bold font-mono text-[17px]"
                  id="preview-loa-amount"
                >
                  {formatINR(breakdown.total)}
                </span>
              </div>
            </div>

            {/* Legal Statement Content */}
            <div className="space-y-4 text-[14px] text-[#1c1b1b] leading-relaxed">
              <p>
                This Letter of Assurance serves as formal administrative acknowledgment that
                Maverick Ghouse Refund &amp; Settlement Desk, in coordination with designated
                onboarding partner Mr. Krishnamurthy, has documented the aforementioned candidate
                refund requisition.
              </p>
              <p>
                Subject to file authentication and written treasury confirmation, the requested sum
                of{' '}
                <strong id="preview-loa-amount-text" className="font-bold text-[#002a42]">
                  {formatINR(breakdown.total)}
                </strong>{' '}
                is structured under the institutional 35% / 35% / 30% phase plan:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[13px] text-[#42474d]">
                <li>
                  Phase 1 (35%):{' '}
                  <strong className="text-[#1c1b1b] font-mono" id="preview-loa-p1">
                    {formatINR(breakdown.phase1)}
                  </strong>{' '}
                  — Scheduled verification allocation.
                </li>
                <li>
                  Phase 2 (35%):{' '}
                  <strong className="text-[#1c1b1b] font-mono" id="preview-loa-p2">
                    {formatINR(breakdown.phase2)}
                  </strong>{' '}
                  — Mid-term disbursement allocation.
                </li>
                <li>
                  Phase 3 (30%):{' '}
                  <strong className="text-[#1c1b1b] font-mono" id="preview-loa-p3">
                    {formatINR(breakdown.phase3)}
                  </strong>{' '}
                  — Final resolution allocation and mutual release.
                </li>
              </ul>
              <p className="text-[12px] text-[#72787e] italic pt-1">
                Verification Notice: This draft document conveys institutional intent. Live
                disbursements and exact value dates remain contingent on written notification by
                desk representatives.
              </p>
            </div>

            {/* Countersignature & Actions */}
            <div className="pt-6 border-t border-[#c2c7ce] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#42474d]">
                  COUNTERSIGNED DESK AUTHORITY
                </div>
                <div className="text-[18px] font-bold text-[#002a42] flex items-center gap-2">
                  <span>Mr. Krishnamurthy</span>
                  <Award className="w-4 h-4 text-[#296482]" />
                </div>
                <div className="text-[12px] text-[#72787e]">
                  Onboarding Partner · Settlements Desk
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 no-print">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 border border-[#c2c7ce] rounded-lg text-[13px] font-semibold text-[#1c1b1b] hover:bg-[#f0edec] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Letter</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDoc('Assurance_Letter')}
                  className="px-4 py-2 bg-[#002a42] text-white rounded-lg text-[13px] font-semibold hover:bg-[#296482] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {downloadSuccess === 'Assurance_Letter' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Save Docket</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB: SETTLEMENT NOTICE */}
        {activeTab === 'notice' && (
          <div className="space-y-6" id="doc-tab-notice">
            <div className="space-y-1.5">
              <div className="text-[12px] uppercase tracking-widest text-[#296482] font-bold font-mono">
                LEGAL &amp; DISPUTE SECRETARIAT
              </div>
              <h3 className="text-[24px] sm:text-[28px] font-bold text-[#002a42] tracking-tight">
                FORMAL SETTLEMENT NOTICE
              </h3>
              <p className="text-[12px] text-[#72787e] font-mono">
                DOCKET CASE CODE: MG-SN-8924 · DISPUTE DESK: MR. SHAHID
              </p>
            </div>

            {/* Beneficiary Matrix */}
            <div className="bg-[#f6f3f2] p-5 sm:p-6 rounded-lg space-y-2.5 text-[13px]">
              <div className="flex justify-between items-center border-b border-[#e5e2e1] pb-2">
                <span className="text-[#42474d]">Registered Beneficiary:</span>
                <span className="font-bold text-[#1c1b1b]" id="preview-sn-name">
                  {candidateName}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#e5e2e1] pb-2">
                <span className="text-[#42474d]">Assigned Reference Code:</span>
                <span className="font-mono font-bold text-[#1c1b1b]" id="preview-sn-ref">
                  {fileRef}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#e5e2e1] pb-2">
                <span className="text-[#42474d]">Validated Claim Amount:</span>
                <span
                  className="font-bold font-mono text-[#002a42] text-[16px]"
                  id="preview-sn-amount"
                >
                  {formatINR(breakdown.total)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#42474d]">Scheduled Tranche Plan:</span>
                <span className="font-medium text-[#1c1b1b]">
                  35% / 35% / 30% Schedule (Days 45, 55, 60)
                </span>
              </div>
            </div>

            {/* Legal Statement Content */}
            <div className="space-y-4 text-[14px] text-[#1c1b1b] leading-relaxed">
              <h4 className="text-[16px] font-semibold text-[#002a42]">
                Notice of Restitution Framework
              </h4>
              <p>
                Please take notice that all formal refund requests lodged with Maverick Ghouse are
                processed pursuant to the Settlement Protocol of 2025. This notice stipulates the
                phased release framework agreed to maintain operational liquidity and equal
                candidate parity.
              </p>

              {/* 3 Tranches */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[13px] pt-1">
                <div className="p-3 bg-[#f0edec] rounded border border-[#c2c7ce]">
                  <span className="block text-[#296482] font-bold text-[11px]">DAY 45 TRANCHE</span>
                  <span className="text-[#1c1b1b] font-bold text-[16px]" id="preview-sn-p1">
                    {formatINR(breakdown.phase1)}
                  </span>
                  <span className="block text-[11px] text-[#72787e]">Review &amp; Release 1</span>
                </div>
                <div className="p-3 bg-[#f0edec] rounded border border-[#c2c7ce]">
                  <span className="block text-[#296482] font-bold text-[11px]">DAY 55 TRANCHE</span>
                  <span className="text-[#1c1b1b] font-bold text-[16px]" id="preview-sn-p2">
                    {formatINR(breakdown.phase2)}
                  </span>
                  <span className="block text-[11px] text-[#72787e]">Review &amp; Release 2</span>
                </div>
                <div className="p-3 bg-[#f0edec] rounded border border-[#c2c7ce]">
                  <span className="block text-[#296482] font-bold text-[11px]">DAY 60 TRANCHE</span>
                  <span className="text-[#1c1b1b] font-bold text-[16px]" id="preview-sn-p3">
                    {formatINR(breakdown.phase3)}
                  </span>
                  <span className="block text-[11px] text-[#72787e]">Final Closure Release</span>
                </div>
              </div>

              <div className="p-3 bg-[#ffdad6]/40 rounded border border-[#ffdad6] flex items-start gap-2 text-[12px] text-[#ba1a1a]">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Binding Caveat:</strong> Release dates await final written confirmation.
                  Do not treat milestone representations as bank guarantee commitments.
                </span>
              </div>
            </div>

            {/* Countersignature & Actions */}
            <div className="pt-6 border-t border-[#c2c7ce] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#42474d]">
                  LEGAL SUPERVISOR
                </div>
                <div className="text-[18px] font-bold text-[#002a42]">Mr. Shahid</div>
                <div className="text-[12px] text-[#72787e]">Legal &amp; Dispute Secretariat</div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 no-print">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 border border-[#c2c7ce] rounded-lg text-[13px] font-semibold text-[#1c1b1b] hover:bg-[#f0edec] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Notice</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDoc('Settlement_Notice')}
                  className="px-4 py-2 bg-[#002a42] text-white rounded-lg text-[13px] font-semibold hover:bg-[#296482] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {downloadSuccess === 'Settlement_Notice' ? (
                    <>
                      <FileCheck className="w-4 h-4 text-emerald-300" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Save Notice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
