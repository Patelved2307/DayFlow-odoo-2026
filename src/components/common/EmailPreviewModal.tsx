import React, { useState, useEffect } from 'react';
import { Mail, X, ExternalLink, CheckCircle, Send, Inbox, Clock } from 'lucide-react';
import { DispatchedEmail, subscribeEmailLog } from '../../lib/services/emailService';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState<DispatchedEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<DispatchedEmail | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeEmailLog((log) => {
      setEmails(log);
      if (log.length > 0 && !selectedEmail) {
        setSelectedEmail(log[0]);
      }
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-[#0B1E17] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#006837] flex items-center justify-center text-emerald-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Live Dispatched Emails Engine
              </h3>
              <p className="text-xs text-emerald-200/80">
                Automated employee email log ({emails.length} emails dispatched)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Email List */}
          <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto">
            <div className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-100 flex items-center justify-between">
              <span>Dispatched Queue</span>
              <span className="bg-[#006837] text-white px-2 py-0.5 rounded-full text-[10px]">
                {emails.length}
              </span>
            </div>

            {emails.length === 0 ? (
              <div className="p-8 text-center text-gray-400 space-y-2">
                <Inbox className="w-8 h-8 mx-auto text-gray-300" />
                <p className="text-xs font-medium">No emails dispatched yet</p>
                <p className="text-[11px]">Perform HR actions (add employee, approve leave, send payslip) to trigger automatic emails.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {emails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  return (
                    <button
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`w-full text-left p-3.5 transition-colors cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-white border-l-4 border-[#006837] shadow-xs'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-900 truncate max-w-[140px]">
                          {email.recipient}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {email.dispatchedAt}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-[#006837] truncate">
                        {email.subject}
                      </div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-[#006837] font-semibold uppercase text-[9px]">
                          {email.type}
                        </span>
                        <span>• Sent to employee</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: HTML Email Render Preview */}
          <div className="flex-1 bg-white flex flex-col overflow-hidden">
            {selectedEmail ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Email Meta Bar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 truncate">
                      {selectedEmail.subject}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      To: <strong className="text-gray-800">{selectedEmail.recipient}</strong> •{' '}
                      <span className="text-gray-400">{selectedEmail.dispatchedAt}</span>
                    </p>
                  </div>

                  {selectedEmail.previewUrl && (
                    <a
                      href={selectedEmail.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006837] text-white text-xs font-semibold hover:bg-[#0A7C46] transition-colors"
                    >
                      <span>Ethereal Web Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* HTML Iframe Preview */}
                <div className="flex-1 p-4 bg-gray-100 overflow-hidden">
                  <iframe
                    title="Email Render"
                    srcDoc={selectedEmail.html}
                    className="w-full h-full rounded-xl border border-gray-200 bg-white shadow-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 space-y-3">
                <Mail className="w-12 h-12 text-gray-300" />
                <p className="text-sm font-medium">Select an email from the left log to view formatted HTML preview.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#006837]" />
            <span>NexaWork Automatic Direct-to-Employee Email Engine Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
