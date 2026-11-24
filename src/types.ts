export type CommunicationType = 'SMS' | 'EMAIL' | 'SOCIAL';

export type UrlVerdict = 'TRUSTED' | 'SUSPICIOUS' | 'UNKNOWN';

export interface UrlXrayInfo {
  displayedUrl: string;
  destinationDomain: string;
  verdict: UrlVerdict;
  explanation: string;
}

export interface MessageElement {
  id: string;
  label: string;
  text: string;
  isRedFlag: boolean;
  category: string;
  explanation: string;
  urlXray?: UrlXrayInfo;
}

export interface PatientCase {
  id: string;
  caseNumber: string;
  patientName: string;
  patientRole: string;
  patientAge: number;
  commType: CommunicationType;
  commLabel: string;
  scenario: string;
  timeLimitSeconds: number;
  diagnosisTitle: string;
  diagnosisVerdict: string;
  riskLevel: string;
  learningObjectives: string[];
  messageMeta: {
    senderDisplay: string;
    senderHandleId: string;
    subjectOrHeader: string;
    timestamp: string;
    recipient: string;
    attachmentName?: string;
    attachmentId?: string;
  };
  elements: MessageElement[];
}

export interface CaseProgress {
  foundFlagIds: string[];
  clickedSafeIds: string[];
  totalAttempts: number;
  timeRemaining: number;
  timeSpent: number;
  completed: boolean;
  bonusAwarded: boolean;
}

export interface FeedbackMessage {
  elementId: string;
  isRedFlag: boolean;
  title: string;
  detail: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  exampleTip: string;
}

export type ActiveView = 'simulator' | 'learning' | 'report';
