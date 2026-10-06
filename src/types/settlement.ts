export type ServiceCategory =
  | 'Study Visa'
  | 'Work Visa'
  | 'Visitor Visa'
  | 'Internship'
  | 'Immigration Service'
  | 'Other';

export interface RefundFormData {
  fullName: string;
  candidateRef: string;
  emailAddress: string;
  mobileNumber: string;
  candidateAddress: string;
  serviceCategory: ServiceCategory;
  totalAmount: number;
  refundAmount: number;
  refundReason: string;
  termsConfirmed: boolean;
}

export interface PhaseBreakdown {
  total: number;
  phase1: number; // 35%
  phase2: number; // 35%
  phase3: number; // 30%
}

export interface DirectorateMember {
  name: string;
  role: string;
  title: string;
  description: string;
  tag: string;
  badgeColor: string;
}

export interface SettlementStage {
  stageNumber: string;
  title: string;
  description: string;
  tag: string;
  sla: string;
  details: string[];
}

export interface TimelineMilestone {
  day: number;
  label: string;
  title: string;
  percentage?: number;
  description: string;
  status: 'completed' | 'current' | 'scheduled';
}

export interface DocketSubmission {
  docketId: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'IN_AUDIT' | 'ASSURANCE_DRAFTED' | 'SETTLEMENT_SCHEDULED';
  data: RefundFormData;
  breakdown: PhaseBreakdown;
}
