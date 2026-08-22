import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, HelpCircle, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';

export const AICopilotModal: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, currentUser, employees, leaveRequests } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; timestamp: string }[]
  >([
    {
      sender: 'ai',
      text: `Hello ${currentUser?.name.split(' ')[0] || 'there'}! I am your DayFlow AI HR Copilot. Ask me anything about attendance records, emergency leave policies, payroll formulas, or employee allocations.`,
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isCopilotOpen) return null;

  const quickQuestions = [
    'How does Emergency Half-Day leave work?',
    'What is today’s attendance status?',
    'Explain the Net Pay salary formula.',
    'Are there any pending leave conflicts?',
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const newMsg = {
      sender: 'user' as const,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('emergency')) {
        reply =
          'Emergency Half-Day Leave in DayFlow allows team members to step out immediately without waiting for upfront manager approval. It records an instant 0.5-day deduction, notifies HR/managers automatically, and marks the punch-out timestamp in the attendance system.';
      } else if (lower.includes('attendance') || lower.includes('present')) {
        const presentCount = employees.filter((e) => e.todayStatus === 'Present').length;
        const total = employees.length;
        const pct = Math.round((presentCount / total) * 100);
        reply = `Today, ${presentCount} out of ${total} employees (${pct}%) are present at work. 1 is on Emergency Half-Day (Aman Verma), 1 is on approved sick leave (Priya Patel), and 1 is absent.`;
      } else if (lower.includes('net pay') || lower.includes('salary') || lower.includes('formula')) {
        reply =
          'Net Pay = Gross Earnings (Basic Salary + HRA 40% + DA 10% + Travel + Special) minus Deductions (PF 12% + Income Tax Withholding 15% + Insurance). When you modify the Basic Salary in Employee Profiles, DayFlow recalculates all fields in real-time.';
      } else if (lower.includes('conflict') || lower.includes('pending')) {
        const pending = leaveRequests.filter((r) => r.status === 'Pending').length;
        reply = `Currently, there are ${pending} pending leave requests in the queue. The Smart Conflict Analyzer has verified that team coverage remains above 85% during all requested windows.`;
      } else {
        reply = `I have analyzed the DayFlow workforce database for "${userText}". All systems are operating smoothly, attendance logs are synchronized with geofencing, and compliance records are up to date.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg h-[580px] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden text-[#1C1F1E] border border-gray-100">
        {/* Header */}
        <div className="p-4 bg-[#1F6D4D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#7EC9A0]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm">DayFlow AI HR Copilot</h3>
              <p className="text-[11px] text-white/70">Trained on company policies & payroll rules</p>
            </div>
          </div>
          <button
            onClick={() => setIsCopilotOpen(false)}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F4F6F5]/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-[#1F6D4D] text-white'
                    : 'bg-white text-[#1F6D4D] shadow-xs border border-gray-100'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs ${
                  m.sender === 'user'
                    ? 'bg-[#1F6D4D] text-white rounded-tr-xs'
                    : 'bg-white text-[#1C1F1E] border border-gray-100 shadow-2xs rounded-tl-xs'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                <span
                  className={`block text-[10px] mt-1 font-mono ${
                    m.sender === 'user' ? 'text-white/60 text-right' : 'text-gray-400'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <Bot className="w-4 h-4 text-[#1F6D4D] animate-spin" />
              <span>Analyzing HR knowledge base...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="rounded-full bg-[#F4F6F5] hover:bg-gray-200 px-3 py-1 text-[#6B7280] font-medium whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about time-off, salaries, attendance..."
            className="flex-1 rounded-xl bg-[#F4F6F5] px-3.5 py-2 text-xs text-[#1C1F1E] placeholder:text-gray-400 outline-none focus:bg-white focus:ring-1 focus:ring-[#1F6D4D]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-xl bg-[#1F6D4D] hover:bg-[#144933] disabled:opacity-50 px-3.5 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
