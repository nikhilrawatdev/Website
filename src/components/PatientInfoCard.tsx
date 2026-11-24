import { Clock, Flag, Mail, MessageSquareWarning, ShieldAlert, ShieldCheck, Smartphone, User } from 'lucide-react';
import { CaseProgress, PatientCase } from '../types';

interface PatientInfoCardProps {
  patient: PatientCase;
  progress: CaseProgress;
  totalScore: number;
  totalFoundFlags: number;
  totalFlagsPossible: number;
  completedCases: number;
  totalCases: number;
  accuracyPercent: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function PatientInfoCard({
  patient,
  progress,
  totalScore,
  totalFoundFlags,
  totalFlagsPossible,
  completedCases,
  totalCases,
  accuracyPercent,
}: PatientInfoCardProps) {
  const totalFlagsInCase = patient.elements.filter((el) => el.isRedFlag).length;
  const foundCount = progress.foundFlagIds.length;

  // Account health improves as red flags are diagnosed and drops slightly on wrong clicks
  const wrongClicks = progress.totalAttempts - foundCount;
  const baseHealth = 35 + Math.round((foundCount / totalFlagsInCase) * 65) - wrongClicks * 5;
  const accountHealth = Math.max(15, Math.min(100, baseHealth));

  let healthLabel = 'Critical Risk';
  let healthColor = 'bg-rose-500';
  let healthTextColor = 'text-rose-400';

  if (progress.completed || accountHealth >= 90) {
    healthLabel = 'Protected';
    healthColor = 'bg-emerald-500';
    healthTextColor = 'text-emerald-400';
  } else if (accountHealth >= 60) {
    healthLabel = 'Stabilizing';
    healthColor = 'bg-cyan-500';
    healthTextColor = 'text-cyan-400';
  } else if (accountHealth >= 40) {
    healthLabel = 'At Risk';
    healthColor = 'bg-amber-500';
    healthTextColor = 'text-amber-400';
  }

  const CommIcon =
    patient.commType === 'SMS'
      ? Smartphone
      : patient.commType === 'EMAIL'
      ? Mail
      : MessageSquareWarning;

  return (
    <section className="space-y-4">
      {/* Global Session Score Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-400">Total Score</p>
          <p className="text-xl font-bold text-cyan-400 font-mono tabular-nums mt-0.5">
            {totalScore} pts
          </p>
        </div>
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-400">Red Flags Detected</p>
          <p className="text-xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
            {totalFoundFlags} / {totalFlagsPossible}
          </p>
        </div>
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-400">Cases Completed</p>
          <p className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
            {completedCases} / {totalCases}
          </p>
        </div>
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-400">Diagnostic Accuracy</p>
          <p className="text-xl font-bold text-sky-400 font-mono tabular-nums mt-0.5">
            {accuracyPercent}%
          </p>
        </div>
      </div>

      {/* Active Patient Information Card */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Patient Identity & Scenario */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-cyan-400 font-semibold">{patient.caseNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <CommIcon className="w-3.5 h-3.5 text-cyan-400" />
                {patient.commLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span>{patient.patientRole}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-300 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Patient: {patient.patientName} ({patient.patientAge} yrs)
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{patient.scenario}</p>
          </div>

          {/* Patient Vitals: Red Flags, Account Health, Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xl:w-[500px] shrink-0">
            <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Flag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Red Flags Found</span>
              </div>
              <p className="text-lg font-bold text-white font-mono tabular-nums mt-1.5">
                {foundCount} / {totalFlagsInCase}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {progress.completed ? 'All flags isolated' : 'Click clues in message'}
              </p>
            </div>

            <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                {progress.completed ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>Account Health</span>
              </div>
              <p className={`text-sm font-bold mt-1.5 ${healthTextColor}`}>
                {healthLabel} ({accountHealth}%)
              </p>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-300 ${healthColor}`}
                  style={{ width: `${accountHealth}%` }}
                />
              </div>
            </div>

            <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>ER Triage Timer</span>
              </div>
              <p
                className={`text-lg font-bold font-mono tabular-nums mt-1.5 ${
                  progress.timeRemaining <= 20 && !progress.completed
                    ? 'text-rose-400'
                    : 'text-white'
                }`}
              >
                {formatTime(progress.timeRemaining)}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {progress.completed
                  ? progress.bonusAwarded
                    ? '+10 Speed Bonus!'
                    : 'Time expired'
                  : progress.timeRemaining > 0
                  ? '+10 pts if solved in time'
                  : 'Time expired (no bonus)'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
