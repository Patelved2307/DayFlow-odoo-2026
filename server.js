import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Transporter Cache
let testTransporter = null;

async function getTransporter() {
  if (testTransporter) return testTransporter;

  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    !process.env.SMTP_USER.includes('your-email') &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_PASS.includes('your-app-password')
  ) {
    testTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate Ethereal SMTP test account automatically
    try {
      const testAccount = await nodemailer.createTestAccount();
      testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`[NexaWork Email Engine] Initialized Ethereal SMTP test account (${testAccount.user})`);
    } catch (err) {
      console.warn('[NexaWork Email Engine] Failed to create test account, falling back to JSON simulation', err);
      return null;
    }
  }
  return testTransporter;
}

// Creative Responsive HTML Email Template Generator
function buildEmailHTML(type, data) {
  const brandGreen = '#006837';
  const brandDark = '#0B1E17';
  const bgLight = '#F4F6F5';

  const headerHTML = `
    <div style="background-color: ${brandDark}; padding: 24px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;">
      <div style="display: inline-block; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
        Nexa<span style="color: #34D399;">Work</span>
      </div>
      <div style="color: #A7F3D0; font-size: 10px; font-weight: 600; text-transform: uppercase; tracking: 1.5px; margin-top: 4px;">
        EVERY WORKDAY, PERFECTLY ALIGNED.
      </div>
    </div>
  `;

  const footerHTML = `
    <div style="background-color: #EBF5F0; padding: 20px; text-align: center; font-size: 11px; color: #6B7280; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; margin-top: 24px;">
      <p style="margin: 0 0 6px 0;"><strong>NexaWork Enterprise Alignment Suite</strong></p>
      <p style="margin: 0;">Automated notification sent directly to your employee portal inbox.</p>
      <p style="margin: 6px 0 0 0; color: #9CA3AF;">© 2026 NexaWork Inc. All rights reserved.</p>
    </div>
  `;

  let bodyContent = '';

  switch (type) {
    case 'WELCOME':
      bodyContent = `
        <h2 style="color: ${brandDark}; margin-top: 0; font-size: 20px;">Welcome to the Team, ${data.name || 'Team Member'}! 🎉</h2>
        <p style="color: #4B5563; line-height: 1.6;">Your NexaWork employee portal access has been provisioned. You can now track attendance, submit leave requests, view payslips, and collaborate with your department.</p>
        
        <div style="background-color: ${bgLight}; border-left: 4px solid ${brandGreen}; padding: 16px; margin: 20px 0; border-radius: 6px;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #374151;"><strong>Employee ID:</strong> ${data.employeeId || 'NW-100'}</p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #374151;"><strong>Designation:</strong> ${data.role || 'Team Member'} (${data.department || 'Engineering'})</p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #374151;"><strong>Manager:</strong> ${data.manager || 'Eleanor Vance'}</p>
          <p style="margin: 0; font-size: 13px; color: #374151;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold;">NexaWork2026!</code></p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="#" style="background-color: ${brandGreen}; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Log In to Employee Portal →</a>
        </div>
      `;
      break;

    case 'LEAVE_STATUS':
      const isApproved = data.status === 'Approved';
      const badgeBg = isApproved ? '#EBF5F0' : '#FEE2E2';
      const badgeColor = isApproved ? brandGreen : '#DC2626';

      bodyContent = `
        <h2 style="color: ${brandDark}; margin-top: 0; font-size: 20px;">Leave Request Update</h2>
        <p style="color: #4B5563; line-height: 1.6;">Hello ${data.employeeName || 'Team Member'}, your leave request submitted for <strong>${data.type || 'Paid Leave'}</strong> has been actioned.</p>

        <div style="background-color: ${badgeBg}; border: 1px solid ${badgeColor}33; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <div style="display: flex; align-items: center; justify-between: space-between;">
            <span style="font-size: 14px; font-weight: bold; color: ${brandDark};">${data.type} (${data.daysCount} Days)</span>
            <span style="background-color: ${badgeColor}; color: #ffffff; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 12px; text-transform: uppercase;">${data.status}</span>
          </div>
          <hr style="border: none; border-top: 1px solid ${badgeColor}22; margin: 12px 0;" />
          <p style="margin: 4px 0; font-size: 12px; color: #4B5563;"><strong>Period:</strong> ${data.startDate} to ${data.endDate}</p>
          <p style="margin: 4px 0; font-size: 12px; color: #4B5563;"><strong>Reason:</strong> ${data.reason || 'N/A'}</p>
          ${data.adminComment ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: ${brandDark}; font-style: italic;"><strong>Manager Note:</strong> "${data.adminComment}"</p>` : ''}
        </div>
      `;
      break;

    case 'MEETING_INVITE':
      bodyContent = `
        <h2 style="color: ${brandDark}; margin-top: 0; font-size: 20px;">Meeting Invitation 🎥</h2>
        <p style="color: #4B5563; line-height: 1.6;">You have been invited to an upcoming corporate meeting on NexaWork.</p>

        <div style="background-color: ${bgLight}; border: 1px solid #E5E7EB; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <h3 style="margin: 0 0 8px 0; color: ${brandDark}; font-size: 16px;">${data.title || 'Weekly All-Hands & Policy Sync'}</h3>
          <p style="margin: 4px 0; font-size: 13px; color: #4B5563;"><strong>Time:</strong> ${data.time || '02.00 pm - 04.00 pm'}</p>
          <p style="margin: 4px 0; font-size: 13px; color: #4B5563;"><strong>Host:</strong> ${data.host || 'HR Operations'}</p>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="#" style="background-color: ${brandGreen}; color: #ffffff; padding: 12px 26px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Join Video Meeting Now</a>
        </div>
      `;
      break;

    case 'PAYSLIP':
      bodyContent = `
        <h2 style="color: ${brandDark}; margin-top: 0; font-size: 20px;">Payslip Published for ${data.month || 'Current Month'} 📄</h2>
        <p style="color: #4B5563; line-height: 1.6;">Hello ${data.employeeName}, your official salary payslip for <strong>${data.month}</strong> has been auto-reconciled and published.</p>

        <div style="background-color: ${bgLight}; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Gross Earnings:</span>
            <strong style="color: ${brandDark};">$${data.grossEarnings?.toLocaleString() || '6,500'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Total Deductions (PF/Tax):</span>
            <strong style="color: #DC2626;">-$${data.totalDeductions?.toLocaleString() || '1,755'}</strong>
          </div>
          <hr style="border: none; border-top: 1px solid #CBD5E1; margin: 10px 0;" />
          <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: bold; color: ${brandGreen};">
            <span>Net Dispatched Pay:</span>
            <span>$${data.netPay?.toLocaleString() || '4,745'}</span>
          </div>
        </div>

        <p style="font-size: 12px; color: #6B7280;">You can download your detailed PDF payslip directly from your NexaWork Employee Portal.</p>
      `;
      break;

    case 'NEWSLETTER':
      bodyContent = `
        <h2 style="color: ${brandDark}; margin-top: 0; font-size: 20px;">Welcome to NexaWork Insights 🚀</h2>
        <p style="color: #4B5563; line-height: 1.6;">Thank you for subscribing! You will receive monthly workforce alignment research, HR compliance updates, and feature highlights.</p>
      `;
      break;

    default:
      bodyContent = `
        <h2 style="color: ${brandDark}; margin-top: 0; font-size: 20px;">NexaWork Notification</h2>
        <p style="color: #4B5563; line-height: 1.6;">${data.message || 'You have a new update in your NexaWork account.'}</p>
      `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #eef2f0; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
          ${headerHTML}
          <div style="padding: 32px 28px;">
            ${bodyContent}
          </div>
          ${footerHTML}
        </div>
      </body>
    </html>
  `;
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'NexaWork Express Backend Engine',
    timestamp: new Date().toISOString(),
  });
});

