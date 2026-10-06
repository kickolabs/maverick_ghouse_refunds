import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export interface RefundSubmissionPayload {
  docketId: string;
  fullName: string;
  candidateRef: string;
  emailAddress: string;
  mobileNumber: string;
  candidateAddress: string;
  serviceCategory: string;
  totalAmount: number;
  refundAmount: number;
  refundReason: string;
  termsConfirmed: boolean;
  submittedAt?: string;
}

export interface DualEmailDispatchResult {
  success: boolean;
  adminEmailSent: boolean;
  candidateEmailSent: boolean;
  adminRecipient: string;
  candidateRecipient: string;
  statusMessage: string;
}

const formatCurrencyINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Validates candidate submission data on backend.
 */
export function validateSubmissionPayload(payload: RefundSubmissionPayload): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Full name check
  if (!payload.fullName || payload.fullName.trim().length === 0) {
    errors.push('Candidate name is required.');
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.emailAddress || !emailRegex.test(payload.emailAddress.trim())) {
    errors.push('A valid email address containing @ is required.');
  }

  // Mobile number check (10 digits, stripped spaces)
  const cleanMobile = (payload.mobileNumber || '').replace(/\D/g, '');
  if (cleanMobile.length !== 10) {
    errors.push('Mobile number must be a valid 10-digit number.');
  }

  // Round figure & amount checks
  if (!payload.totalAmount || payload.totalAmount <= 0) {
    errors.push('Total paid amount must be greater than zero.');
  }
  if (!payload.refundAmount || payload.refundAmount <= 0) {
    errors.push('Refund amount must be greater than zero.');
  }
  if (payload.refundAmount > payload.totalAmount) {
    errors.push('Refund amount cannot exceed the total paid amount.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Builds email content for Admin Notification to kickotech@gmail.com
 */
function buildAdminEmailContent(payload: RefundSubmissionPayload) {
  const cleanMobile = (payload.mobileNumber || '').replace(/\D/g, '');
  const candidateName = payload.fullName.trim();
  const subject = `New Refund Form Submission - ${candidateName}`;

  const submissionDate = payload.submittedAt
    ? new Date(payload.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)'
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)';

  // Calculate existing 35% / 35% / 30% payment breakdown
  const refundTotal = payload.refundAmount || 0;
  const phase1 = Math.round(refundTotal * 0.35);
  const phase2 = Math.round(refundTotal * 0.35);
  const phase3 = refundTotal - (phase1 + phase2);

  const formattedTotalPaid = formatCurrencyINR(payload.totalAmount);
  const formattedRefundAmount = formatCurrencyINR(payload.refundAmount);
  const formattedPhase1 = formatCurrencyINR(phase1);
  const formattedPhase2 = formatCurrencyINR(phase2);
  const formattedPhase3 = formatCurrencyINR(phase3);

  const textBody = `
==================================================
MAVERICK GHOUSE
NEW REFUND FORM SUBMISSION
==================================================

A new candidate has submitted the Refund Form.

Candidate Information
━━━━━━━━━━━━━━━━━━━━
Candidate Name: ${candidateName}
Mobile Number: ${cleanMobile}
Email Address: ${payload.emailAddress}
Education / Applied Service: ${payload.serviceCategory}
Registered Address: ${payload.candidateAddress}

Refund Details
━━━━━━━━━━━━━━━━━━━━
Refund Amount: ${formattedRefundAmount}
Total Paid Amount: ${formattedTotalPaid}
Application / Reference Number: ${payload.docketId}
Candidate Reference Code: ${payload.candidateRef}
Submission Date: ${submissionDate}
Reason for Refund: ${payload.refundReason}

Payment Breakdown (35% / 35% / 30%)
━━━━━━━━━━━━━━━━━━━━
First Payment (Phase 1 · 35%): ${formattedPhase1}
Second Payment (Phase 2 · 35%): ${formattedPhase2}
Final Payment (Phase 3 · 30%): ${formattedPhase3}
Total Claim Entitlement: ${formattedRefundAmount}

Additional Information
━━━━━━━━━━━━━━━━━━━━
Fiduciary Terms Confirmed: ${payload.termsConfirmed ? 'Yes' : 'No'}
Desk Verification Engine: v2.4

--------------------------------------------------
This is an automatically generated notification from the Maverick Ghouse Refund Management System.
--------------------------------------------------
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1c1b1b; background-color: #f6f3f2; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #c2c7ce; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
    .header { background-color: #002a42; color: #ffffff; padding: 24px 28px; }
    .header h1 { margin: 0; font-size: 19px; letter-spacing: 0.06em; font-weight: 700; text-transform: uppercase; }
    .header p { margin: 4px 0 0; font-size: 12px; color: #86accc; text-transform: uppercase; letter-spacing: 0.08em; }
    .content { padding: 28px; }
    .intro { font-size: 15px; margin-bottom: 20px; color: #1c1b1b; font-weight: 500; }
    .section-title { font-size: 13px; font-weight: 700; color: #17405c; text-transform: uppercase; letter-spacing: 0.05em; margin: 22px 0 8px; border-bottom: 2px solid #e5e2e1; padding-bottom: 4px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; background: #faf9f9; border-radius: 6px; overflow: hidden; }
    .data-table td { padding: 8px 14px; font-size: 13px; border-bottom: 1px solid #ebe7e7; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table td.label { width: 38%; color: #42474d; font-weight: 600; }
    .data-table td.value { color: #1c1b1b; font-weight: 500; }
    .highlight-amount { color: #002a42; font-weight: 700; font-family: monospace; font-size: 14px; }
    .footer { background-color: #f0edec; padding: 16px 28px; font-size: 12px; color: #42474d; border-top: 1px solid #e5e2e1; text-align: left; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MAVERICK GHOUSE</h1>
      <p>NEW REFUND FORM SUBMISSION</p>
    </div>
    <div class="content">
      <p class="intro">A new candidate has submitted the Refund Form for administrative review.</p>

      <div class="section-title">Candidate Details</div>
      <table class="data-table">
        <tr>
          <td class="label">Candidate Name:</td>
          <td class="value"><strong>${candidateName}</strong></td>
        </tr>
        <tr>
          <td class="label">Mobile Number:</td>
          <td class="value">${cleanMobile}</td>
        </tr>
        <tr>
          <td class="label">Email Address:</td>
          <td class="value">${payload.emailAddress}</td>
        </tr>
        <tr>
          <td class="label">Education / Applied Service:</td>
          <td class="value">${payload.serviceCategory}</td>
        </tr>
        <tr>
          <td class="label">Registered Address:</td>
          <td class="value">${payload.candidateAddress}</td>
        </tr>
      </table>

      <div class="section-title">Refund Details</div>
      <table class="data-table">
        <tr>
          <td class="label">Application / Reference Number:</td>
          <td class="value"><strong style="color: #002a42; font-family: monospace;">${payload.docketId}</strong></td>
        </tr>
        <tr>
          <td class="label">Candidate Reference:</td>
          <td class="value" style="font-family: monospace;">${payload.candidateRef}</td>
        </tr>
        <tr>
          <td class="label">Total Paid Amount:</td>
          <td class="value" style="font-family: monospace;">${formattedTotalPaid}</td>
        </tr>
        <tr>
          <td class="label">Refund Amount:</td>
          <td class="value highlight-amount">${formattedRefundAmount}</td>
        </tr>
        <tr>
          <td class="label">Submission Date & Time:</td>
          <td class="value">${submissionDate}</td>
        </tr>
        <tr>
          <td class="label">Reason for Refund:</td>
          <td class="value">${payload.refundReason}</td>
        </tr>
      </table>

      <div class="section-title">Payment Breakdown (35% / 35% / 30%)</div>
      <table class="data-table">
        <tr>
          <td class="label">First Payment (Phase 1 · 35%):</td>
          <td class="value" style="font-family: monospace;">${formattedPhase1}</td>
        </tr>
        <tr>
          <td class="label">Second Payment (Phase 2 · 35%):</td>
          <td class="value" style="font-family: monospace;">${formattedPhase2}</td>
        </tr>
        <tr>
          <td class="label">Final Payment (Phase 3 · 30%):</td>
          <td class="value" style="font-family: monospace;">${formattedPhase3}</td>
        </tr>
        <tr>
          <td class="label">Total Claim Entitlement:</td>
          <td class="value highlight-amount">${formattedRefundAmount}</td>
        </tr>
      </table>
    </div>
    <div class="footer">
      This is an automatically generated notification from the Maverick Ghouse Refund Management System.
    </div>
  </div>
</body>
</html>
`.trim();

  return { subject, textBody, htmlBody };
}

/**
 * Builds candidate confirmation email content
 */
function buildCandidateConfirmationContent(payload: RefundSubmissionPayload) {
  const subject = `Refund Application Confirmation - ${payload.docketId} | Maverick Ghouse`;
  const formattedTotal = formatCurrencyINR(payload.totalAmount);
  const formattedRefund = formatCurrencyINR(payload.refundAmount);

  const textBody = `
Dear ${payload.fullName},

Thank you for submitting your refund application.

We have successfully received your Refund Form.

Your submitted details are:

Reference Number: ${payload.docketId}
Candidate Name: ${payload.fullName}
Email Address: ${payload.emailAddress}
Mobile Number: ${payload.mobileNumber}
Candidate / Customer Reference: ${payload.candidateRef}
Education / Service Category: ${payload.serviceCategory}
Total Paid Amount: ${formattedTotal}
Requested Refund Amount: ${formattedRefund}
Registered Address: ${payload.candidateAddress}
Reason for Refund: ${payload.refundReason}

Your refund application has been received and is currently under review.

Our team will review the submitted information and proceed with the applicable refund/settlement process.

Please keep your reference number (${payload.docketId}) for future communication regarding your refund application.

Thank you for your patience and cooperation.

Regards,
Refund Support Team
Maverick Ghouse
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1c1b1b; background-color: #f6f3f2; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #c2c7ce; border-radius: 8px; overflow: hidden; }
    .header { background-color: #002a42; color: #ffffff; padding: 22px 24px; text-align: left; }
    .header h1 { margin: 0; font-size: 19px; letter-spacing: 0.05em; font-weight: 700; }
    .header p { margin: 4px 0 0; font-size: 11px; color: #86accc; text-transform: uppercase; letter-spacing: 0.08em; }
    .body { padding: 24px; }
    .details-box { background-color: #f6f3f2; border: 1px solid #e5e2e1; border-radius: 6px; padding: 16px; margin: 18px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #ebe7e7; font-size: 13px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #42474d; font-weight: 600; }
    .detail-value { color: #1c1b1b; font-weight: 500; }
    .footer { background-color: #f0edec; padding: 14px 24px; font-size: 11px; color: #72787e; border-top: 1px solid #e5e2e1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MAVERICK GHOUSE</h1>
      <p>REFUND &amp; SETTLEMENT DESK</p>
    </div>
    <div class="body">
      <p>Dear <strong>${payload.fullName}</strong>,</p>
      <p>Thank you for submitting your refund application. We have successfully received your Refund Form.</p>
      
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Reference Number:</span>
          <span class="detail-value" style="color: #002a42; font-weight: 700; font-family: monospace;">${payload.docketId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Candidate Name:</span>
          <span class="detail-value">${payload.fullName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email Address:</span>
          <span class="detail-value">${payload.emailAddress}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Mobile Number:</span>
          <span class="detail-value">${payload.mobileNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Applied Category:</span>
          <span class="detail-value">${payload.serviceCategory}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total Paid Amount:</span>
          <span class="detail-value">${formattedTotal}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Refund Amount:</span>
          <span class="detail-value" style="color: #17405c; font-weight: 700;">${formattedRefund}</span>
        </div>
      </div>

      <p>Your refund application has been received and is currently under review.</p>
      <p>Our team will review the submitted information and proceed with the applicable refund/settlement process.</p>
      <p>Please keep your reference number (<strong>${payload.docketId}</strong>) for future communication regarding your refund application.</p>
      <p>Thank you for your patience and cooperation.</p>

      <p style="margin-top: 22px;">
        Regards,<br />
        <strong>Refund Support Team</strong><br />
        Maverick Ghouse
      </p>
    </div>
    <div class="footer">
      Automated Message: This is an automatically generated confirmation message from Maverick Ghouse. Please do not reply to this message.
    </div>
  </div>
</body>
</html>
`.trim();

  return { subject, textBody, htmlBody };
}

/**
 * Creates and verifies the real Nodemailer SMTP transporter.
 */
function createSmtpTransporter(): {
  transporter: Transporter | null;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  senderEmail: string;
  adminRecipient: string;
  isConfigured: boolean;
} {
  const senderEmail = process.env.SENDER_EMAIL || 'kickotech@gmail.com';
  const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'kickotech@gmail.com';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER || senderEmail;

  let smtpPass = (
    process.env.SMTP_PASS ||
    process.env.SMTP_PASSWORD ||
    process.env.GMAIL_APP_PASSWORD ||
    process.env.EMAIL_PASS ||
    ''
  ).trim();

  // Strip surrounding quotes if present
  if (
    (smtpPass.startsWith('"') && smtpPass.endsWith('"')) ||
    (smtpPass.startsWith("'") && smtpPass.endsWith("'"))
  ) {
    smtpPass = smtpPass.slice(1, -1).trim();
  }

  // Handle Google App Password formatting with spaces (e.g. 'abcd efgh ijkl mnop')
  if (smtpPass.includes(' ') && smtpPass.replace(/\s+/g, '').length === 16) {
    smtpPass = smtpPass.replace(/\s+/g, '');
  }

  if (!smtpPass) {
    return {
      transporter: null,
      smtpHost,
      smtpPort,
      smtpUser,
      senderEmail,
      adminRecipient,
      isConfigured: false,
    };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  return {
    transporter,
    smtpHost,
    smtpPort,
    smtpUser,
    senderEmail,
    adminRecipient,
    isConfigured: true,
  };
}

/**
 * Primary Email Processor: Sends real emails via Gmail SMTP to kickotech@gmail.com
 * and candidate confirmation email.
 */
export async function processRefundEmailNotifications(
  payload: RefundSubmissionPayload
): Promise<DualEmailDispatchResult> {
  const {
    transporter,
    senderEmail,
    adminRecipient,
    isConfigured,
  } = createSmtpTransporter();

  // If SMTP password is not yet configured in environment
  if (!isConfigured || !transporter) {
    console.log(`[EMAIL] Preparing refund notification for ${adminRecipient}`);
    console.log(`[EMAIL] Refund submission recorded (Reference: ${payload.docketId}). SMTP dispatch awaiting configuration of SMTP_PASS secret.`);

    return {
      success: true,
      adminEmailSent: false,
      candidateEmailSent: false,
      adminRecipient,
      candidateRecipient: payload.emailAddress,
      statusMessage: 'Refund form recorded. SMTP credentials (SMTP_PASS) are awaiting configuration.',
    };
  }

  let adminEmailSent = false;
  let candidateEmailSent = false;

  console.log(`[EMAIL] Preparing refund notification`);
  console.log(`[EMAIL] Recipient: ${adminRecipient}`);
  console.log(`[EMAIL] Connecting to Gmail SMTP`);

  // Verify SMTP Connection
  try {
    await transporter.verify();
    console.log(`[EMAIL] SMTP connection verified`);
  } catch (verifyError: any) {
    console.error(`[EMAIL] Email delivery status: connection check failed (${verifyError?.message || 'SMTP verification error'})`);

    return {
      success: true,
      adminEmailSent: false,
      candidateEmailSent: false,
      adminRecipient,
      candidateRecipient: payload.emailAddress,
      statusMessage: 'Refund form recorded. SMTP connection verification failed.',
    };
  }

  // 1. Send Admin Email Notification to kickotech@gmail.com
  try {
    const adminContent = buildAdminEmailContent(payload);
    console.log(`[EMAIL] Sending refund notification`);
    await transporter.sendMail({
      from: `"Maverick Ghouse Refund Desk" <${senderEmail}>`,
      to: adminRecipient,
      subject: adminContent.subject,
      text: adminContent.textBody,
      html: adminContent.htmlBody,
    });
    console.log(`[EMAIL] Email sent successfully`);
    adminEmailSent = true;
  } catch (sendError: any) {
    console.error(`[EMAIL] Email delivery status: failed (${sendError?.message || 'Failed to send admin notification email'})`);
  }

  // 2. Send Candidate Confirmation Email to candidate's email address
  if (payload.emailAddress && payload.emailAddress.trim().length > 0) {
    try {
      const candidateContent = buildCandidateConfirmationContent(payload);
      console.log(`[EMAIL] Sending candidate confirmation to: ${payload.emailAddress}`);
      await transporter.sendMail({
        from: `"Maverick Ghouse Refund Desk" <${senderEmail}>`,
        to: payload.emailAddress.trim(),
        subject: candidateContent.subject,
        text: candidateContent.textBody,
        html: candidateContent.htmlBody,
      });
      console.log(`[EMAIL] Candidate confirmation email sent successfully`);
      candidateEmailSent = true;
    } catch (candidateError: any) {
      console.error(`[EMAIL] Candidate email delivery status: failed (${candidateError?.message || 'Failed to send candidate confirmation email'})`);
    }
  }

  return {
    success: true,
    adminEmailSent,
    candidateEmailSent,
    adminRecipient,
    candidateRecipient: payload.emailAddress,
    statusMessage: adminEmailSent
      ? 'Email notification sent successfully to kickotech@gmail.com'
      : 'Refund form recorded. The notification email could not be delivered at this time.',
  };
}
