import { ArrowRight, CheckCircle2, ClipboardList, FileText, RotateCcw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { CaseProgress, PatientCase } from '../types';

interface DiagnosisChartProps {
  patient: PatientCase;
  progress: CaseProgress;
  isLastPatient: boolean;
  allCasesCompleted: boolean;
  onResetCase: () => void;
  onNextPatient: () => void;
  onOpenReport: () => void;
}

export default function DiagnosisChart({
  patient,
  progress,
  isLastPatient,
  allCasesCompleted,
  onResetCase,
  onNextPatient,
  onOpenReport,
}: DiagnosisChartProps) {
  const redFlags = patient.elements.filter((el) => el.isRedFlag);
  const foundCount = progress.foundFlagIds.length;

  let statusText = 'Awaiting Examination';
  let statusColor = 'text-slate-300';
  if (progress.completed) {
    statusText = 'Diagnosis Complete';
    statusColor = 'text-emerald-400';
  } else if (foundCount > 0 || progress.totalAttempts > 0) {
    statusText = 'Examination in Progress';
    statusColor = 'text-cyan-400';
  }

  let riskDisplay = 'Pending Triage';
  let riskColor = 'text-slate-400';
  if (progress.completed) {
    riskDisplay = patient.riskLevel;
    riskColor = 'text-rose-400';
  } else if (foundCount > 0) {
    riskDisplay = 'Elevated Suspicion';
    riskColor = 'text-amber-400';
  }

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white">Doctor&apos;s Diagnosis Chart</h3>
              <p className={`text-xs font-medium mt-0.5 ${statusColor}`}>
                Status: {statusText}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetCase}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Case</span>
          </button>
        </div>

        {/* Red Flag Slots */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Identified Red Flags ({foundCount} of {redFlags.length})
          </p>

          {redFlags.map((flag, idx) => {
            const isFound = progress.foundFlagIds.includes(flag.id);
            return (
              <div
                key={flag.id}
                className={`rounded-xl border p-3.5 transition-colors ${
                  isFound
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : 'bg-[#0B1120] border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    Red Flag #{idx + 1}
                  </span>
                  {isFound ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirmed (+10 pts)
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Undetected</span>
                  )}
                </div>

                {isFound ? (
                  <div className="mt-1.5">
                    <p className="text-sm font-semibold text-white">
                      {flag.label} · <span className="text-emerald-300">{flag.category}</span>
                    </p>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {flag.explanation}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">
                    Inspect the patient message to uncover this indicator.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Risk Level & Diagnosis Summary */}
        <div className="rounded-xl border border-slate-800 bg-[#0B1120] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400">Assessed Risk Level</span>
            <span className={`text-xs font-bold inline-flex items-center gap-1.5 ${riskColor}`}>
              {progress.completed ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-slate-500" />
              )}
              {riskDisplay}
            </span>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <p className="text-xs font-semibold text-slate-300 mb-1">Diagnosis Summary</p>
            {progress.completed ? (
              <div className="space-y-2.5">
                <p className="text-sm font-bold text-emerald-400">
                  {patient.diagnosisTitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {patient.diagnosisVerdict}
                </p>
                <div className="pt-1">
                  <p className="text-xs font-semibold text-cyan-300 mb-1">
                    Key Learning Takeaways:
                  </p>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {patient.learningObjectives.map((obj) => (
                      <li key={obj}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                {foundCount === 0
                  ? 'Chart is awaiting initial examination. Click suspicious parts in the message panel to record evidence.'
                  : `${foundCount} of ${redFlags.length} red flags documented. Find the remaining ${
                      redFlags.length - foundCount
                    } indicator(s) to finalize your diagnosis.`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Case Completion Action */}
      {progress.completed && (
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          {!isLastPatient && (
            <button
              type="button"
              onClick={onNextPatient}
              className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Next Patient Case</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {(allCasesCompleted || isLastPatient) && (
            <button
              type="button"
              onClick={onOpenReport}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View Final Report</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
