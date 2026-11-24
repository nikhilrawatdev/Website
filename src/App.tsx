import { useEffect, useState } from 'react';
import DiagnosisChart from './components/DiagnosisChart';
import Header from './components/Header';
import LearningCenter from './components/LearningCenter';
import MessageInspector from './components/MessageInspector';
import PatientInfoCard from './components/PatientInfoCard';
import FinalReport from './components/FinalReport';
import {
  PATIENT_CASES,
  POINTS_PER_RED_FLAG,
  TIME_BONUS_POINTS,
} from './data/patients';
import { ActiveView, CaseProgress, FeedbackMessage, MessageElement } from './types';

const STORAGE_KEY = 'cyber_er_progress_v1';

function createInitialProgress(): Record<string, CaseProgress> {
  const initial: Record<string, CaseProgress> = {};
  for (const patient of PATIENT_CASES) {
    initial[patient.id] = {
      foundFlagIds: [],
      clickedSafeIds: [],
      totalAttempts: 0,
      timeRemaining: patient.timeLimitSeconds,
      timeSpent: 0,
      completed: false,
      bonusAwarded: false,
    };
  }
  return initial;
}

function loadSavedProgress(): Record<string, CaseProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as Record<string, CaseProgress>;
    const defaults = createInitialProgress();
    // Merge safely in case case definitions change
    for (const patient of PATIENT_CASES) {
      if (parsed[patient.id]) {
        defaults[patient.id] = parsed[patient.id];
      }
    }
    return defaults;
  } catch {
    return createInitialProgress();
  }
}

