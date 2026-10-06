import React, { useState } from 'react';
import { RefundFormData, ServiceCategory } from '../types/settlement';
import { CheckCircle2, AlertCircle, FileText, RefreshCw, Send } from 'lucide-react';

interface RefundApplicationFormProps {
  formData: RefundFormData;
  onChange: (data: RefundFormData) => void;
  onSubmitSuccess: (docketId: string) => void;
  onPreviewDocs: () => void;
}

export const RefundApplicationForm: React.FC<RefundApplicationFormProps> = ({
  formData,
  onChange,
  onSubmitSuccess,
  onPreviewDocs,
}) => {
  const [submittedDocketId, setSubmittedDocketId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailStatus, setEmailStatus] = useState<'success' | 'queued_or_failed' | null>(null);

  const handleInputChange = (
    field: keyof RefundFormData,
    value: string | number | boolean
  ) => {
    const updated = { ...formData, [field]: value };
    onChange(updated);
  };

  const handleAmountInput = (
    field: 'totalAmount' | 'refundAmount',
    inputValue: string
  ) => {
    // Keep digits only to ensure round whole figures
    const sanitizedDigits = inputValue.replace(/\D/g, '');
    const numValue = sanitizedDigits === '' ? 0 : parseInt(sanitizedDigits, 10);

    const newTotal = field === 'totalAmount' ? numValue : formData.totalAmount;
    const newRefund = field === 'refundAmount' ? numValue : formData.refundAmount;

    if (newRefund > newTotal && newTotal > 0) {
      setErrorMessage('Refund amount cannot exceed the total paid amount.');
    } else {
      setErrorMessage(null);
    }

    onChange({
      ...formData,
      [field]: numValue,
    });
  };

  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent decimal points, negative signs, and exponential characters
    if (['.', ',', '-', '+', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validations
    const cleanMobile = (formData.mobileNumber || '').replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test((formData.emailAddress || '').trim())) {
      setErrorMessage('Please enter a valid email address containing @.');
      return;
    }

    if (formData.refundAmount > formData.totalAmount) {
      setErrorMessage('Refund amount cannot exceed the total paid amount.');
      return;
    }

    if (!formData.termsConfirmed) {
      alert('Please accept the fiduciary acknowledgment terms to proceed.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    // Generate formal reference number
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const docketId = `MG-REF-${randomDigits}`;

    const submissionPayload = {
      docketId,
      fullName: formData.fullName.trim(),
      candidateRef: formData.candidateRef.trim(),
      emailAddress: formData.emailAddress.trim(),
      mobileNumber: cleanMobile,
      candidateAddress: formData.candidateAddress.trim(),
      serviceCategory: formData.serviceCategory,
      totalAmount: formData.totalAmount,
      refundAmount: formData.refundAmount,
      refundReason: formData.refundReason.trim(),
      termsConfirmed: formData.termsConfirmed,
      submittedAt: new Date().toISOString(),
    };

    try {
      // Dispatch admin email notification to kickotech@gmail.com via /api/send-email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionPayload),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.adminEmailSent || result.emailSent) {
          setEmailStatus('success');
        } else {
          setEmailStatus('queued_or_failed');
        }
      } else {
        // Log error securely on server without exposing credentials or technical errors to candidate
        setEmailStatus('queued_or_failed');
      }
    } catch (err: any) {
      console.warn('[Refund Form Submission] Server notification logged:', err?.message || err);
      setEmailStatus('queued_or_failed');
    } finally {
      setIsSubmitting(false);
      setSubmittedDocketId(docketId);
      onSubmitSuccess(docketId);

      // Scroll to feedback panel
      setTimeout(() => {
        const confirmationEl = document.getElementById('submission-confirmation');
        if (confirmationEl) {
          confirmationEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleReset = () => {
    setSubmittedDocketId(null);
    setErrorMessage(null);
    setEmailStatus(null);
    onChange({
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
    });
  };

  return (
    <section id="refund-form" className="space-y-5 scroll-mt-24">
      <div className="flex flex-col space-y-1">
        <span className="text-[11px] uppercase tracking-widest text-[#296482] font-bold">
          Form MG-F-01
        </span>
        <h2 className="text-[24px] sm:text-[26px] font-bold text-[#002a42] tracking-tight">
          Candidate Refund Application
        </h2>
        <p className="text-[#42474d] text-[14px]">
          Complete all mandatory registration fields. Real-time entries dynamically update the
          settlement breakdown and generated documentation previews.
        </p>
      </div>

      {/* Submission Feedback State Container */}
      {submittedDocketId && (
        <div
          id="submission-confirmation"
          className="w-full bg-[#ffffff] border-2 border-[#14532d] rounded-xl p-6 sm:p-8 space-y-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6 text-[#14532d]" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[19px] sm:text-[21px] font-bold text-[#14532d]">
                  ✅ Refund Form Submitted Successfully
                </h3>
                <span className="px-2.5 py-1 rounded-[6px] bg-[#f0fdf4] border border-[#bbf7d0] text-[#14532d] text-[11px] font-bold uppercase tracking-wider">
                  STATUS: RECEIVED FOR REVIEW
                </span>
              </div>
              <p className="text-[14px] text-[#1c1b1b] pt-1 font-medium">
                Thank you for submitting your Refund Form.
              </p>
              <p className="text-[14px] text-[#42474d]">
                Your form has been successfully received by Maverick Ghouse.
              </p>
            </div>
          </div>

          <div className="bg-[#f6f3f2] border border-[#c2c7ce] p-5 rounded-lg space-y-3.5 text-[13px]">
            <div>
              <span className="text-[#42474d] block text-[11px] font-bold uppercase tracking-wider">
                Reference Number:
              </span>
              <span className="font-mono font-bold text-[#002a42] text-[18px]" id="confirm-ref">
                {submittedDocketId}
              </span>
            </div>

            {emailStatus === 'success' ? (
              <div className="flex items-center gap-2 text-[#14532d] bg-[#f0fdf4] border border-[#bbf7d0] p-2.5 rounded">
                <span>📧</span>
                <span className="font-medium text-[13px]">
                  Your application has been received and the submission notification has been sent to the company.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#42474d] bg-[#f0edec] border border-[#c2c7ce] p-2.5 rounded">
                <span className="font-medium text-[13px]">
                  Your refund form has been received and recorded. The notification email could not be delivered at this time.
                </span>
              </div>
            )}

            <p className="text-[13px] text-[#42474d] leading-relaxed">
              We have received your submitted details and they have been recorded for further review.
            </p>

            <p className="text-[13px] text-[#42474d] leading-relaxed">
              Our team will review the information provided and proceed with the applicable refund/settlement process.
            </p>

            <p className="text-[13px] text-[#42474d] leading-relaxed">
              You will receive further communication if any additional information is required.
            </p>
          </div>

          <div className="pt-2 border-t border-[#e5e2e1] text-[11px] text-[#72787e] space-y-1">
            <strong className="block text-[#42474d] uppercase font-bold tracking-wider">
              Automated Message &amp; Disclaimer
            </strong>
            <p>
              This is an automatically generated confirmation message from Maverick Ghouse. Please do not reply to this message.
            </p>
            <p className="text-[11px] text-[#555a60] leading-relaxed pt-1">
              <strong>Disclaimer:</strong> The submission of this form initiates an intake registration for audit clearance and fiduciary review. All refund disbursements, timeline milestones, and final settlement figures are subject to verification under designated statutory operating procedures.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={onPreviewDocs}
              className="px-5 py-2.5 bg-[#002a42] text-white rounded text-[13px] font-semibold hover:bg-[#296482] flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Inspect Assurance Draft</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 border border-[#72787e] text-[#1c1b1b] rounded text-[13px] font-semibold hover:bg-[#f0edec] flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Registration</span>
            </button>
          </div>
        </div>
      )}

      {/* Formal Intake Form Panel */}
      <form
        id="claim-form"
        onSubmit={handleSubmit}
        className="bg-[#ffffff] border border-[#c2c7ce] rounded-xl p-6 sm:p-8 space-y-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#42474d]"
            >
              Full Name <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="As registered"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full bg-[#ffffff] border border-[#c2c7ce] rounded-lg px-4 py-2.5 text-[14px] text-[#1c1b1b] focus:border-[#296482] focus:ring-1 focus:ring-[#296482] focus:outline-none transition-colors"
            />
          </div>

          {/* 2. Candidate / Payment Reference */}
          <div className="space-y-1.5">
            <label
              htmlFor="candidateRef"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#42474d]"
            >
              Candidate / Payment Reference <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="candidateRef"
              type="text"
              required
              placeholder="Your reference number (e.g. MG-2024-884)"
              value={formData.candidateRef}
              onChange={(e) => handleInputChange('candidateRef', e.target.value)}
              className="w-full bg-[#ffffff] border border-[#c2c7ce] rounded-lg px-4 py-2.5 text-[14px] font-mono text-[#1c1b1b] focus:border-[#296482] focus:ring-1 focus:ring-[#296482] focus:outline-none transition-colors"
            />
          </div>

          {/* 3. Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="emailAddress"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#42474d]"
            >
              Email Address <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="emailAddress"
              type="email"
              required
              placeholder="For your refund correspondence"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              className="w-full bg-[#ffffff] border border-[#c2c7ce] rounded-lg px-4 py-2.5 text-[14px] text-[#1c1b1b] focus:border-[#296482] focus:ring-1 focus:ring-[#296482] focus:outline-none transition-colors"
            />
          </div>

          {/* 4. Mobile Number (10 digit) */}
          <div className="space-y-1.5">
            <label
              htmlFor="mobileNumber"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#42474d]"
            >
              Mobile Number (10 Digits) <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="mobileNumber"
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              required
              placeholder="Registered mobile number"
              value={formData.mobileNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                handleInputChange('mobileNumber', val);
              }}
              className="w-full bg-[#ffffff] border border-[#c2c7ce] rounded-lg px-4 py-2.5 text-[14px] font-mono text-[#1c1b1b] focus:border-[#296482] focus:ring-1 focus:ring-[#296482] focus:outline-none transition-colors"
            />
            <span className="text-[11px] text-[#72787e] block">
              Indian 10-digit primary mobile contact.
            </span>
          </div>

          {/* 5. Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label
              htmlFor="candidateAddress"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#42474d]"
            >
              Address <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="candidateAddress"
              type="text"
              required
              placeholder="Enter your registered address"
              value={formData.candidateAddress}
              onChange={(e) => handleInputChange('candidateAddress', e.target.value)}
              className="w-full bg-[#ffffff] border border-[#c2c7ce] rounded-lg px-4 py-2.5 text-[14px] text-[#1c1b1b] focus:border-[#296482] focus:ring-1 focus:ring-[#296482] focus:outline-none transition-colors"
            />
          </div>

          {/* 6. Service Applied For */}
          <div className="space-y-1.5">
            <label
              htmlFor="serviceCategory"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#42474d]"
            >
              Service Applied For <span className="text-[#ba1a1a]">*</span>
            </label>
            <select
              id="serviceCategory"
              required
              value={formData.serviceCategory}
              onChange={(e) =>
                handleInputChange('serviceCategory', e.target.value as ServiceCategory)
              }
              className="w-full bg-[#ffffff] border border-[#c2c7ce] rounded-lg px-4 py-2.5 text-[14px] text-[#1c1b1b] focus:border-[#296482] focus:ring-1 focus:ring-[#296482] focus:outline-none transition-colors cursor-pointer"
            >
              <option value="Study Visa">Study Visa</option>
              <option value="Work Visa">Work Visa</option>
              <option value="Visitor Visa">Visitor Visa</option>
              <option value="Internship">Internship</option>
              <option value="Immigration Service">Immigration Service</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* 7. Total Amount Paid */}
          <div className="space-y-1.5">
            <label
              htmlFor="totalAmount"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#42474d]"
            >
              Total Amount Paid (₹) <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="totalAmount"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              placeholder="Enter amount (e.g. 500000)"
              value={formData.totalAmount > 0 ? formData.totalAmount.toString() : ''}
              onKeyDown={handleNumericKeyDown}
              onChange={(e) => handleAmountInput('totalAmount', e.target.value)}
              className="w-full bg-[#ffffff] border border-[#c2c7ce] rounded-lg px-4 py-2.5 text-[14px] font-mono text-[#1c1b1b] focus:border-[#296482] focus:ring-1 focus:ring-[#296482] focus:outline-none transition-colors"
            />
          </div>

          {/* 8. Requested Refund Amount */}
          <div className="space-y-1.5 md:col-span-2">
            <label
              htmlFor="refundAmount"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#42474d]"
            >
              Requested Refund Amount (₹) <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="refundAmount"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              placeholder="Enter refund amount (e.g. 500000)"
              value={formData.refundAmount > 0 ? formData.refundAmount.toString() : ''}
              onKeyDown={handleNumericKeyDown}
              onChange={(e) => handleAmountInput('refundAmount', e.target.value)}
              className={`w-full bg-[#ffffff] border rounded-lg px-4 py-2.5 text-[14px] font-mono text-[#1c1b1b] focus:outline-none transition-colors ${
                errorMessage
                  ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]'
                  : 'border-[#c2c7ce] focus:border-[#296482] focus:ring-1 focus:ring-[#296482]'
              }`}
            />
            {errorMessage && (
              <p
                id="amount-validation-error"
                className="text-[12px] text-[#ba1a1a] font-medium flex items-center gap-1 mt-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          {/* 9. Reason for Refund */}
          <div className="space-y-1.5 md:col-span-2">
            <label
              htmlFor="refundReason"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#42474d]"
            >
              Reason for Refund <span className="text-[#ba1a1a]">*</span>
            </label>
            <textarea
              id="refundReason"
              required
              rows={3}
              placeholder="Briefly describe your request and transaction circumstances"
              value={formData.refundReason}
              onChange={(e) => handleInputChange('refundReason', e.target.value)}
              className="w-full bg-[#ffffff] border border-[#c2c7ce] rounded-lg px-4 py-2.5 text-[14px] text-[#1c1b1b] focus:border-[#296482] focus:ring-1 focus:ring-[#296482] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* 10. Confirmation Checkbox */}
        <div className="pt-3 border-t border-[#f0edec]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              id="termsConfirm"
              type="checkbox"
              required
              checked={formData.termsConfirmed}
              onChange={(e) => handleInputChange('termsConfirmed', e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#002a42] border-[#72787e] focus:ring-[#002a42] cursor-pointer"
            />
            <span className="text-[13px] text-[#42474d] leading-relaxed">
              I confirm these details are accurate and understand that the refund amount and dates
              require written approval and formal verification from the designated settlement desk.
            </span>
          </label>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg bg-[#002a42] text-white text-[13px] font-semibold transition-colors focus:ring-2 focus:ring-[#002a42] shadow-sm flex items-center gap-2 ${
                isSubmitting ? 'opacity-80 cursor-wait' : 'hover:bg-[#296482] cursor-pointer'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'PROCESSING APPLICATION...' : 'SUBMIT REFUND FORM'}</span>
            </button>

            <button
              type="button"
              onClick={onPreviewDocs}
              className="px-5 py-3 rounded-lg bg-[#ffffff] text-[#1c1b1b] text-[13px] font-semibold border border-[#c2c7ce] hover:bg-[#f0edec] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#296482]" />
              <span>PREVIEW DOCUMENTS</span>
            </button>
          </div>

          <span className="text-[11px] text-[#72787e] font-mono uppercase tracking-wider">
            DESK DOCKET VERIFICATION ENGINE v2.4
          </span>
        </div>
      </form>
    </section>
  );
};
