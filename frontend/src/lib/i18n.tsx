"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "te";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.apply": "Get Help",
  "nav.track": "Track Case",
  "nav.resources": "Resources",
  "nav.book": "Book a Call",
  "nav.admin": "Owner Login",
  "nav.menu": "Menu",
  "lang.toggle": "తెలుగు",

  "hero.badge": "Pro bono · 100% free",
  "hero.title": "Free legal guidance, for everyone.",
  "hero.subtitle":
    "Can't afford a lawyer? Tell us your problem in a few steps. A volunteer reviews every case and gets back to you within 48 hours — confidentially, at no cost.",
  "hero.cta": "Start your request",
  "hero.secondary": "Track an existing case",

  "stats.cases": "Cases helped",
  "stats.response": "Avg. response time",
  "stats.free": "Always free",
  "stats.hours": "48 hours",
  "stats.zero": "₹0",

  "cats.title": "What do you need help with?",
  "cats.subtitle": "Pick the area closest to your situation. Not sure? Choose “Other”.",
  "cat.family": "Family Law",
  "cat.criminal": "Criminal Matter",
  "cat.property": "Property Dispute",
  "cat.consumer": "Consumer Rights",
  "cat.labour": "Labour & Employment",
  "cat.dv": "Domestic Violence",
  "cat.cyber": "Cyber Crime",
  "cat.debt": "Debt & Recovery",
  "cat.other": "Other",

  "how.title": "How it works",
  "how.step1.t": "Tell us your issue",
  "how.step1.d": "A short 4-step form — no legal jargon needed.",
  "how.step2.t": "Get a reference number",
  "how.step2.d": "Instant confirmation by email with your LA- reference.",
  "how.step3.t": "A volunteer responds",
  "how.step3.d": "We review and reply within 48 hours, or chat live.",

  "cta.title": "You deserve to be heard.",
  "cta.body": "Starting takes two minutes and costs nothing.",
  "cta.button": "Get free help now",

  "footer.tagline": "A pro bono initiative providing free legal guidance to those who need it most.",
  "footer.urgent": "For life-threatening emergencies dial 112. NALSA legal helpline: 15100.",
  "footer.rights": "This portal does not replace formal legal representation.",

  // form
  "form.title": "Request legal help",
  "form.step": "Step",
  "form.of": "of",
  "form.s1": "Your issue",
  "form.s2": "About you",
  "form.s3": "Your case",
  "form.s4": "Review",
  "form.next": "Continue",
  "form.back": "Back",
  "form.submit": "Submit request",
  "form.name": "Full name",
  "form.age": "Age",
  "form.phone": "Phone number",
  "form.email": "Email",
  "form.state": "State",
  "form.language": "Preferred language",
  "form.summary": "One-line summary",
  "form.description": "Describe what happened",
  "form.descHint": "At least 50 characters. Include dates, names, and what you want to happen.",
  "form.urgency": "How urgent is this?",
  "form.prior": "Have you consulted a lawyer before?",
  "form.documents": "Documents you have (optional)",
  "form.required": "required",
  "form.yes": "Yes",
  "form.no": "No",
  "urgency.LOW": "Low",
  "urgency.MEDIUM": "Medium",
  "urgency.HIGH": "High",
  "urgency.CRITICAL": "Critical",

  "form.done.title": "Request received",
  "form.done.body": "Keep this reference number safe — you'll need it to track your case or chat with us.",
  "form.done.track": "Track this case",
  "form.done.chat": "Chat with a volunteer",

  // track
  "track.title": "Track your case",
  "track.subtitle": "Enter the LA- reference number from your confirmation email.",
  "track.placeholder": "e.g. LA-7F3K9Q",
  "track.button": "Check status",
  "track.notfound": "We couldn't find a case with that reference number.",
  "track.status": "Current status",
  "track.submitted": "Submitted",
  "track.updated": "Last updated",
  "track.openChat": "Open live chat",

  "status.PENDING": "Pending review",
  "status.IN_PROGRESS": "In progress",
  "status.RESPONDED": "Responded",
  "status.CLOSED": "Closed",

  // chat
  "chat.title": "Live chat",
  "chat.placeholder": "Type your message…",
  "chat.send": "Send",
  "chat.connecting": "Connecting…",
  "chat.empty": "No messages yet. Say hello and a volunteer will reply here.",
  "chat.you": "You",
  "chat.volunteer": "Volunteer",

  // resources
  "res.title": "Legal resources",
  "res.subtitle": "Plain-language guides to common legal questions.",
  "res.empty": "Articles are coming soon. Check back shortly.",
  "res.read": "Read guide",
  "res.back": "All resources",

  // booking
  "book.title": "Book a free consultation",
  "book.subtitle": "Choose a 15-minute slot and we'll call you.",
  "book.none": "No slots are open right now. Please submit a request instead.",
  "book.confirm": "Confirm booking",
  "book.booked": "Your consultation is booked. Check your email for details.",
  "book.reason": "What's it about? (optional)",
};