export default function App() {
  const [activePatientIndex, setActivePatientIndex] = useState(0);
  const [activeView, setActiveView] = useState<ActiveView>('simulator');
  const [progressMap, setProgressMap] = useState<Record<string, CaseProgress>>(
    loadSavedProgress
  );
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const activePatient = PATIENT_CASES[activePatientIndex];
  const activeProgress = progressMap[activePatient.id];

  // Persist progress in browser localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
    } catch {
      // Ignore storage quota errors
    }
  }, [progressMap]);

  // Countdown timer for active patient while in simulator view
  useEffect(() => {
    if (activeView !== 'simulator' || activeProgress.completed) {
      return;
    }

    const timer = window.setInterval(() => {
      setProgressMap((prev) => {
        const current = prev[activePatient.id];
        if (!current || current.completed) return prev;

        return {
          ...prev,
          [activePatient.id]: {
            ...current,
            timeRemaining: Math.max(0, current.timeRemaining - 1),
            timeSpent: current.timeSpent + 1,
          },
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeView, activePatient.id, activeProgress.completed]);

  const handleSelectPatient = (index: number) => {
    setActivePatientIndex(index);
    setActiveView('simulator');
    setFeedback(null);
  };

  const handleInspectElement = (element: MessageElement) => {
    const totalFlagsInCase = activePatient.elements.filter((el) => el.isRedFlag).length;
    const current = progressMap[activePatient.id];

    // Already discovered red flag: show info again without awarding duplicate points
    if (current.foundFlagIds.includes(element.id)) {
      setFeedback({
        elementId: element.id,
        isRedFlag: true,
        title: `Already Diagnosed: ${element.label}`,
        detail: element.explanation,
      });
      return;
    }

    // Already clicked safe element: show info again without double-penalizing accuracy
    if (current.clickedSafeIds.includes(element.id)) {
      setFeedback({
        elementId: element.id,
        isRedFlag: false,
        title: `Checked: ${element.label} (Not a Red Flag)`,
        detail: element.explanation,
      });
      return;
    }

    if (element.isRedFlag) {
      const updatedFound = [...current.foundFlagIds, element.id];
      const isNowComplete = updatedFound.length === totalFlagsInCase;
      const getsBonus = isNowComplete && current.timeRemaining > 0;

      setFeedback({
        elementId: element.id,
        isRedFlag: true,
        title: `Red Flag Confirmed (+${POINTS_PER_RED_FLAG} pts): ${element.label}`,
        detail: element.explanation,
      });

      setProgressMap((prev) => ({
        ...prev,
        [activePatient.id]: {
          ...prev[activePatient.id],
          foundFlagIds: updatedFound,
          totalAttempts: prev[activePatient.id].totalAttempts + 1,
          completed: isNowComplete,
          bonusAwarded: prev[activePatient.id].bonusAwarded || getsBonus,
        },
      }));
      return;
    }

    // Safe / neutral element clicked
    setFeedback({
      elementId: element.id,
      isRedFlag: false,
      title: `Not a Primary Red Flag: ${element.label}`,
      detail: element.explanation,
    });

    setProgressMap((prev) => ({
      ...prev,
      [activePatient.id]: {
        ...prev[activePatient.id],
        clickedSafeIds: [...prev[activePatient.id].clickedSafeIds, element.id],
        totalAttempts: prev[activePatient.id].totalAttempts + 1,
      },
    }));
  };

  const handleResetCase = () => {
    setProgressMap((prev) => ({
      ...prev,
      [activePatient.id]: {
        foundFlagIds: [],
        clickedSafeIds: [],
        totalAttempts: 0,
        timeRemaining: activePatient.timeLimitSeconds,
        timeSpent: 0,
        completed: false,
        bonusAwarded: false,
      },
    }));
    setFeedback(null);
  };

  const handleResetAll = () => {
    const fresh = createInitialProgress();
    setProgressMap(fresh);
    setActivePatientIndex(0);
    setActiveView('simulator');
    setFeedback(null);
  };

  // Global scoring calculations
  const totalFlagsPossible = PATIENT_CASES.reduce(
    (sum, p) => sum + p.elements.filter((e) => e.isRedFlag).length,
    0
  );

  const totalFoundFlags = PATIENT_CASES.reduce(
    (sum, p) => sum + (progressMap[p.id]?.foundFlagIds.length ?? 0),
    0
  );

  const totalAttempts = PATIENT_CASES.reduce(
    (sum, p) => sum + (progressMap[p.id]?.totalAttempts ?? 0),
    0
  );

  const completedCases = PATIENT_CASES.filter(
    (p) => progressMap[p.id]?.completed
  ).length;

  const totalBonusPoints = PATIENT_CASES.reduce(
    (sum, p) => sum + (progressMap[p.id]?.bonusAwarded ? TIME_BONUS_POINTS : 0),
    0
  );

  const totalScore = totalFoundFlags * POINTS_PER_RED_FLAG + totalBonusPoints;

  const accuracyPercent =
    totalAttempts > 0 ? Math.round((totalFoundFlags / totalAttempts) * 100) : 0;

  const totalTimeTaken = PATIENT_CASES.reduce(
    (sum, p) => sum + (progressMap[p.id]?.timeSpent ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
      <Header
        patients={PATIENT_CASES}
        activePatientIndex={activePatientIndex}
        activeView={activeView}
        progressMap={progressMap}
        onSelectPatient={handleSelectPatient}
        onChangeView={setActiveView}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeView === 'simulator' && (
          <>
            <PatientInfoCard
              patient={activePatient}
              progress={activeProgress}
              totalScore={totalScore}
              totalFoundFlags={totalFoundFlags}
              totalFlagsPossible={totalFlagsPossible}
              completedCases={completedCases}
              totalCases={PATIENT_CASES.length}
              accuracyPercent={accuracyPercent}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <MessageInspector
                  key={activePatient.id}
                  patient={activePatient}
                  progress={activeProgress}
                  feedback={feedback}
                  onInspectElement={handleInspectElement}
                />
              </div>

              <div className="lg:col-span-5">
                <DiagnosisChart
                  patient={activePatient}
                  progress={activeProgress}
                  isLastPatient={activePatientIndex === PATIENT_CASES.length - 1}
                  allCasesCompleted={completedCases === PATIENT_CASES.length}
                  onResetCase={handleResetCase}
                  onNextPatient={() =>
                    handleSelectPatient((activePatientIndex + 1) % PATIENT_CASES.length)
                  }
                  onOpenReport={() => setActiveView('report')}
                />
              </div>
            </div>
          </>
        )}

        {activeView === 'learning' && (
          <LearningCenter onBackToSimulator={() => setActiveView('simulator')} />
        )}

        {activeView === 'report' && (
          <FinalReport
            patients={PATIENT_CASES}
            progressMap={progressMap}
            totalScore={totalScore}
            totalFoundFlags={totalFoundFlags}
            totalFlagsPossible={totalFlagsPossible}
            completedCases={completedCases}
            accuracyPercent={accuracyPercent}
            totalTimeTaken={totalTimeTaken}
            onSelectPatient={handleSelectPatient}
            onResetAll={handleResetAll}
          />
        )}
      </main>

      <footer className="no-print border-t border-slate-800/80 py-4 px-4 sm:px-6 text-center text-xs text-slate-500">
        THE CYBER ER · Educational Phishing Awareness Simulator · All patient cases, numbers, and links are fictional.
      </footer>
    </div>
  );
}
