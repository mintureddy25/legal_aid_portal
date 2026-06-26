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
    "Can't afford a lawyer? Tell us your problem in a few steps. A volunteer reviews every case and gets back to you within 24 hours — confidentially, at no cost. Need to talk? Use the live chat.",
  "hero.cta": "Start your request",
  "hero.secondary": "Track an existing case",

  "stats.cases": "Cases helped",
  "stats.response": "Avg. response time",
  "stats.free": "Always free",
  "stats.hours": "24 hours",
  "stats.zero": "₹0",
  "stats.chat": "Live chat support",
  "stats.chatValue": "Live",

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
  "how.step3.d": "We review and reply within 24 hours, or chat live with you.",

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
  "track.chatClosed": "This case is closed. Live chat is no longer available.",

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
  "chat.loading": "Loading messages…",
  "chat.closed": "This case is closed — live chat is no longer available.",

  // resources
  "res.title": "Legal resources",
  "res.subtitle": "Plain-language guides to common legal questions.",
  "res.empty": "Articles are coming soon. Check back shortly.",
  "res.read": "Read guide",
  "res.back": "All resources",
  "res.loading": "Loading resources…",

  // booking
  "book.title": "Book a free consultation",
  "book.subtitle": "Choose a 15-minute slot and we'll call you.",
  "book.none": "No slots are open right now. Please submit a request instead.",
  "book.confirm": "Confirm booking",
  "book.booked": "Your consultation is booked. Check your email for details.",
  "book.reason": "What's it about? (optional)",
  "book.loading": "Loading slots…",
  "book.bookThis": "Book this slot",
  "book.selected": "Selected slot",
  "book.change": "Change",

  // ── Landing page sections ──
  "home.hero.eyebrow": "Securing your future",
  "home.hero.title": "Legal solutions and support you can rely on",
  "home.hero.subtitle":
    "Free, confidential legal aid for everyone. Our volunteer lawyers guide you through every step — with live chat support and a response within 24 hours.",
  "home.hero.cta1": "Get help now",
  "home.hero.cta2": "Track my case",
  "home.hero.scroll": "Scroll to explore",
  "home.who.eyebrow": "About us",
  "home.who.title": "Who we are",
  "home.who.body":
    "Nyaya Seva is a pro bono initiative offering free legal guidance to people who need it most — families, women, workers and seniors. Founded by volunteer lawyers, we help our community navigate the legal system with dignity and confidence.",
  "home.what.eyebrow": "What we do",
  "home.what.title": "Practical solutions through trusted legal support",
  "home.what.body":
    "We focus on clear, effective steps that protect your rights at every stage. From your first question to a resolved case, you are never alone.",
  "home.what.cta": "Start your request",
  "home.res.eyebrow": "Resources",
  "home.res.title": "Guides to know your rights",
  "home.res.viewall": "View all",
  "home.res.read": "Read guide",
  "home.partners.title": "Trusted alongside India's legal-aid network",
  "home.partners.body": "We work hand in hand with authorities and NGOs to deliver dependable support.",
  "home.services.eyebrow": "Services",
  "home.services.title": "Everything you need to stand up for your rights",
  "home.services.body":
    "From everyday paperwork to complex disputes, our team helps you act with confidence — and we explain every step in plain language.",
  "home.team.eyebrow": "Team",
  "home.team.title": "Meet our expert team",
  "home.team.body":
    "A team of dedicated volunteer lawyers with years of experience across a wide range of practice areas — here to help you.",
  "home.test.eyebrow": "Testimonials",
  "home.test.title": "Trusted by people across communities",
  "home.test.body": "Real stories from the people we have stood beside.",
  "home.faq.eyebrow": "Answers for your questions",
  "home.faq.title": "Frequently asked questions",
  "home.contact.eyebrow": "Don't be shy",
  "home.contact.title": "Reach out",
  "home.contact.body":
    "Have a question or need help? Send us a message and a volunteer will get back to you within 24 hours.",
  "home.contact.name": "Name",
  "home.contact.email": "Email",
  "home.contact.subject": "Subject",
  "home.contact.message": "Message",
  "home.contact.namePh": "Enter name",
  "home.contact.emailPh": "you@email.com",
  "home.contact.subjectPh": "How can we help?",
  "home.contact.messagePh": "Enter message…",
  "home.contact.send": "Send message",
  "home.contact.sending": "Sending…",
  "home.contact.sentTitle": "Message sent",
  "home.contact.sentBody": "Thank you. We'll be in touch within 24 hours.",
  "home.contact.error": "Something went wrong. Please try again or email us directly.",
  "home.cta.title": "Schedule a free legal consultation",
  "home.cta.body":
    "Discuss your situation with an experienced volunteer. Get clear guidance on your rights and options — no cost, no obligation.",
  "home.cta.button": "Schedule now",
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
    "లాయర్‌ను భరించలేరా? మీ సమస్యను కొన్ని దశల్లో చెప్పండి. ప్రతి కేసును ఒక వాలంటీర్ సమీక్షించి 24 గంటల్లో మీకు తిరిగి సమాధానం ఇస్తారు — గోప్యంగా, ఉచితంగా. మాట్లాడాలా? లైవ్ చాట్ వాడండి.",
  "hero.cta": "మీ అభ్యర్థన ప్రారంభించండి",
  "hero.secondary": "ఉన్న కేసును ట్రాక్ చేయండి",

  "stats.cases": "సహాయం చేసిన కేసులు",
  "stats.response": "సగటు స్పందన సమయం",
  "stats.free": "ఎల్లప్పుడూ ఉచితం",
  "stats.hours": "24 గంటలు",
  "stats.zero": "₹0",
  "stats.chat": "లైవ్ చాట్ సహాయం",
  "stats.chatValue": "లైవ్",

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
  "how.step3.d": "24 గంటల్లో సమీక్షించి సమాధానం ఇస్తాం, లేదా మీతో లైవ్ చాట్.",

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
  "track.chatClosed": "ఈ కేసు ముగిసింది. లైవ్ చాట్ ఇకపై అందుబాటులో లేదు.",

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
  "chat.loading": "సందేశాలు లోడ్ అవుతున్నాయి…",
  "chat.closed": "ఈ కేసు ముగిసింది — లైవ్ చాట్ ఇకపై అందుబాటులో లేదు.",

  "res.title": "న్యాయ వనరులు",
  "res.subtitle": "సాధారణ న్యాయ ప్రశ్నలకు సరళమైన గైడ్‌లు.",
  "res.empty": "వ్యాసాలు త్వరలో వస్తాయి. కొద్దిసేపటికి తిరిగి చూడండి.",
  "res.read": "గైడ్ చదవండి",
  "res.back": "అన్ని వనరులు",
  "res.loading": "వనరులు లోడ్ అవుతున్నాయి…",

  "book.title": "ఉచిత సంప్రదింపు బుక్ చేయండి",
  "book.subtitle": "15 నిమిషాల స్లాట్ ఎంచుకోండి, మేం కాల్ చేస్తాం.",
  "book.none": "ప్రస్తుతం స్లాట్‌లు లేవు. బదులుగా అభ్యర్థన సమర్పించండి.",
  "book.confirm": "బుకింగ్ నిర్ధారించండి",
  "book.booked": "మీ సంప్రదింపు బుక్ అయింది. వివరాల కోసం ఇమెయిల్ చూడండి.",
  "book.reason": "ఇది దేని గురించి? (ఐచ్ఛికం)",
  "book.loading": "స్లాట్‌లు లోడ్ అవుతున్నాయి…",
  "book.bookThis": "ఈ స్లాట్ బుక్ చేయండి",
  "book.selected": "ఎంచుకున్న స్లాట్",
  "book.change": "మార్చండి",

  // ── Landing page sections ──
  "home.hero.eyebrow": "మీ భవిష్యత్తుకు భద్రత",
  "home.hero.title": "మీరు నమ్మదగిన న్యాయ పరిష్కారాలు మరియు మద్దతు",
  "home.hero.subtitle":
    "ప్రతి ఒక్కరికీ ఉచిత, గోప్యమైన న్యాయ సహాయం. మా స్వచ్ఛంద న్యాయవాదులు ప్రతి దశలో మీకు మార్గనిర్దేశం చేస్తారు — లైవ్ చాట్ మద్దతు మరియు 24 గంటల్లో స్పందనతో.",
  "home.hero.cta1": "ఇప్పుడే సహాయం పొందండి",
  "home.hero.cta2": "నా కేసును ట్రాక్ చేయండి",
  "home.hero.scroll": "చూడటానికి స్క్రోల్ చేయండి",
  "home.who.eyebrow": "మా గురించి",
  "home.who.title": "మేము ఎవరం",
  "home.who.body":
    "న్యాయ సేవ అనేది అత్యవసరమైన వారికి — కుటుంబాలు, మహిళలు, కార్మికులు మరియు వృద్ధులకు — ఉచిత న్యాయ మార్గదర్శనం అందించే ఒక ఉచిత సేవా కార్యక్రమం. స్వచ్ఛంద న్యాయవాదులచే స్థాపించబడిన మేము, మా సమాజం న్యాయ వ్యవస్థను గౌరవంగా, నమ్మకంగా అర్థం చేసుకోవడంలో సహాయపడతాం.",
  "home.what.eyebrow": "మేము ఏం చేస్తాం",
  "home.what.title": "విశ్వసనీయ న్యాయ మద్దతు ద్వారా ఆచరణాత్మక పరిష్కారాలు",
  "home.what.body":
    "ప్రతి దశలో మీ హక్కులను రక్షించే స్పష్టమైన, సమర్థవంతమైన చర్యలపై దృష్టి పెడతాం. మీ మొదటి ప్రశ్న నుండి కేసు పరిష్కారం వరకు, మీరు ఎప్పుడూ ఒంటరిగా ఉండరు.",
  "home.what.cta": "మీ అభ్యర్థనను ప్రారంభించండి",
  "home.res.eyebrow": "వనరులు",
  "home.res.title": "మీ హక్కులు తెలుసుకోవడానికి గైడ్‌లు",
  "home.res.viewall": "అన్నీ చూడండి",
  "home.res.read": "గైడ్ చదవండి",
  "home.partners.title": "భారత న్యాయ సహాయ నెట్‌వర్క్‌తో కలిసి విశ్వసనీయం",
  "home.partners.body": "విశ్వసనీయ మద్దతు అందించడానికి అధికారులు మరియు స్వచ్ఛంద సంస్థలతో కలిసి పనిచేస్తాం.",
  "home.services.eyebrow": "సేవలు",
  "home.services.title": "మీ హక్కుల కోసం నిలబడటానికి కావలసినదంతా",
  "home.services.body":
    "రోజువారీ పత్రాల నుండి సంక్లిష్ట వివాదాల వరకు, మా బృందం మీకు నమ్మకంగా వ్యవహరించడంలో సహాయపడుతుంది — ప్రతి దశను సరళమైన భాషలో వివరిస్తాం.",
  "home.team.eyebrow": "బృందం",
  "home.team.title": "మా నిపుణుల బృందాన్ని కలవండి",
  "home.team.body":
    "విస్తృత న్యాయ రంగాలలో సంవత్సరాల అనుభవం ఉన్న అంకితభావం కలిగిన స్వచ్ఛంద న్యాయవాదుల బృందం — మీకు సహాయం చేయడానికి సిద్ధంగా ఉంది.",
  "home.test.eyebrow": "ప్రశంసలు",
  "home.test.title": "సమాజాలలోని ప్రజలచే విశ్వసించబడింది",
  "home.test.body": "మేము అండగా నిలిచిన ప్రజల నిజమైన కథలు.",
  "home.faq.eyebrow": "మీ ప్రశ్నలకు సమాధానాలు",
  "home.faq.title": "తరచుగా అడిగే ప్రశ్నలు",
  "home.contact.eyebrow": "సంకోచించకండి",
  "home.contact.title": "సంప్రదించండి",
  "home.contact.body":
    "ప్రశ్న ఉందా లేదా సహాయం కావాలా? మాకు సందేశం పంపండి, 24 గంటల్లో స్వచ్ఛంద సేవకుడు మిమ్మల్ని సంప్రదిస్తారు.",
  "home.contact.name": "పేరు",
  "home.contact.email": "ఇమెయిల్",
  "home.contact.subject": "విషయం",
  "home.contact.message": "సందేశం",
  "home.contact.namePh": "పేరు నమోదు చేయండి",
  "home.contact.emailPh": "you@email.com",
  "home.contact.subjectPh": "మేము ఎలా సహాయం చేయగలం?",
  "home.contact.messagePh": "సందేశం నమోదు చేయండి…",
  "home.contact.send": "సందేశం పంపండి",
  "home.contact.sending": "పంపుతోంది…",
  "home.contact.sentTitle": "సందేశం పంపబడింది",
  "home.contact.sentBody": "ధన్యవాదాలు. మేము 24 గంటల్లో మిమ్మల్ని సంప్రదిస్తాం.",
  "home.contact.error": "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా నేరుగా మాకు ఇమెయిల్ చేయండి.",
  "home.cta.title": "ఉచిత న్యాయ సంప్రదింపును షెడ్యూల్ చేయండి",
  "home.cta.body":
    "అనుభవజ్ఞుడైన స్వచ్ఛంద సేవకుడితో మీ పరిస్థితిని చర్చించండి. మీ హక్కులు మరియు ఎంపికలపై స్పష్టమైన మార్గదర్శనం పొందండి — ఎటువంటి ఖర్చు, బాధ్యత లేకుండా.",
  "home.cta.button": "ఇప్పుడే షెడ్యూల్ చేయండి",
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