const te: Dict = {
  "nav.apply": "సహాయం పొందండి",
  "nav.track": "కేసు ట్రాక్ చేయండి",
  "nav.resources": "వనరులు",
  "nav.book": "కాల్ బుక్ చేయండి",
  "nav.admin": "యజమాని లాగిన్",
  "nav.menu": "మెను",
  "lang.toggle": "English",

  "hero.badge": "ఉచిత సేవ · 100% ఉచితం",
  "hero.title": "ప్రతి ఒక్కరికీ ఉచిత న్యాయ సలహా.",
  "hero.subtitle":
    "లాయర్‌ను భరించలేరా? మీ సమస్యను కొన్ని దశల్లో చెప్పండి. ప్రతి కేసును ఒక వాలంటీర్ సమీక్షించి 48 గంటల్లో మీకు తిరిగి సమాధానం ఇస్తారు — గోప్యంగా, ఉచితంగా.",
  "hero.cta": "మీ అభ్యర్థన ప్రారంభించండి",
  "hero.secondary": "ఉన్న కేసును ట్రాక్ చేయండి",

  "stats.cases": "సహాయం చేసిన కేసులు",
  "stats.response": "సగటు స్పందన సమయం",
  "stats.free": "ఎల్లప్పుడూ ఉచితం",
  "stats.hours": "48 గంటలు",
  "stats.zero": "₹0",

  "cats.title": "మీకు ఏ విషయంలో సహాయం కావాలి?",
  "cats.subtitle": "మీ పరిస్థితికి దగ్గరగా ఉన్నదాన్ని ఎంచుకోండి. తెలియకపోతే “ఇతరం” ఎంచుకోండి.",
  "cat.family": "కుటుంబ చట్టం",
  "cat.criminal": "క్రిమినల్ విషయం",
  "cat.property": "ఆస్తి వివాదం",
  "cat.consumer": "వినియోగదారు హక్కులు",
  "cat.labour": "కార్మిక & ఉద్యోగం",
  "cat.dv": "గృహ హింస",
  "cat.cyber": "సైబర్ నేరం",
  "cat.debt": "అప్పు & రికవరీ",
  "cat.other": "ఇతరం",

  "how.title": "ఇది ఎలా పనిచేస్తుంది",
  "how.step1.t": "మీ సమస్యను చెప్పండి",
  "how.step1.d": "చిన్న 4-దశల ఫారం — న్యాయ పదజాలం అవసరం లేదు.",
  "how.step2.t": "రిఫరెన్స్ నంబర్ పొందండి",
  "how.step2.d": "మీ LA- రిఫరెన్స్‌తో ఇమెయిల్ ద్వారా తక్షణ నిర్ధారణ.",
  "how.step3.t": "వాలంటీర్ స్పందిస్తారు",
  "how.step3.d": "48 గంటల్లో సమీక్షించి సమాధానం ఇస్తాం, లేదా లైవ్ చాట్.",

  "cta.title": "మీ గొంతు వినిపించాలి.",
  "cta.body": "ప్రారంభించడానికి రెండు నిమిషాలు, ఖర్చు శూన్యం.",
  "cta.button": "ఇప్పుడే ఉచిత సహాయం పొందండి",

  "footer.tagline": "అవసరమైన వారికి ఉచిత న్యాయ సలహా అందించే ఒక సేవా కార్యక్రమం.",
  "footer.urgent": "ప్రాణాపాయ అత్యవసర పరిస్థితుల్లో 112కు కాల్ చేయండి. NALSA హెల్ప్‌లైన్: 15100.",
  "footer.rights": "ఈ పోర్టల్ అధికారిక న్యాయ ప్రాతినిధ్యానికి ప్రత్యామ్నాయం కాదు.",

  "form.title": "న్యాయ సహాయం కోసం అభ్యర్థన",
  "form.step": "దశ",
  "form.of": "/",
  "form.s1": "మీ సమస్య",
  "form.s2": "మీ గురించి",
  "form.s3": "మీ కేసు",
  "form.s4": "సమీక్ష",
  "form.next": "కొనసాగించండి",
  "form.back": "వెనుకకు",
  "form.submit": "అభ్యర్థన సమర్పించండి",
  "form.name": "పూర్తి పేరు",
  "form.age": "వయస్సు",
  "form.phone": "ఫోన్ నంబర్",
  "form.email": "ఇమెయిల్",
  "form.state": "రాష్ట్రం",
  "form.language": "ఇష్టమైన భాష",
  "form.summary": "ఒక్క వాక్యం సారాంశం",
  "form.description": "ఏం జరిగిందో వివరించండి",
  "form.descHint": "కనీసం 50 అక్షరాలు. తేదీలు, పేర్లు, మీరు ఏం కోరుకుంటున్నారో చేర్చండి.",
  "form.urgency": "ఇది ఎంత అత్యవసరం?",
  "form.prior": "మీరు ఇంతకుముందు లాయర్‌ను సంప్రదించారా?",
  "form.documents": "మీ వద్ద ఉన్న పత్రాలు (ఐచ్ఛికం)",
  "form.required": "తప్పనిసరి",
  "form.yes": "అవును",
  "form.no": "కాదు",
  "urgency.LOW": "తక్కువ",
  "urgency.MEDIUM": "మధ్యస్థం",
  "urgency.HIGH": "అధికం",
  "urgency.CRITICAL": "క్లిష్టం",

  "form.done.title": "అభ్యర్థన అందింది",
  "form.done.body": "ఈ రిఫరెన్స్ నంబర్‌ను భద్రంగా ఉంచుకోండి — కేసు ట్రాక్ చేయడానికి లేదా చాట్ చేయడానికి అవసరం.",
  "form.done.track": "ఈ కేసును ట్రాక్ చేయండి",
  "form.done.chat": "వాలంటీర్‌తో చాట్ చేయండి",

  "track.title": "మీ కేసును ట్రాక్ చేయండి",
  "track.subtitle": "మీ నిర్ధారణ ఇమెయిల్‌లోని LA- రిఫరెన్స్ నంబర్‌ను నమోదు చేయండి.",
  "track.placeholder": "ఉదా. LA-7F3K9Q",
  "track.button": "స్థితి తనిఖీ చేయండి",
  "track.notfound": "ఆ రిఫరెన్స్ నంబర్‌తో కేసు దొరకలేదు.",
  "track.status": "ప్రస్తుత స్థితి",
  "track.submitted": "సమర్పించింది",
  "track.updated": "చివరి నవీకరణ",
  "track.openChat": "లైవ్ చాట్ తెరవండి",

  "status.PENDING": "సమీక్ష పెండింగ్",
  "status.IN_PROGRESS": "ప్రాసెస్‌లో ఉంది",
  "status.RESPONDED": "స్పందించారు",
  "status.CLOSED": "ముగిసింది",

  "chat.title": "లైవ్ చాట్",
  "chat.placeholder": "మీ సందేశం టైప్ చేయండి…",
  "chat.send": "పంపండి",
  "chat.connecting": "కనెక్ట్ అవుతోంది…",
  "chat.empty": "ఇంకా సందేశాలు లేవు. హలో చెప్పండి, వాలంటీర్ ఇక్కడ సమాధానం ఇస్తారు.",
  "chat.you": "మీరు",
  "chat.volunteer": "వాలంటీర్",

  "res.title": "న్యాయ వనరులు",
  "res.subtitle": "సాధారణ న్యాయ ప్రశ్నలకు సరళమైన గైడ్‌లు.",
  "res.empty": "వ్యాసాలు త్వరలో వస్తాయి. కొద్దిసేపటికి తిరిగి చూడండి.",
  "res.read": "గైడ్ చదవండి",
  "res.back": "అన్ని వనరులు",

  "book.title": "ఉచిత సంప్రదింపు బుక్ చేయండి",
  "book.subtitle": "15 నిమిషాల స్లాట్ ఎంచుకోండి, మేం కాల్ చేస్తాం.",
  "book.none": "ప్రస్తుతం స్లాట్‌లు లేవు. బదులుగా అభ్యర్థన సమర్పించండి.",
  "book.confirm": "బుకింగ్ నిర్ధారించండి",
  "book.booked": "మీ సంప్రదింపు బుక్ అయింది. వివరాల కోసం ఇమెయిల్ చూడండి.",
  "book.reason": "ఇది దేని గురించి? (ఐచ్ఛికం)",
};

const dicts: Record<Lang, Dict> = { en, te };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "en" || saved === "te") {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", l);
      document.documentElement.lang = l;
    }
  };

  const t = (key: string) => dicts[lang][key] ?? dicts.en[key] ?? key;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
