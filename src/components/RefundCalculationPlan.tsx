import React from 'react';
import { formatINR } from '../data/settlementData';
import { PhaseBreakdown } from '../types/settlement';
import { Calculator, ShieldCheck, Calendar, ArrowRight, PieChart as PieChartIcon } from 'lucide-react';
import { RefundPhasePieChart } from './RefundPhasePieChart';

interface RefundCalculationPlanProps {
  breakdown: PhaseBreakdown;
  refundAmount: number;
  onAmountChange?: (newVal: number) => void;
  onScrollToForm: () => void;
}

export const RefundCalculationPlan: React.FC<RefundCalculationPlanProps> = ({
  breakdown,
  refundAmount,
  onAmountChange,
  onScrollToForm,
}) => {
  return (
    <section id="settlement-plan" className="space-y-5 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="flex flex-col space-y-1">
          <span className="text-[11px] uppercase tracking-widest text-[#296482] font-bold">
            Fiduciary Distribution Protocol
          </span>
          <h2 className="text-[24px] sm:text-[26px] font-bold text-[#002a42] tracking-tight">
            Refund Calculation Plan (35% / 35% / 30%)
          </h2>
          <p className="text-[#42474d] text-[14px]">
            Statutory 3-tranche payout mechanism designed to ensure escrow stability and verified
            account reconciliation.
          </p>
        </div>

        <div className="bg-[#f0edec] px-4 py-2 rounded-lg flex items-center gap-3 shrink-0">
          <span className="text-[12px] text-[#42474d] font-semibold">Total Claim Entitlement:</span>
          <span
            id="calc-total-amount"
            className="text-[18px] font-bold font-mono text-[#002a42]"
          >
            {formatINR(breakdown.total)}
          </span>
        </div>
      </div>

      {/* Interactive Pie Chart Visualization */}
      <RefundPhasePieChart breakdown={breakdown} />

      {/* Visual Proportional Bar & Tranche Metric Cards */}
      <div className="bg-[#ffffff] border border-[#c2c7ce] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[12px] font-semibold text-[#42474d]">
            <span>Tranche Allocation Distribution</span>
            <span>100% of Verified Net Sum</span>
          </div>
          <div className="w-full h-3.5 bg-[#f0edec] rounded-full overflow-hidden flex">
            <div
              className="bg-[#17405c] h-full transition-all duration-300 relative group"
              style={{ width: '35%' }}
              title="Phase 1: 35%"
            />
            <div
              className="bg-[#296482] h-full transition-all duration-300 relative group"
              style={{ width: '35%' }}
              title="Phase 2: 35%"
            />
            <div
              className="bg-[#4a7596] h-full transition-all duration-300 relative group"
              style={{ width: '30%' }}
              title="Phase 3: 30%"
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[#72787e] pt-0.5">
            <span className="text-[#17405c] font-semibold">● Phase 1 (35%)</span>
            <span className="text-[#296482] font-semibold">● Phase 2 (35%)</span>
            <span className="text-[#4a7596] font-semibold">● Phase 3 (30%)</span>
          </div>
        </div>

        {/* 3 Tranche Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Phase 1 Card */}
          <div className="bg-[#f6f3f2] border border-[#c2c7ce] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#17405c] font-mono">
                PHASE 01 · 35%
              </span>
              <span className="text-[11px] bg-[#e5e2e1] text-[#17405c] px-2 py-0.5 rounded font-mono font-medium">
                Day 45 Milestone
              </span>
            </div>
            <div
              id="calc-p1-amount"
              className="text-[22px] font-bold font-mono text-[#17405c]"
            >
              {formatINR(breakdown.phase1)}
            </div>
            <p className="text-[12px] text-[#42474d]">
              Scheduled verification allocation released upon bank ledger clearance.
            </p>
            <div className="pt-2 border-t border-[#e5e2e1] text-[11px] text-[#72787e] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#17405c]" />
              <span>Release Window: Days 40 - 45</span>
            </div>
          </div>

          {/* Phase 2 Card */}
          <div className="bg-[#f6f3f2] border border-[#c2c7ce] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#296482] font-mono">
                PHASE 02 · 35%
              </span>
              <span className="text-[11px] bg-[#e5e2e1] text-[#296482] px-2 py-0.5 rounded font-mono font-medium">
                Day 55 Milestone
              </span>
            </div>
            <div
              id="calc-p2-amount"
              className="text-[22px] font-bold font-mono text-[#296482]"
            >
              {formatINR(breakdown.phase2)}
            </div>
            <p className="text-[12px] text-[#42474d]">
              Mid-term disbursement allocation following interim compliance confirmation.
            </p>
            <div className="pt-2 border-t border-[#e5e2e1] text-[11px] text-[#72787e] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#296482]" />
              <span>Release Window: Days 50 - 55</span>
            </div>
          </div>

          {/* Phase 3 Card */}
          <div className="bg-[#f6f3f2] border border-[#c2c7ce] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a7596] font-mono">
                PHASE 03 · 30%
              </span>
              <span className="text-[11px] bg-[#e5e2e1] text-[#4a7596] px-2 py-0.5 rounded font-mono font-medium">
                Day 60 Milestone
              </span>
            </div>
            <div
              id="calc-p3-amount"
              className="text-[22px] font-bold font-mono text-[#4a7596]"
            >
              {formatINR(breakdown.phase3)}
            </div>
            <p className="text-[12px] text-[#42474d]">
              Final resolution allocation, mutual statutory release, and formal docket discharge.
            </p>
            <div className="pt-2 border-t border-[#e5e2e1] text-[11px] text-[#72787e] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4a7596]" />
              <span>Release Window: Days 58 - 60</span>
            </div>
          </div>
        </div>

        {/* Quick Calculator Tooltip / Jump to Form */}
        <div className="pt-3 border-t border-[#f0edec] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-[#42474d]">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#296482]" />
            <span>
              Values adapt in real time to the refund amount entered in Candidate Form MG-F-01.
            </span>
          </div>

          <button
            type="button"
            onClick={onScrollToForm}
            className="text-[#296482] hover:text-[#002a42] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Update Amount in Application Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
