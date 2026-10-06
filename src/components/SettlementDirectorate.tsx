import React from 'react';
import { DIRECTORATE_MEMBERS } from '../data/settlementData';

export const SettlementDirectorate: React.FC = () => {
  return (
    <section className="space-y-5">
      <div className="flex flex-col space-y-1">
        <span className="text-[11px] uppercase tracking-widest text-[#296482] font-bold">
          Governance &amp; Oversight
        </span>
        <h2 className="text-[24px] sm:text-[26px] font-bold text-[#002a42] tracking-tight">
          Settlement Directorate
        </h2>
        <p className="text-[14px] text-[#42474d]">
          Designated fiduciary panel entrusted with claim authentication, regulatory adherence, and
          orderly tranches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DIRECTORATE_MEMBERS.map((member) => (
          <div
            key={member.name}
            className="bg-[#ffffff] border border-[#c2c7ce] rounded-xl p-6 flex flex-col justify-between hover:border-[#296482] hover:shadow-sm transition-all"
          >
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-[#296482] font-bold block">
                {member.role}
              </span>
              <div>
                <h3 className="text-[18px] font-bold text-[#1c1b1b]">{member.name}</h3>
                <span className="text-[12px] text-[#72787e] font-medium">{member.title}</span>
              </div>
              <p className="text-[14px] text-[#42474d] leading-relaxed pt-1">
                {member.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#f0edec] flex items-center gap-2 text-[12px] text-[#42474d] font-medium">
              <span className={`w-2.5 h-2.5 rounded-full ${member.badgeColor}`} />
              <span>{member.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
