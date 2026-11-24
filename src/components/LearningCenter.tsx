import { ArrowLeft, BookOpen, CheckCircle2, Lightbulb } from 'lucide-react';
import { LEARNING_TOPICS } from '../data/patients';

interface LearningCenterProps {
  onBackToSimulator: () => void;
}

export default function LearningCenter({ onBackToSimulator }: LearningCenterProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Cyber ER Medical Library</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Phishing Awareness &amp; Defense Guide
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            Beginner-friendly guide to spotting phishing messages, analyzing suspicious links, and protecting your digital accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToSimulator}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold inline-flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ER Simulator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {LEARNING_TOPICS.map((topic) => (
          <article
            key={topic.id}
            className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">{topic.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{topic.summary}</p>
              <ul className="space-y-2 pt-1">
                {topic.keyPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-3.5 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-100 leading-relaxed">
                <span className="font-semibold text-cyan-300">Quick Tip: </span>
                {topic.exampleTip}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
