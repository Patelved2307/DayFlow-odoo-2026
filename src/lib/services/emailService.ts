/**
 * Client-Side Email Dispatch Service for NexaWork
 */

export interface DispatchedEmail {
  id: string;
  recipient: string;
  subject: string;
  type: 'WELCOME' | 'LEAVE_STATUS' | 'MEETING_INVITE' | 'PAYSLIP' | 'NEWSLETTER';
  html: string;
  previewUrl?: string | null;
  dispatchedAt: string;
}

// Persistent log of dispatched emails for visual UI inspection & real email tracking
const loadStoredEmails = (): DispatchedEmail[] => {
  try {
    const saved = localStorage.getItem('df_dispatched_emails');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const dispatchedEmailsLog: DispatchedEmail[] = loadStoredEmails();
const listeners: Array<(emails: DispatchedEmail[]) => void> = [];

const saveEmailsToStorage = () => {
  try {
    localStorage.setItem('df_dispatched_emails', JSON.stringify(dispatchedEmailsLog));
  } catch (e) {
    console.warn('[LocalStorage Email Save Note]', e);
  }
};

export const subscribeEmailLog = (listener: (emails: DispatchedEmail[]) => void) => {
  listeners.push(listener);
  listener([...dispatchedEmailsLog]);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
};

const notifyListeners = () => {
  saveEmailsToStorage();
  listeners.forEach((fn) => fn([...dispatchedEmailsLog]));
};

function buildFallbackHTML(type: string, to: string, subject: string, data: any): string {
  const isApproved = data.status === 'Approved';
  const statusColor = isApproved ? '#006837' : '#DC2626';
  const statusBg = isApproved ? '#EBF5F0' : '#FEE2E2';

  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          <div style="background-color: #0B1E17; padding: 24px; text-align: center;">
            <div style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
              Nexa<span style="color: #34D399;">Work</span>
            </div>
            <div style="color: #A7F3D0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
              EVERY WORKDAY, PERFECTLY ALIGNED.
            </div>
          </div>
          
          <div style="padding: 32px 28px; color: #1e293b;">
            <h2 style="color: #0B1E17; margin-top: 0; font-size: 20px; font-weight: 700;">${subject}</h2>
            <p style="color: #475569; line-height: 1.6; font-size: 14px;">Hello <strong>${data.employeeName || data.name || 'Team Member'}</strong>,</p>
            <p style="color: #475569; line-height: 1.6; font-size: 14px;">Your leave request submitted for <strong>${data.type || 'Paid Leave'}</strong> (${data.daysCount || 1} Days) has been actioned by HR.</p>

            <div style="background-color: ${statusBg}; border: 1px solid ${statusColor}44; border-radius: 12px; padding: 18px; margin: 24px 0;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 14px; font-weight: 700; color: #0B1E17;">${data.type || 'Paid Leave'} • ${data.daysCount || 1} Days</span>
                <span style="background-color: ${statusColor}; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">${data.status || 'STATUS'}</span>
              </div>
              <div style="border-top: 1px solid ${statusColor}33; margin: 12px 0;"></div>
              <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Date Range:</strong> ${data.startDate || 'N/A'} to ${data.endDate || 'N/A'}</p>
              <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Employee Reason:</strong> ${data.reason || 'N/A'}</p>
              ${data.adminComment ? `<p style="margin: 10px 0 0 0; font-size: 13px; color: #0B1E17; background: #ffffff; padding: 10px; border-radius: 8px; border-left: 3px solid ${statusColor};"><strong>HR Manager Note:</strong> "${data.adminComment}"</p>` : ''}
            </div>

            <p style="font-size: 13px; color: #64748B; margin-top: 24px;">Log in to your NexaWork Employee Portal to view updated leave balance ledgers and download statements.</p>
          </div>

          <div style="background-color: #EBF5F0; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #cbd5e1;">
            <p style="margin: 0 0 4px 0;"><strong>NexaWork Enterprise Alignment Suite</strong></p>
            <p style="margin: 0;">Automated email statement dispatched directly to recipient inbox.</p>
            <p style="margin: 4px 0 0 0; color: #94a3b8;">© 2026 NexaWork Inc. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendAutomatedEmail(params: {
  to: string;
  subject: string;
  type: 'WELCOME' | 'LEAVE_STATUS' | 'MEETING_INVITE' | 'PAYSLIP' | 'NEWSLETTER';
  data: any;
}): Promise<{ success: boolean; previewUrl?: string | null }> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const resData = await response.json();

    const record: DispatchedEmail = {
      id: 'eml-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      recipient: params.to,
      subject: params.subject,
      type: params.type,
      html: resData.html || buildFallbackHTML(params.type, params.to, params.subject, params.data),
      previewUrl: resData.previewUrl || null,
      dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatchedEmailsLog.unshift(record);
    notifyListeners();

    return {
      success: true,
      previewUrl: resData.previewUrl,
    };
  } catch (err) {
    console.warn('[EmailService] API offline or error, storing simulated dispatch record', err);

    const record: DispatchedEmail = {
      id: 'eml-' + Date.now(),
      recipient: params.to,
      subject: params.subject,
      type: params.type,
      html: buildFallbackHTML(params.type, params.to, params.subject, params.data),
      previewUrl: null,
      dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatchedEmailsLog.unshift(record);
    notifyListeners();

    return { success: true };
  }
}

export function getDispatchedEmails(): DispatchedEmail[] {
  return [...dispatchedEmailsLog];
}
