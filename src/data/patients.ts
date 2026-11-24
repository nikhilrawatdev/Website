import { LearningTopic, PatientCase } from '../types';

export const POINTS_PER_RED_FLAG = 10;
export const TIME_BONUS_POINTS = 10;

export const PATIENT_CASES: PatientCase[] = [
  {
    id: 'patient-1',
    caseNumber: 'CASE-001',
    patientName: 'Riya Sharma',
    patientRole: '2nd Year Engineering Student',
    patientAge: 19,
    commType: 'SMS',
    commLabel: 'Mobile SMS Alert',
    scenario:
      'Riya received an urgent text message claiming her bank account will be frozen unless she updates her KYC details immediately.',
    timeLimitSeconds: 120,
    diagnosisTitle: 'Bank KYC Smishing Attack',
    diagnosisVerdict:
      'Confirmed SMS Phishing (Smishing). Attackers impersonated a bank using a personal mobile number, panic-inducing suspension threats, and a disguised shortened link.',
    riskLevel: 'Critical Threat',
    learningObjectives: [
      'Recognizing suspicious personal mobile senders',
      'Identifying urgency-based psychological manipulation',
      'Inspecting shortened URLs before clicking',
      'Understanding how real banks communicate KYC updates',
    ],
    messageMeta: {
      senderDisplay: '+91 98401 00419',
      senderHandleId: 'p1-sender',
      subjectOrHeader: 'Messages · SMS',
      timestamp: 'Today, 10:14 AM',
      recipient: 'Riya Sharma',
    },
    elements: [
      {
        id: 'p1-sender',
        label: 'Sender Number',
        text: '+91 98401 00419',
        isRedFlag: true,
        category: 'Suspicious Sender',
        explanation:
          'Official banks send automated SMS alerts from registered alphanumeric sender IDs (such as AD-BANKIN), never from random 10-digit personal mobile numbers.',
      },
      {
        id: 'p1-timestamp',
        label: 'Message Timestamp',
        text: 'Today, 10:14 AM',
        isRedFlag: false,
        category: 'Normal Metadata',
        explanation:
          'A standard delivery timestamp from your phone messaging app does not indicate phishing by itself.',
      },
      {
        id: 'p1-greeting',
        label: 'Message Greeting',
        text: 'Dear Valued Bank Customer,',
        isRedFlag: false,
        category: 'Standard Greeting',
        explanation:
          'While generic greetings are common in bulk messages, the greeting alone is not strong enough proof compared to sender, threat, and link evidence.',
      },
      {
        id: 'p1-threat',
        label: 'Account Suspension Threat',
        text: 'your Savings Account will be PERMANENTLY SUSPENDED due to incomplete KYC verification.',
        isRedFlag: true,
        category: 'Fear & Urgency',
        explanation:
          'Cybercriminals use threatening language like "permanently suspended" to trigger panic so victims act before thinking or checking their official banking app.',
      },
      {
        id: 'p1-deadline',
        label: 'Short Deadline',
        text: 'Update immediately within 2 hours to avoid account freeze.',
        isRedFlag: true,
        category: 'Artificial Deadline',
        explanation:
          'Legitimate banks give weeks of advance notice through official apps and statements. A 2-hour countdown is a classic social engineering pressure tactic.',
      },
      {
        id: 'p1-url',
        label: 'Shortened Verification Link',
        text: 'https://bit.ly/kyc-hdfc-update99',
        isRedFlag: true,
        category: 'Suspicious URL',
        explanation:
          'URL shorteners hide the actual destination website. Running X-Ray reveals it redirects to a fake lookalike domain designed to steal banking logins and OTPs.',
        urlXray: {
          displayedUrl: 'https://bit.ly/kyc-hdfc-update99',
          destinationDomain: 'http://kyc-update-portal-88.xyz/bank-login',
          verdict: 'SUSPICIOUS',
          explanation:
            'Shortened link masks an unverified .xyz domain. Official banks always use their own verified domain (e.g., bankname.com) and HTTPS.',
        },
      },
      {
        id: 'p1-footer',
        label: 'Closing Text',
        text: 'Thank you for banking with us.',
        isRedFlag: false,
        category: 'Polite Sign-off',
        explanation:
          'Scammers often copy polite closing phrases from real bank alerts to look authentic. This line itself is harmless text.',
      },
    ],
  },
  {
    id: 'patient-2',
    caseNumber: 'CASE-002',
    patientName: 'Aarav Mehta',
    patientRole: 'Final Year BTech Student',
    patientAge: 21,
    commType: 'EMAIL',
    commLabel: 'Recruitment Email',
    scenario:
      'Aarav is applying for placements and received an email offering a high-paying remote job with no interview, asking for personal documents and containing a suspicious file.',
    timeLimitSeconds: 150,
    diagnosisTitle: 'Fake Recruitment & Malware Phishing',
    diagnosisVerdict:
      'Confirmed Email Phishing (Identity Theft & Malware). The attacker used a lookalike domain, an unrealistic job offer, sensitive KYC requests, and a dangerous attachment.',
    riskLevel: 'High Risk Threat',
    learningObjectives: [
      'Verifying corporate sender email domains',
      'Spotting "too good to be true" job offers',
      'Protecting Aadhaar, PAN, and bank details',
      'Recognizing dangerous double-extension attachments',
    ],
    messageMeta: {
      senderDisplay: 'GlobalTech HR Desk',
      senderHandleId: 'p2-sender',
      subjectOrHeader: 'URGENT: Direct Selection – Remote Software Intern (₹1,45,000/mo)',
      timestamp: 'Nov 24, 2026 · 09:30 AM',
      recipient: 'aarav.mehta.2026@college.edu',
      attachmentName: 'Offer_Letter_2026.pdf.exe',
      attachmentId: 'p2-attachment',
    },
    elements: [
      {
        id: 'p2-sender',
        label: 'Sender Email Domain',
        text: 'hr-careers@globaltech-hiring-portal.xyz',
        isRedFlag: true,
        category: 'Suspicious Domain',
        explanation:
          'Major tech companies send recruitment emails from their official corporate domain (e.g., @globaltech.com), not from newly registered .xyz lookalike domains.',
      },
      {
        id: 'p2-recipient',
        label: 'Recipient Address',
        text: 'aarav.mehta.2026@college.edu',
        isRedFlag: false,
        category: 'Recipient Field',
        explanation:
          'Seeing your own email address in the "To" field only means the message was sent to you; scammers often scrape student emails from public portals.',
      },
      {
        id: 'p2-offer',
        label: 'Unrealistic Offer',
        text: 'Congratulations! You have been selected WITHOUT any technical interview for a Remote Software Role paying ₹1,45,000/month.',
        isRedFlag: true,
        category: 'Too Good To Be True',
        explanation:
          'No legitimate employer hires candidates for high-paying engineering roles without conducting interviews or verifying skills. Unrealistic rewards are used to lower your guard.',
      },
      {
        id: 'p2-pii',
        label: 'Sensitive Data Request',
        text: 'Reply with your Aadhaar number, PAN card scan, and bank account number to unlock your joining bonus.',
        isRedFlag: true,
        category: 'Sensitive Info Request',
        explanation:
          'Never share national ID scans or bank account credentials over unverified email. Attackers use these documents for identity theft and financial fraud.',
      },
      {
        id: 'p2-attachment',
        label: 'Unexpected Attachment',
        text: 'Offer_Letter_2026.pdf.exe (2.4 MB)',
        isRedFlag: true,
        category: 'Malicious Attachment',
        explanation:
          'Look closely at the double extension ".pdf.exe"! It is disguised as a PDF document, but ".exe" means it is an executable program that can install malware or ransomware.',
      },
      {
        id: 'p2-portal-link',
        label: 'Reference Portal URL',
        text: 'https://globaltech-hiring-portal.xyz/careers',
        isRedFlag: false,
        category: 'Unverified Reference Link',
        explanation:
          'You checked the footer URL with X-Ray! While the domain matches the suspicious sender above, focus on the primary red flags in the header, offer, data request, and attachment.',
        urlXray: {
          displayedUrl: 'https://globaltech-hiring-portal.xyz/careers',
          destinationDomain: 'https://globaltech-hiring-portal.xyz/careers',
          verdict: 'UNKNOWN',
          explanation:
            'Domain was registered recently on a low-cost .xyz TLD and does not match an established company website.',
        },
      },
      {
        id: 'p2-signoff',
        label: 'Email Signature',
        text: 'Warm Regards, Talent Acquisition Team',
        isRedFlag: false,
        category: 'Standard Sign-off',
        explanation:
          'A generic signature block is easy for anyone to type and is not a technical indicator of phishing on its own.',
      },
    ],
  },
  {
    id: 'patient-3',
    caseNumber: 'CASE-003',
    patientName: 'Ananya Verma',
    patientRole: 'College Media Club Lead',
    patientAge: 20,
    commType: 'SOCIAL',
    commLabel: 'Social Media Security Warning',
    scenario:
      'Ananya received an alarming message claiming her Instagram account violated copyright rules and will be deleted unless she verifies her login credentials.',
    timeLimitSeconds: 120,
    diagnosisTitle: 'Account Takeover & Credential Harvesting',
    diagnosisVerdict:
      'Confirmed Credential Phishing. The attacker impersonated social media support with a fake deletion warning, a spoofed verification link, and a password theft request.',
    riskLevel: 'Critical Threat',
    learningObjectives: [
      'Recognizing social media support impersonation',
      'Understanding why platforms never ask for passwords',
      'Spotting fake verification subdomain tricks',
      'Enabling 2FA and checking in-app security logs',
    ],
    messageMeta: {
      senderDisplay: 'InstaSupport Official',
      senderHandleId: 'p3-sender',
      subjectOrHeader: 'Security Center · Policy Violation Notice',
      timestamp: 'Yesterday, 11:48 PM',
      recipient: '@ananya.v_',
    },
    elements: [
      {
        id: 'p3-sender',
        label: 'Impersonation Sender',
        text: 'support-alerts@insta-helpdesk-verify.com',
        isRedFlag: true,
        category: 'Fake Support Sender',
        explanation:
          'Social platforms send official notices from their root domain (like @mail.instagram.com) and display them inside your app Settings > Emails from Instagram.',
      },
      {
        id: 'p3-handle',
        label: 'Mentioned Username',
        text: '@ananya.v_',
        isRedFlag: false,
        category: 'Public Handle',
        explanation:
          'Social media usernames are publicly visible. Mentioning your handle does not mean the message came from the real platform.',
      },
      {
        id: 'p3-warning',
        label: 'Fake Account Warning',
        text: 'Copyright Strike Detected: Your account will be PERMANENTLY DELETED in 12 hours unless you submit an appeal.',
        isRedFlag: true,
        category: 'False Security Threat',
        explanation:
          'Attackers invent fake copyright or policy violations to scare creators and students into rushing through a fake appeal form.',
      },
      {
        id: 'p3-url',
        label: 'Fake Verification Link',
        text: 'https://instagram-appeal.verify-account-now.net/login',
        isRedFlag: true,
        category: 'Spoofed Verification URL',
        explanation:
          'Notice the real domain before "/login" is "verify-account-now.net", NOT "instagram.com"! Attackers put trusted brand names in subdomains to trick readers.',
        urlXray: {
          displayedUrl: 'https://instagram-appeal.verify-account-now.net/login',
          destinationDomain: 'verify-account-now.net (Subdomain Spoof)',
          verdict: 'SUSPICIOUS',
          explanation:
            'Look at the root domain right before the first single slash: verify-account-now.net is not owned by Meta/Instagram.',
        },
      },
      {
        id: 'p3-credentials',
        label: 'Credential Request',
        text: 'Confirm your current password and 2FA recovery code on the appeal page to restore access.',
        isRedFlag: true,
        category: 'Credential Harvesting',
        explanation:
          'Legitimate support teams will NEVER ask for your password or 2FA backup codes. Giving these lets the attacker hijack your account instantly.',
      },
      {
        id: 'p3-footer',
        label: 'Alert Footer',
        text: 'Help Center · Community Guidelines',
        isRedFlag: false,
        category: 'Cosmetic Footer',
        explanation:
          'Phishers copy standard footer words like "Help Center" from legitimate apps to make fake messages look trustworthy.',
      },
    ],
  },
];

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'what-is-phishing',
    title: '1. What is Phishing?',
    summary:
      'Phishing is a cyberattack where scammers pretend to be a trusted bank, company, college, or friend to trick you into sharing passwords, OTPs, or money.',
    keyPoints: [
      'Relies on deception rather than breaking technical encryption.',
      'Often creates false urgency, fear, or excitement (like winning a prize).',
      'Targets students, employees, and everyday users via messages and links.',
    ],
    exampleTip: 'Always pause for 10 seconds before clicking any unexpected urgent message.',
  },
  {
    id: 'smishing',
    title: '2. What is SMS Phishing (Smishing)?',
    summary:
      'Smishing (SMS + Phishing) happens over text messages. Attackers send fake delivery alerts, bank KYC warnings, or electricity bill threats.',
    keyPoints: [
      'Frequently comes from unknown 10-digit personal mobile numbers.',
      'Uses shortened links (bit.ly, tinyurl) to hide dangerous websites.',
      'Pressures victims with short 1–2 hour deadlines.',
    ],
    exampleTip: 'Open your official bank app directly instead of clicking links inside SMS alerts.',
  },
  {
    id: 'email-phishing',
    title: '3. What is Email Phishing?',
    summary:
      'Email phishing uses fake emails that look like HR teams, universities, or tech support to steal credentials or deliver malware attachments.',
    keyPoints: [
      'Check the exact email domain after the "@" symbol for subtle typos.',
      'Watch out for fake job offers with zero interviews and high salaries.',
      'Never open unexpected .exe, .zip, or double-extension files (.pdf.exe).',
    ],
    exampleTip: 'Hover over the sender address and links to verify the real domain before trusting.',
  },
  {
    id: 'social-engineering',
    title: '4. What is Social Engineering?',
    summary:
      'Social engineering is the art of manipulating human emotions—fear, curiosity, greed, or authority—so people make security mistakes willingly.',
    keyPoints: [
      'Fear: "Your account will be deleted tonight!"',
      'Greed: "Direct job selection with ₹1.45L/month stipend!"',
      'Authority: Impersonating IT admins, professors, or bank officers.',
    ],
    exampleTip: 'Strong emotional pressure in a message is your biggest signal to verify independently.',
  },
  {
    id: 'suspicious-urls',
    title: '5. How to Identify Suspicious URLs',
    summary:
      'Attackers hide malicious websites behind URL shorteners, misspellings, or misleading subdomains.',
    keyPoints: [
      'Read the root domain right before the first "/" (e.g., in fake-bank.verify.xyz, the real owner is verify.xyz).',
      'Be cautious of unusual endings like .xyz, .top, or random numbers.',
      'Check for typosquatting like "paypa1.com" or "instagarm-support.net".',
    ],
    exampleTip: 'Use a URL inspector or hover preview before tapping any link on mobile or desktop.',
  },
  {
    id: 'protect-info',
    title: '6. How to Protect Personal Information',
    summary:
      'Keep your digital identity safe by limiting what you share and locking accounts with strong authentication.',
    keyPoints: [
      'Never share passwords, OTPs, PINs, or 2FA backup codes with anyone.',
      'Do not send Aadhaar, PAN, or passport scans to unverified email addresses.',
      'Use unique passwords for banking, email, and social media + enable 2FA.',
    ],
    exampleTip: 'No real bank or support team ever needs your password or OTP to "verify" you.',
  },
  {
    id: 'after-suspicious',
    title: '7. What to Do After Receiving a Suspicious Message',
    summary:
      'If you receive—or accidentally click—a suspicious message, quick action can stop account compromise.',
    keyPoints: [
      'Do not reply, click links, or download attachments.',
      'Verify by visiting the official website or calling the official helpline.',
      'If you entered a password, change it immediately and enable 2FA.',
      'Report phishing SMS/emails to your IT team, bank, or cybercrime portal (cybercrime.gov.in / 1930 in India).',
    ],
    exampleTip: 'Block the sender and delete the message after reporting it so you do not click it later.',
  },
];
