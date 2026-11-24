import { BookOpen, CheckCircle2, FileText, HeartPulse } from 'lucide-react';
import { ActiveView, CaseProgress, PatientCase } from '../types';

interface HeaderProps {
  patients: PatientCase[];
  activePatientIndex: number;
  activeView: ActiveView;
  progressMap: Record<string, CaseProgress>;
  onSelectPatient: (index: number) => void;
  onChangeView: (view: ActiveView) => void;
}

export default function Header({
  patients,
  activePatientIndex,
  activeView,
  progressMap,
  onSelectPatient,
  onChangeView,
}: HeaderProps) {
  const completedCount = patients.filter((p) => progressMap[p.id]?.completed).length;

  return (
    <header className="no-print border-b border-slate-800 bg-[#0F172A]/95 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Brand Logo & Title */}
        <button
          type="button"
          onClick={() => onChangeView('simulator')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:bg-cyan-500/25 transition-colors">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
              THE CYBER ER
            </h1>
            <p className="text-xs text-slate-400">
              Phishing Diagnosis &amp; Awareness Simulator
            </p>
          </div>
        </button>

        {/* Patient & Section Navigation */}
        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0"
        >
          {patients.map((patient, index) => {
            const isSelected = activeView === 'simulator' && activePatientIndex === index;
            const isDone = progressMap[patient.id]?.completed;

            return (
              <button
                key={patient.id}
                type="button"
                onClick={() => onSelectPatient(index)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 flex items-center gap-2 border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>Patient {index + 1}</span>
                {isDone && (
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-400 shrink-0"
                    aria-label="Completed"
                  />
                )}
              </button>
            );
          })}

          <div className="h-5 w-px bg-slate-800 mx-1 shrink-0" aria-hidden="true" />

          <button
            type="button"
            onClick={() => onChangeView('learning')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 flex items-center gap-2 border transition-colors cursor-pointer ${
              activeView === 'learning'
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Learning Center</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('report')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 flex items-center gap-2 border transition-colors cursor-pointer ${
              activeView === 'report'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Final Report ({completedCount}/{patients.length})</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
