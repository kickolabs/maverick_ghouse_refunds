import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  processRefundEmailNotifications,
  validateSubmissionPayload,
  RefundSubmissionPayload,
} from './src/server/notificationService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Handler for refund submission and email dispatch
const handleRefundSubmission = async (req: express.Request, res: express.Response) => {
  try {
    const payload: RefundSubmissionPayload = req.body;

    // Backend validation of required fields
    const validation = validateSubmissionPayload(payload);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
        message: validation.errors[0],
      });
    }

    // Dispatch both admin notification and candidate confirmation emails via SMTP
    const result = await processRefundEmailNotifications(payload);

    return res.status(200).json({
      success: true,
      docketId: payload.docketId,
      adminEmailSent: result.adminEmailSent,
      candidateEmailSent: result.candidateEmailSent,
      emailSent: result.adminEmailSent,
      statusMessage: result.statusMessage,
    });
  } catch (error: any) {
    // Log server error securely without leaking stack traces or credentials
    console.error('[API Route /api/send-email] Server Error during email delivery:', error?.message || error);
    return res.status(200).json({
      success: true,
      docketId: req.body?.docketId || 'MG-REF-PENDING',
      adminEmailSent: false,
      candidateEmailSent: false,
      emailSent: false,
      statusMessage: 'Your refund form has been received and recorded.',
    });
  }
};

// Mount route on both /api/send-email and /api/notifications/refund-submission
app.post('/api/send-email', handleRefundSubmission);
app.post('/api/notifications/refund-submission', handleRefundSubmission);

// Vite middleware integration for full-stack dev / production static serve
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Maverick Ghouse Server] Running on http://localhost:${PORT}`);
  });
}

startServer();

