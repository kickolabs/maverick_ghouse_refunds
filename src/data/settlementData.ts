import {
  DirectorateMember,
  RefundFormData,
  SettlementStage,
  TimelineMilestone,
  PhaseBreakdown,
} from '../types/settlement';

export const INITIAL_FORM_DATA: RefundFormData = {
  fullName: '',
  candidateRef: '',
  emailAddress: '',
  mobileNumber: '',
  candidateAddress: '',
  serviceCategory: 'Study Visa',
  totalAmount: 100000,
  refundAmount: 100000,
  refundReason: '',
  termsConfirmed: false,
};

export const PRESET_EXAMPLES: { label: string; data: Partial<RefundFormData> }[] = [
  {
    label: 'Study Visa - ₹1,00,000',
    data: {
      fullName: 'Aarav Sharma',
      candidateRef: 'MG-ST-2024-419',
      emailAddress: 'aarav.sharma@example.com',
      mobileNumber: '9876543210',
      candidateAddress: 'Flat 402, Green Avenue, Indiranagar, Bengaluru, KA 560038',
      serviceCategory: 'Study Visa',
      totalAmount: 100000,
      refundAmount: 100000,
      refundReason: 'Program intake deferral occurred. Requested formal phased settlement under the 2025 protocol.',
      termsConfirmed: true,
    },
  },
  {
    label: 'Work Visa - ₹1,75,000',
    data: {
      fullName: 'Priya Narayanan',
      candidateRef: 'MG-WV-2024-812',
      emailAddress: 'priya.n@example.com',
      mobileNumber: '9845123456',
      candidateAddress: '12/B Regency Enclave, Anna Nagar, Chennai, TN 600040',
      serviceCategory: 'Work Visa',
      totalAmount: 200000,
      refundAmount: 175000,
      refundReason: 'Service agreement adjustment post regulatory update. Disputed fees submitted for restitution.',
      termsConfirmed: true,
    },
  },
  {
    label: 'Internship - ₹85,000',
    data: {
      fullName: 'Rohan Deshmukh',
      candidateRef: 'MG-INT-2024-305',
      emailAddress: 'rohan.d@example.com',
      mobileNumber: '9765432109',
      candidateAddress: '74 Sunrise Towers, Viman Nagar, Pune, MH 411014',
      serviceCategory: 'Internship',
      totalAmount: 85000,
      refundAmount: 85000,
      refundReason: 'Candidate withdrawal due to operational deferment by host institution.',
      termsConfirmed: true,
    },
  },
];

export const DIRECTORATE_MEMBERS: DirectorateMember[] = [
  {
    name: 'Mr. Krishnamurthy',
    role: 'REFUNDS & SETTLEMENTS',
    title: 'Head of Review & Onboarding Partner',
    description:
      'Oversees refund verification, ledger clearance, phased settlement computations, and direct candidate communications.',
    tag: 'Primary Verification Desk',
    badgeColor: 'bg-[#296482]',
  },
  {
    name: 'Mr. Shahid',
    role: 'LEGAL & DISPUTE RESOLUTION',
    title: 'Legal Counsel Secretariat',
    description:
      'Handles formal legal matters, regulatory compliance, disputed transaction reconciliations, and related candidate concerns.',
    tag: 'Legal Counsel Secretariat',
    badgeColor: 'bg-[#17405c]',
  },
  {
    name: 'Mr. Ghouse M',
    role: 'SETTLEMENT INVOLVEMENT',
    title: 'Executive Sponsor',
    description:
      'Remains involved in the comprehensive settlement process. All enquiries and submissions must route through designated representatives.',
    tag: 'Executive Sponsor',
    badgeColor: 'bg-[#72787e]',
  },
];

