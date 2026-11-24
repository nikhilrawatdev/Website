import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { POINTS_PER_RED_FLAG, TIME_BONUS_POINTS } from '../data/patients';
import { CaseProgress, PatientCase } from '../types';

interface FinalReportProps {
  patients: PatientCase[];
  progressMap: Record<string, CaseProgress>;
  totalScore: number;
  totalFoundFlags: number;
  totalFlagsPossible: number;
  completedCases: number;
  accuracyPercent: number;
  totalTimeTaken: number;
  onSelectPatient: (index: number) => void;
  onResetAll: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${String(secs).padStart(2, '0')}s`;
}

function getClassification(accuracy: number) {
  if (accuracy >= 90) {
    return {
      label: 'Cybersecurity Expert',
      color: 'text-emerald-400',
      summary:
        'Outstanding clinical precision! You consistently spotted phishing senders, urgency traps, and dangerous URLs with minimal false positives.',
    };
  }
  if (accuracy >= 70) {
    return {
      label: 'Security Aware',
      color: 'text-cyan-400',
      summary:
        'Strong diagnostic skills! You caught the major phishing indicators and stayed alert, with only minor hesitation on neutral message details.',
    };
  }
  if (accuracy >= 40) {
    return {
      label: 'Needs More Training',
      color: 'text-amber-400',
      summary:
        'Developing awareness. You identified core threats, but several safe message details distracted you. Review the Learning Center and retry cases.',
    };
  }
  return {
    label: 'High Risk – More Practice Required',
    color: 'text-rose-400',
    summary:
      'High vulnerability to social engineering tricks. Practice inspecting sender domains, URL shorteners, and urgent deadlines before clicking.',
  };
}

export default function FinalReport({
  patients,
  progressMap,
  totalScore,
  totalFoundFlags,
  totalFlagsPossible,
  completedCases,
  accuracyPercent,
  totalTimeTaken,
  onSelectPatient,
  onResetAll,
}: FinalReportProps) {
  const allCompleted = completedCases === patients.length;
  const classification = getClassification(accuracyPercent);

  const recommendations: string[] = [];
  if (!allCompleted) {
    recommendations.push(
      `Complete all ${patients.length} patient cases (${patients.length - completedCases} remaining) to unlock your full clinical evaluation.`
    );
  }
  if (accuracyPercent < 90) {
    recommendations.push(
      'Pause before clicking neutral text like greetings or timestamps—focus first on sender addresses, urgency deadlines, and URL domains.'
    );
  }
  const anyNoBonus = patients.some(
    (p) => progressMap[p.id]?.completed && !progressMap[p.id]?.bonusAwarded
  );
  if (anyNoBonus) {
    recommendations.push(
      'Work on faster triage by scanning the sender field and link destination first to earn the +10 time bonus.'
    );
  }
  recommendations.push(
    'Always verify bank KYC, job offer, and social media security alerts directly inside official apps instead of following embedded links.'
  );
  recommendations.push(
    'Enable Two-Factor Authentication (2FA) and never share passwords, OTPs, or ID scans over email or SMS.'
  );

  return (
    <div className="space-y-6">
      {/* Incomplete Banner */}
      {!allCompleted && (
        <div className="no-print bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-200">
                Diagnosis Report In Progress ({completedCases} of {patients.length} Patients Completed)
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Finish the remaining patient cases to finalize your accuracy rating and Cyber ER certificate.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const firstIncomplete = patients.findIndex((p) => !progressMap[p.id]?.completed);
              onSelectPatient(firstIncomplete >= 0 ? firstIncomplete : 0);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shrink-0 cursor-pointer transition-colors"
          >
            Continue Next Case
          </button>
        </div>
      )}

      {/* Printable Clinical Report Card */}
      <div className="print-report bg-[#0F172A] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              THE CYBER ER · CLINICAL ASSESSMENT
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Final Phishing Diagnosis Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Generated on {new Date().toLocaleDateString()} · Session Summary
            </p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onResetAll}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart All</span>
            </button>
          </div>
        </div>

        {/* Performance Classification Banner */}
        <div className="print-card bg-[#0B1120] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Overall Cybersecurity Awareness Level</p>
              <h3 className={`text-xl sm:text-2xl font-bold mt-0.5 ${classification.color}`}>
                {classification.label}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {classification.summary}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <p className="text-xs text-slate-400">Accuracy Score</p>
            <p className="text-3xl font-bold font-mono tabular-nums text-white">
              {accuracyPercent}%
            </p>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="print-card bg-[#0B1120] border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Cases Completed</p>
            <p className="text-xl font-bold font-mono tabular-nums text-white mt-1">
              {completedCases} / {patients.length}
            </p>
          </div>
          <div className="print-card bg-[#0B1120] border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Red Flags Found</p>
            <p className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
              {totalFoundFlags} / {totalFlagsPossible}
            </p>
          </div>
          <div className="print-card bg-[#0B1120] border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Total Score</p>
            <p className="text-xl font-bold font-mono tabular-nums text-cyan-400 mt-1">
              {totalScore} pts
            </p>
          </div>
          <div className="print-card bg-[#0B1120] border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Accuracy</p>
            <p className="text-xl font-bold font-mono tabular-nums text-sky-400 mt-1">
              {accuracyPercent}%
            </p>
          </div>
          <div className="print-card bg-[#0B1120] border border-slate-800 rounded-xl p-4 col-span-2 lg:col-span-1">
            <p className="text-xs text-slate-400">Time Taken</p>
            <p className="text-xl font-bold font-mono tabular-nums text-white mt-1 inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              {formatDuration(totalTimeTaken)}
            </p>
          </div>
        </div>

        {/* Case-by-Case Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Patient Case Breakdown
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patients.map((patient, index) => {
              const p = progressMap[patient.id];
              const maxFlags = patient.elements.filter((e) => e.isRedFlag).length;
              const caseScore =
                p.foundFlagIds.length * POINTS_PER_RED_FLAG +
                (p.bonusAwarded ? TIME_BONUS_POINTS : 0);

              return (
                <div
                  key={patient.id}
                  className="print-card bg-[#0B1120] border border-slate-800 rounded-xl p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-cyan-400">
                      {patient.caseNumber}
                    </span>
                    {p.completed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Diagnosed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectPatient(index)}
                        className="no-print text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
                      >
                        Resume Case
                      </button>
                    )}
                  </div>
                  <p className="text-base font-bold text-white">{patient.patientName}</p>
                  <p className="text-xs text-slate-400">{patient.diagnosisTitle}</p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">
                      Flags: {p.foundFlagIds.length}/{maxFlags}
                    </span>
                    <span className="text-cyan-400 font-semibold">{caseScore} pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="print-card bg-[#0B1120] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Personalized Learning Recommendations</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside">
            {recommendations.map((rec) => (
              <li key={rec}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