// Automated Email Dispatch Route
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, type, data } = req.body;

    if (!to || !type) {
      return res.status(400).json({ error: 'Missing required parameters: to and type' });
    }

    const html = buildEmailHTML(type, data || {});
    const emailSubject = subject || `NexaWork Notification: ${type}`;

    const transporter = await getTransporter();

    let resultInfo = {};

    if (transporter) {
      const info = await transporter.sendMail({
        from: '"NexaWork Operations" <no-reply@nexawork.com>',
        to,
        subject: emailSubject,
        html,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info) || null;
      console.log(`[NexaWork Email Engine] Dispatched email to ${to} (${type}). Preview URL: ${previewUrl || 'Sent via SMTP'}`);

      resultInfo = {
        messageId: info.messageId,
        previewUrl,
      };
    } else {
      console.log(`[NexaWork Email Engine] Simulated email dispatch to ${to} (${type})`);
      resultInfo = {
        messageId: 'simulated-' + Date.now(),
        previewUrl: null,
      };
    }

    res.json({
      success: true,
      recipient: to,
      type,
      subject: emailSubject,
      html,
      timestamp: new Date().toISOString(),
      ...resultInfo,
    });
  } catch (error) {
    console.error('[NexaWork Email Engine Error]', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[NexaWork Server] Express backend running on http://localhost:${PORT}`);
});