export const SETTLEMENT_STAGES: SettlementStage[] = [
  {
    stageNumber: 'STAGE 01',
    title: 'Register your details',
    description:
      'Candidate submits identity, transaction record reference, contact details, and payment specifics via the standardized desk form.',
    tag: 'Immediate Intake',
    sla: 'Day 1 - Same Day',
    details: [
      'Submission logged into Institutional Audit Protocol (Docket Engine v2.4)',
      'Candidate receives unique docket tracking reference',
      'Initial automated checksum & banking record cross-check',
    ],
  },
  {
    stageNumber: 'STAGE 02',
    title: 'Records are reviewed',
    description:
      'Operational archives and banking records are audited against submitted references to validate financial legitimacy and account identity.',
    tag: 'Audit Verification',
    sla: 'Days 2 - 15',
    details: [
      'Bank statement match with payment gateway or wire records',
      'Verification against service delivery invoices and fee agreements',
      'Legal Secretariat identity authentication check',
    ],
  },
  {
    stageNumber: 'STAGE 03',
    title: 'Refund amount is verified',
    description:
      'Net balance calculations are cleared by the onboarding desk, determining eligible gross and net refund entitlement totals.',
    tag: 'Entitlement Ledger',
    sla: 'Days 16 - 30',
    details: [
      'Deductions/third-party statutory fees audited where applicable',
      'Certified ledger calculation signed off by Head of Review',
      'Candidate notified of verified payable principal',
    ],
  },
  {
    stageNumber: 'STAGE 04',
    title: 'Assurance letter prepared',
    description:
      'Formal institutional Assurance Letter and Settlement Notice are drafted with candidate identification and payment schedules.',
    tag: 'Document Docket',
    sla: 'Days 31 - 44',
    details: [
      'Generation of formal MG-LOA-2025 Letter of Assurance docket',
      'Countersigning by Mr. Krishnamurthy (Onboarding Partner)',
      'Candidate downloads evidentiary preview PDF for legal records',
    ],
  },
  {
    stageNumber: 'STAGE 05',
    title: 'Payment plan confirmed',
    description:
      'The 35% / 35% / 30% structured phased disbursement protocol is calibrated against institutional release windows.',
    tag: 'Tranche Scheduling',
    sla: 'Days 45 - 59',
    details: [
      'Tranche 1 (35%) executed upon initial ledger audit clearance (Day 45)',
      'Tranche 2 (35%) scheduled mid-term disbursement window (Day 55)',
      'Escrow fund reservation confirmed for final tranche release',
    ],
  },
  {
    stageNumber: 'STAGE 06',
    title: 'Confirmation provided',
    description:
      'Written disbursement receipts and final formal completion documentation are transmitted post verified bank clearance.',
    tag: 'Formal Discharge',
    sla: 'Day 60 & Final Close',
    details: [
      'Tranche 3 (30%) final resolution allocation disbursement (Day 60)',
      'Mutual discharge & full statutory claim closure letter executed',
      'Final clearance docket archived in institutional registry',
    ],
  },
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    day: 1,
    label: 'Intake Registration',
    title: 'Candidate Docket Created',
    description: 'Submission received, unique docket ID assigned, queue prioritized.',
    status: 'completed',
  },
  {
    day: 15,
    label: 'Banking & Audit',
    title: 'Ledger Audit Review',
    description: 'Mr. Krishnamurthy desk validates bank remittance records.',
    status: 'current',
  },
  {
    day: 30,
    label: 'Statutory Docket',
    title: 'Entitlement Adjudication',
    description: 'Dispute secretariat confirms final verifiable refund principal.',
    status: 'scheduled',
  },
  {
    day: 45,
    label: 'Tranche 1 Release',
    title: 'Initial 35% Payout',
    percentage: 35,
    description: 'First scheduled tranche transmitted to candidate account.',
    status: 'scheduled',
  },
  {
    day: 55,
    label: 'Tranche 2 Release',
    title: 'Mid-term 35% Payout',
    percentage: 35,
    description: 'Second scheduled tranche transmitted post interim reconciliation.',
    status: 'scheduled',
  },
  {
    day: 60,
    label: 'Final Tranche Release',
    title: 'Final 30% Resolution Payout',
    percentage: 30,
    description: 'Closing payout & mutual statutory discharge receipt issued.',
    status: 'scheduled',
  },
];

export function calculatePhases(amount: number): PhaseBreakdown {
  const safeAmount = Math.max(0, amount || 0);
  const p1 = Math.round(safeAmount * 0.35);
  const p2 = Math.round(safeAmount * 0.35);
  const p3 = safeAmount - (p1 + p2); // guarantees exact sum to 100%
  return {
    total: safeAmount,
    phase1: p1,
    phase2: p2,
    phase3: p3,
  };
}

export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val || 0);
}
