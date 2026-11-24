import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Info,
  Link2,
  Lock,
  Mail,
  Paperclip,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { CaseProgress, FeedbackMessage, MessageElement, PatientCase, UrlXrayInfo } from '../types';

interface MessageInspectorProps {
  patient: PatientCase;
  progress: CaseProgress;
  feedback: FeedbackMessage | null;
  onInspectElement: (element: MessageElement) => void;
}

export default function MessageInspector({
  patient,
  progress,
  feedback,
  onInspectElement,
}: MessageInspectorProps) {
  const defaultUrlElement = patient.elements.find((el) => el.urlXray);
  const [xrayUrl, setXrayUrl] = useState<UrlXrayInfo | null>(
    defaultUrlElement?.urlXray ?? null
  );

  const getElementById = (id: string) => patient.elements.find((el) => el.id === id);

  const getButtonStyle = (element: MessageElement) => {
    const isFound = progress.foundFlagIds.includes(element.id);
    const isSafeClicked = progress.clickedSafeIds.includes(element.id);

    if (isFound) {
      return 'bg-emerald-500/15 border-emerald-500/60 text-emerald-200 ring-1 ring-emerald-500/30';
    }
    if (isSafeClicked) {
      return 'bg-slate-800/80 border-slate-600 text-slate-300';
    }
    return 'bg-slate-900/70 border-slate-700/80 hover:border-cyan-400/70 hover:bg-cyan-500/10 text-slate-100';
  };

  const renderInteractivePart = (id: string, extraClass = '') => {
    const el = getElementById(id);
    if (!el) return null;

    const isFound = progress.foundFlagIds.includes(el.id);
    const isSafeClicked = progress.clickedSafeIds.includes(el.id);

    return (
      <button
        type="button"
        onClick={() => {
          if (el.urlXray) {
            setXrayUrl(el.urlXray);
          }
          onInspectElement(el);
        }}
        onMouseEnter={() => {
          if (el.urlXray) {
            setXrayUrl(el.urlXray);
          }
        }}
        className={`text-left rounded-lg border px-3 py-2 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${getButtonStyle(
          el
        )} ${extraClass}`}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm leading-relaxed break-words">{el.text}</span>
          {isFound && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {!isFound && isSafeClicked && (
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          )}
        </div>
        {el.urlXray && (
          <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300">
            <Search className="w-3 h-3" />
            Hover or click to inspect URL with X-Ray
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Patient Message Examination</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click suspicious parts of the message below to diagnose red flags.
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-400 shrink-0">
          {patient.commType} VIEW
        </span>
      </div>

      {/* Simulated Device / Client Message Container */}
      {patient.commType === 'SMS' && (
        <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-4 sm:p-5 max-w-xl w-full mx-auto space-y-4">
          {/* Phone Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Sender Contact</p>
                {renderInteractivePart('p1-sender', 'mt-1 !py-1 !px-2.5')}
              </div>
            </div>
            <div>{renderInteractivePart('p1-timestamp', '!py-1 !px-2.5 text-xs')}</div>
          </div>

          {/* SMS Bubble */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm p-4 space-y-2.5">
            {renderInteractivePart('p1-greeting', 'w-full')}
            {renderInteractivePart('p1-threat', 'w-full')}
            {renderInteractivePart('p1-deadline', 'w-full')}
            {renderInteractivePart('p1-url', 'w-full font-mono')}
            {renderInteractivePart('p1-footer', 'w-full')}
          </div>
        </div>
      )}

      {patient.commType === 'EMAIL' && (
        <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          {/* Email Header */}
          <div className="space-y-2.5 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
              <Mail className="w-4 h-4" />
              <span>INBOX MESSAGE</span>
            </div>
            <h4 className="text-base font-semibold text-white">
              {patient.messageMeta.subjectOrHeader}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <span className="text-xs text-slate-400 block mb-1">From:</span>
                {renderInteractivePart('p2-sender', 'w-full font-mono')}
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">To:</span>
                {renderInteractivePart('p2-recipient', 'w-full font-mono')}
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-3">
            {renderInteractivePart('p2-offer', 'w-full')}
            {renderInteractivePart('p2-pii', 'w-full')}
            {renderInteractivePart('p2-portal-link', 'w-full font-mono')}
            {renderInteractivePart('p2-signoff', 'w-full')}
          </div>

          {/* Attachment */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <Paperclip className="w-3.5 h-3.5" />
              <span>1 Attachment</span>
            </div>
            {renderInteractivePart('p2-attachment', 'w-full sm:w-auto font-mono')}
          </div>
        </div>
      )}

      {patient.commType === 'SOCIAL' && (
        <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          {/* Social Alert Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-rose-400 inline-flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                {patient.messageMeta.subjectOrHeader}
              </span>
              <div className="mt-2">
                <span className="text-xs text-slate-400 block mb-1">From Address:</span>
                {renderInteractivePart('p3-sender', 'font-mono')}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Account Handle:</span>
              {renderInteractivePart('p3-handle', 'font-mono')}
            </div>
          </div>

          {/* Alert Body */}
          <div className="space-y-3">
            {renderInteractivePart('p3-warning', 'w-full')}
            {renderInteractivePart('p3-url', 'w-full font-mono')}
            {renderInteractivePart('p3-credentials', 'w-full')}
            {renderInteractivePart('p3-footer', 'w-full')}
          </div>
        </div>
      )}

      {/* Examination Feedback Banner */}
      {feedback ? (
        <div
          className={`rounded-xl border p-4 transition-all ${
            feedback.isRedFlag
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100'
              : 'bg-amber-500/10 border-amber-500/40 text-amber-100'
          }`}
        >
          <div className="flex items-start gap-3">
            {feedback.isRedFlag ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-semibold">{feedback.title}</p>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                {feedback.detail}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-[#0B1120] p-4 text-xs sm:text-sm text-slate-400 flex items-center gap-2.5">
          <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Select any suspicious sender, urgent threat, link, or attachment in the message above to analyze it.
          </span>
        </div>
      )}

      {/* URL X-Ray Inspector Panel */}
      <div className="rounded-xl border border-slate-800 bg-[#0B1120] p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
            <Link2 className="w-4 h-4" />
            <span>URL X-Ray Inspector</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 inline-flex items-center gap-1">
            <Lock className="w-3 h-3" /> Safe Sandbox Preview
          </span>
        </div>

        {xrayUrl ? (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                <span className="text-slate-400 block">Displayed URL</span>
                <span className="font-mono text-slate-200 break-all mt-0.5 block">
                  {xrayUrl.displayedUrl}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                <span className="text-slate-400 block">Destination Domain</span>
                <span className="font-mono text-rose-300 break-all mt-0.5 block">
                  {xrayUrl.destinationDomain}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${
                  xrayUrl.verdict === 'TRUSTED'
                    ? 'text-emerald-400'
                    : xrayUrl.verdict === 'SUSPICIOUS'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {xrayUrl.verdict === 'TRUSTED' ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                Verdict: {xrayUrl.verdict}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{xrayUrl.explanation}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            No hyperlink detected in this message. Hover or click on any URL in supported cases to inspect its real destination safely.
          </p>
        )}
      </div>
    </div>
  );
}
