import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { PhaseBreakdown } from '../types/settlement';
import { formatINR } from '../data/settlementData';
import { Calendar, ShieldCheck, PieChart as PieChartIcon } from 'lucide-react';

interface RefundPhasePieChartProps {
  breakdown: PhaseBreakdown;
}

interface ChartDataItem {
  id: string;
  name: string;
  shortName: string;
  value: number;
  percentage: number;
  milestone: string;
  window: string;
  color: string;
  hoverColor: string;
  description: string;
}

export const RefundPhasePieChart: React.FC<RefundPhasePieChartProps> = ({
  breakdown,
}) => {
  const [activeId, setActiveId] = useState<string>('phase1');
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const data: ChartDataItem[] = useMemo(
    () => [
      {
        id: 'phase1',
        name: 'Phase 1 · Verification Tranche',
        shortName: 'Phase 1',
        value: breakdown.phase1,
        percentage: 35,
        milestone: 'Day 45 Milestone',
        window: 'Days 40 - 45',
        color: '#17405c',
        hoverColor: '#002a42',
        description: 'Scheduled verification allocation released upon bank ledger clearance.',
      },
      {
        id: 'phase2',
        name: 'Phase 2 · Mid-term Disbursement',
        shortName: 'Phase 2',
        value: breakdown.phase2,
        percentage: 35,
        milestone: 'Day 55 Milestone',
        window: 'Days 50 - 55',
        color: '#296482',
        hoverColor: '#1f5068',
        description: 'Mid-term disbursement allocation following interim compliance confirmation.',
      },
      {
        id: 'phase3',
        name: 'Phase 3 · Final Resolution Tranche',
        shortName: 'Phase 3',
        value: breakdown.phase3,
        percentage: 30,
        milestone: 'Day 60 Milestone',
        window: 'Days 58 - 60',
        color: '#4a7596',
        hoverColor: '#365a77',
        description: 'Final resolution allocation, mutual statutory release, and formal docket discharge.',
      },
    ],
    [breakdown]
  );

  const activeItem = data.find((d) => d.id === activeId) || data[0];

  // D3 Pie Generator
  const pieArcs = useMemo(() => {
    const pie = d3
      .pie<ChartDataItem>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.035);

    return pie(data);
  }, [data]);

  const width = 280;
  const height = 280;
  const radius = Math.min(width, height) / 2;
  const innerRadius = 66;
  const outerRadius = 104;

  // Arc generators
  const standardArc = d3
    .arc<d3.PieArcDatum<ChartDataItem>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(4);

  const activeArc = d3
    .arc<d3.PieArcDatum<ChartDataItem>>()
    .innerRadius(innerRadius - 3)
    .outerRadius(outerRadius + 8)
    .cornerRadius(5);

  return (
    <div className="bg-[#fcf9f8] border border-[#c2c7ce] rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5e2e1] pb-3">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-[#296482]" />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#296482] block font-mono">
              D3 TRANCHE RATIO VISUALIZATION
            </span>
            <h3 className="text-[16px] sm:text-[17px] font-bold text-[#002a42]">
              Phased 35 / 35 / 30 Allocation Ratio
            </h3>
          </div>
        </div>
        <div className="text-[11px] font-mono text-[#42474d] bg-[#ffffff] px-2.5 py-1 rounded border border-[#c2c7ce] self-start sm:self-auto">
          Hover or click arc slices to inspect tranche
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* D3 SVG Donut Pie Chart */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[280px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] overflow-visible drop-shadow-sm select-none"
            role="img"
            aria-label="35/35/30 Refund Phase Pie Chart"
          >
            <g transform={`translate(${width / 2}, ${height / 2})`}>
              {pieArcs.map((arcData) => {
                const isSelected = arcData.data.id === activeId;
                const pathD = isSelected
                  ? activeArc(arcData) || undefined
                  : standardArc(arcData) || undefined;

                // Center position for subtle slice label
                const [centroidX, centroidY] = standardArc.centroid(arcData);

                return (
                  <g
                    key={arcData.data.id}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={(e) => {
                      setActiveId(arcData.data.id);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                    }}
                    onClick={() => setActiveId(arcData.data.id)}
                  >
                    {/* Main Arc Slice */}
                    <path
                      d={pathD}
                      fill={isSelected ? arcData.data.hoverColor : arcData.data.color}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all duration-200"
                    />

                    {/* Percentage text inside slice */}
                    <text
                      x={centroidX}
                      y={centroidY}
                      dy="0.35em"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={isSelected ? '12px' : '11px'}
                      fontWeight="700"
                      className="pointer-events-none font-mono"
                    >
                      {arcData.data.percentage}%
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Central Donut Hole Typography Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
            <span className="text-[10px] font-mono uppercase font-bold text-[#72787e] block">
              100% TOTAL
            </span>
            <span className="text-[15px] sm:text-[17px] font-bold font-mono text-[#002a42] block leading-tight">
              {formatINR(breakdown.total)}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#296482] font-semibold block pt-0.5">
              3 TRANCHES
            </span>
          </div>
        </div>

        {/* Dynamic Slice Details Inspector & Legend */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Slice Highlighting Card */}
          <div
            className="p-4 rounded-lg border-l-4 transition-all bg-[#ffffff] shadow-sm border border-[#c2c7ce]"
            style={{ borderLeftColor: activeItem.color }}
          >
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#f0edec]">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: activeItem.color }}
                />
                <span className="font-bold text-[#002a42] text-[14px]">
                  {activeItem.name}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#f0edec] text-[#17405c]">
                {activeItem.percentage}% Entitlement
              </span>
            </div>

            <div className="py-2.5 flex items-baseline justify-between">
              <span className="text-[12px] text-[#42474d]">Allocated Sum:</span>
              <span className="font-mono font-bold text-[20px] text-[#002a42]">
                {formatINR(activeItem.value)}
              </span>
            </div>

            <p className="text-[12px] text-[#42474d] leading-relaxed pb-2">
              {activeItem.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#f0edec] text-[11px]">
              <span className="text-[#296482] font-semibold flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{activeItem.milestone}</span>
              </span>
              <span className="text-[#72787e]">•</span>
              <span className="text-[#42474d]">Target Window: {activeItem.window}</span>
            </div>
          </div>

          {/* Interactive Legend Selection Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {data.map((item) => {
              const isSelected = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ffffff] border-[#002a42] shadow-sm ring-1 ring-[#002a42]'
                      : 'bg-[#f6f3f2] border-[#c2c7ce] hover:bg-[#ffffff]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] font-bold text-[#1c1b1b] truncate">
                      {item.shortName}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-[13px] text-[#002a42]">
                    {item.percentage}%
                  </div>
                  <div className="text-[10px] text-[#72787e] font-mono truncate">
                    {formatINR(item.value)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
