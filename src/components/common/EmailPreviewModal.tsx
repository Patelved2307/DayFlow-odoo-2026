import React, { useState, useEffect } from 'react';
import { Mail, X, ExternalLink, CheckCircle, Inbox, RefreshCw } from 'lucide-react';
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
      if (log.length > 0) {
        // Automatically select the newest email if none is selected
        setSelectedEmail((prev) => (prev ? prev : log[0]));
      }
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-[#0B1E17] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006837] flex items-center justify-center text-emerald-300 shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white tracking-wide flex items-center gap-2">
                <span>NexaWork Live Dispatched Emails Engine</span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-0.5 border border-emerald-500/30">
                  REAL-TIME DISPATCH
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Automated employee notifications log • {emails.length} total statements sent
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Column: Email Log List */}
          <div className="w-80 sm:w-96 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-100/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xs">
              <span>Sent Emails Queue</span>
              <span className="bg-[#006837] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                {emails.length} Records
              </span>
            </div>

            {emails.length === 0 ? (
              <div className="p-8 text-center text-gray-400 space-y-3 my-auto">
                <Inbox className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-xs font-semibold text-gray-600">No emails dispatched yet</p>
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Perform HR actions (add employee, approve leave, send payslip) to trigger automatic emails.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {emails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  return (
                    <button
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`w-full text-left p-4 transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-white border-l-4 border-[#006837] shadow-xs'
                          : 'hover:bg-gray-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-900 truncate max-w-[180px]">
                          {email.recipient}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono font-medium">
                          {email.dispatchedAt}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#006837] line-clamp-1 leading-snug">
                        {email.subject}
                      </div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#006837] font-bold uppercase text-[9px] tracking-wide">
                          {email.type}
                        </span>
                        <span className="text-gray-400">• Dispatched to Inbox</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Full-Height HTML Email Render Viewer */}
          <div className="flex-1 bg-white flex flex-col overflow-hidden min-w-0">
            {selectedEmail ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Email Meta Bar */}
                <div className="p-4 px-6 border-b border-gray-200 bg-gray-50/80 flex items-center justify-between gap-4 shrink-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#006837] text-white text-[10px] font-bold uppercase tracking-wider">
                        {selectedEmail.type}
                      </span>
                      <h4 className="font-bold text-base text-gray-900 truncate">
                        {selectedEmail.subject}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                      <span>Recipient: <strong className="text-gray-900">{selectedEmail.recipient}</strong></span>
                      <span>•</span>
                      <span className="text-gray-500 font-mono">{selectedEmail.dispatchedAt}</span>
                    </p>
                  </div>

                  {selectedEmail.previewUrl && (
                    <a
                      href={selectedEmail.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006837] text-white text-xs font-bold hover:bg-[#0A7C46] transition-all shadow-xs"
                    >
                      <span>Open Webmail Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* HTML Iframe Preview — Full Height & High Resolution */}
                <div className="flex-1 bg-gray-100 p-2 overflow-hidden">
                  <iframe
                    title="Email Render Preview"
                    srcDoc={selectedEmail.html}
                    className="w-full h-full rounded-2xl border border-gray-200 bg-white shadow-sm"
                    style={{ minHeight: '100%' }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 space-y-3">
                <Mail className="w-12 h-12 text-gray-300" />
                <p className="text-sm font-semibold text-gray-600">
                  Select an email statement from the left list to view formatted HTML statement preview.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#006837]" />
            <span className="font-medium">NexaWork Automated Real-Time Direct-to-Employee Email Engine Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition-all cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
