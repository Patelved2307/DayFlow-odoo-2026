import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { sendAutomatedEmail } from '../../lib/services/emailService';
import {
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Search,
  Plus,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export interface InterviewProfile {
  id: string;
  interviewId: string;
  candidateName: string;
  email: string;
  phone: string;
  appliedRole: string;
  appliedDate: string;
  scheduledDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  interviewer?: string;
}

export const InterviewBoardPage: React.FC = () => {
  const { showToast } = useApp();

  const [candidates, setCandidates] = useState<InterviewProfile[]>([
    {
      id: 'cand-1',
      interviewId: 'COEDELKOLH00508',
      candidateName: 'Aditi Shah',
      email: 'aditi.shah@example.com',
      phone: '+1 (555) 234-5678',
      appliedRole: 'Senior Frontend Developer',
      appliedDate: '2026-08-10',
      scheduledDate: '2026-08-25',
      status: 'Approved',
      interviewer: 'Eleanor Vance',
    },
    {
      id: 'cand-2',
      interviewId: 'COEDELKOLH00509',
      candidateName: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      phone: '+1 (555) 345-6789',
      appliedRole: 'Product Designer',
      appliedDate: '2026-08-14',
      scheduledDate: '2026-08-28',
      status: 'Pending',
      interviewer: 'Eleanor Vance',
    },
    {
      id: 'cand-3',
      interviewId: 'COEDELKOLH00510',
      candidateName: 'Sophia Lin',
      email: 'sophia.lin@example.com',
      phone: '+1 (555) 456-7890',
      appliedRole: 'DevOps Engineer',
      appliedDate: '2026-08-12',
      scheduledDate: '2026-08-20',
      status: 'Rejected',
      interviewer: 'Eleanor Vance',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedCandidate, setSelectedCandidate] = useState<InterviewProfile | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [newScheduleDate, setNewScheduleDate] = useState('');

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.interviewId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.appliedRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveCandidate = async (candidate: InterviewProfile) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidate.id ? { ...c, status: 'Approved' } : c))
    );

    showToast(`Approved candidate ${candidate.candidateName}. Unlocked ID: ${candidate.interviewId}`, 'success');

    // Trigger Transactional Email
    await sendAutomatedEmail({
      to: candidate.email,
      subject: `Congratulations! You have passed your DayFlow Interview`,
      type: 'WELCOME',
      data: {
        name: candidate.candidateName,
        employeeId: candidate.interviewId,
        role: candidate.appliedRole,
        department: 'Engineering',
        manager: 'Eleanor Vance',
        message: `Congratulations! You have successfully passed your interview for ${candidate.appliedRole}. Please register your account at https://hrms.dayflow.com/register using Employee ID: ${candidate.interviewId}. Note that your password must meet all baseline complexity rules and score > 50% strength.`,
      },
    });

    showToast(`Transactional interview approval email sent to ${candidate.email}`, 'info');
  };

  const handleRejectCandidate = async (candidate: InterviewProfile) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidate.id ? { ...c, status: 'Rejected' } : c))
    );

    showToast(`Candidate ${candidate.candidateName} status set to Rejected`, 'warning');

    // Trigger Transactional Email
    await sendAutomatedEmail({
      to: candidate.email,
      subject: `Update on your application with DayFlow`,
      type: 'LEAVE_STATUS',
      data: {
        employeeName: candidate.candidateName,
        type: 'Application Status',
        status: 'Rejected',
        adminComment: `Thank you for taking the time to interview for the ${candidate.appliedRole} position. After careful review, we have chosen another candidate whose profile aligns with our current team requirements. We will keep your profile on record for future opportunities.`,
      },
    });

    showToast(`Transactional rejection email sent to ${candidate.email}`, 'info');
  };

  const handleScheduleSubmit = () => {
    if (!selectedCandidate || !newScheduleDate) return;
    setCandidates((prev) =>
      prev.map((c) => (c.id === selectedCandidate.id ? { ...c, scheduledDate: newScheduleDate } : c))
    );
    showToast(`Interview scheduled for ${selectedCandidate.candidateName} on ${newScheduleDate}`, 'success');
    setIsScheduleOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#1C1F1E] tracking-tight">
            Recruitment & Interview Board
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Manage candidate pipelines, schedule interview slots, and trigger automated registration invites.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, ID (e.g. COEDELKOLH00508) or role..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-[#006837]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#006837] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1C1F1E]">
            <thead className="bg-gray-50 border-b border-gray-100 font-bold uppercase text-[10px] text-gray-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Candidate ID</th>
                <th className="py-3.5 px-4">Candidate Name</th>
                <th className="py-3.5 px-4">Applied Role</th>
                <th className="py-3.5 px-4">Interview Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredCandidates.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#006837]">{c.interviewId}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{c.candidateName}</div>
                    <div className="text-[11px] text-gray-400">{c.email}</div>
                  </td>
                  <td className="py-3.5 px-4">{c.appliedRole}</td>
                  <td className="py-3.5 px-4 font-mono">{c.scheduledDate || 'Not Set'}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.status === 'Approved'
                          ? 'bg-emerald-100 text-[#006837]'
                          : c.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                      {c.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                      {c.status === 'Pending' && <AlertCircle className="w-3 h-3" />}
                      <span>{c.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedCandidate(c);
                          setNewScheduleDate(c.scheduledDate);
                          setIsScheduleOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer"
                        title="Schedule Interview Date"
                      >
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />
                        Schedule
                      </button>

                      {c.status !== 'Approved' && (
                        <button
                          onClick={() => handleApproveCandidate(c)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-[#006837] text-xs font-bold cursor-pointer"
                          title="Approve Candidate and Send Invitation Email"
                        >
                          <UserCheck className="w-3.5 h-3.5 inline mr-1" />
                          Approve
                        </button>
                      )}

                      {c.status !== 'Rejected' && (
                        <button
                          onClick={() => handleRejectCandidate(c)}
                          className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold cursor-pointer"
                          title="Reject Candidate"
                        >
                          <UserX className="w-3.5 h-3.5 inline mr-1" />
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {isScheduleOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-gray-900">
              Schedule Interview for {selectedCandidate.candidateName}
            </h3>
            <p className="text-xs text-gray-500">
              Candidate ID: <span className="font-mono font-bold text-[#006837]">{selectedCandidate.interviewId}</span>
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Interview Date
              </label>
              <input
                type="date"
                value={newScheduleDate}
                onChange={(e) => setNewScheduleDate(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#006837]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                className="px-4 py-2 rounded-xl bg-[#006837] text-white text-xs font-bold cursor-pointer"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
