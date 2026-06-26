// Bilingual marketing content for the landing page (EN + TE).
// Components pick the Telugu fields when the active language is "te".

export type Lang = "en" | "te";
export const tx = (lang: Lang, en: string, te?: string) => (lang === "te" && te ? te : en);

export const STATS = [
  { value: "100+", label: "People helped", labelTe: "సహాయం పొందినవారు" },
  { value: "2+", label: "Years of service", labelTe: "సేవా సంవత్సరాలు" },
  { value: "10+", label: "Volunteer lawyers", labelTe: "స్వచ్ఛంద న్యాయవాదులు" },
];

export const WHAT_WE_DO = [
  {
    icon: "scale",
    title: "Family & Civil Law",
    titleTe: "కుటుంబ & సివిల్ చట్టం",
    body: "Guidance on marriage, custody, maintenance and everyday civil disputes — in plain language.",
    bodyTe: "వివాహం, పిల్లల సంరక్షణ, భరణం మరియు రోజువారీ సివిల్ వివాదాలపై సరళమైన భాషలో మార్గదర్శనం.",
  },
  {
    icon: "home",
    title: "Property Matters",
    titleTe: "ఆస్తి విషయాలు",
    body: "Help with land records, tenancy, inheritance and resolving property disputes fairly.",
    bodyTe: "భూమి రికార్డులు, అద్దె, వారసత్వం మరియు ఆస్తి వివాదాల న్యాయమైన పరిష్కారంలో సహాయం.",
  },
  {
    icon: "target",
    title: "Our Approach",
    titleTe: "మా విధానం",
    body: "We combine deep legal expertise with practical, compassionate steps tailored to your situation.",
    bodyTe: "లోతైన న్యాయ నైపుణ్యాన్ని మీ పరిస్థితికి తగిన ఆచరణాత్మక, దయతో కూడిన చర్యలతో మేళవిస్తాం.",
  },
  {
    icon: "shield",
    title: "Rights & Protection",
    titleTe: "హక్కులు & రక్షణ",
    body: "Support for women, workers and consumers — so no one faces the system alone.",
    bodyTe: "మహిళలు, కార్మికులు మరియు వినియోగదారులకు మద్దతు — ఎవరూ ఒంటరిగా ఉండకూడదు.",
  },
];

export const SERVICES = [
  {
    title: "Purchase or sale of property",
    titleTe: "ఆస్తి కొనుగోలు లేదా అమ్మకం",
    body: "Document review, due diligence and registration support so your transaction is airtight.",
    bodyTe: "పత్రాల సమీక్ష, తగిన పరిశీలన మరియు రిజిస్ట్రేషన్ మద్దతుతో మీ లావాదేవీ సురక్షితం.",
  },
  {
    title: "Wills, trusts & inheritance",
    titleTe: "వీలునామాలు, ట్రస్టులు & వారసత్వం",
    body: "Plan ahead and protect your family with clear, legally sound succession documents.",
    bodyTe: "స్పష్టమైన, చట్టబద్ధమైన వారసత్వ పత్రాలతో ముందుగా ప్రణాళిక వేసి మీ కుటుంబాన్ని రక్షించుకోండి.",
  },
  {
    title: "Workplace & labour rights",
    titleTe: "ఉద్యోగ & కార్మిక హక్కులు",
    body: "Unpaid wages, wrongful termination, harassment — we help you stand your ground.",
    bodyTe: "చెల్లించని వేతనాలు, తప్పుడు తొలగింపు, వేధింపులు — మేము మీకు అండగా నిలుస్తాం.",
  },
  {
    title: "Women's safety & protection",
    titleTe: "మహిళల భద్రత & రక్షణ",
    body: "Confidential help with domestic violence, protection orders and emergency support.",
    bodyTe: "గృహ హింస, రక్షణ ఉత్తర్వులు మరియు అత్యవసర మద్దతుపై గోప్యమైన సహాయం.",
  },
];

export const EXPERTS = [
  {
    name: "Shiva Teja",
    role: "Criminal Laws & Family Matters",
    roleTe: "క్రిమినల్ చట్టాలు & కుటుంబ విషయాలు",
    img: "/experts/expert-2.jpg",
    bio: "Brings expertise in criminal defence and family law, guiding clients through complex legal challenges.",
    bioTe: "క్రిమినల్ డిఫెన్స్ మరియు కుటుంబ చట్టంలో నైపుణ్యంతో, సంక్లిష్ట న్యాయ సవాళ్లలో క్లయింట్లకు మార్గనిర్దేశం చేస్తారు.",
    linkedin: "https://www.linkedin.com/in/shivateja-pabboju-a3211a289",
  },
  {
    name: "Vamsi Krishna",
    role: "Property, Consumer Rights & Debt Recovery",
    roleTe: "ఆస్తి, వినియోగదారు హక్కులు & రుణ వసూలు",
    img: "/experts/expert-3.jpg",
    bio: "Resolves property disputes, consumer complaints and debt recovery with a results-driven approach.",
    bioTe: "ఆస్తి వివాదాలు, వినియోగదారు ఫిర్యాదులు మరియు రుణ వసూలును ఫలితాల ఆధారిత విధానంతో పరిష్కరిస్తారు.",
    linkedin: "",
  },
  {
    name: "Jaswanth Yamala",
    role: "Cyber Crime, Labour & Employment",
    roleTe: "సైబర్ నేరం, కార్మిక & ఉపాధి",
    img: "/experts/expert-1.jpg",
    bio: "Helps clients navigate cybercrime complaints, labour disputes and employment rights with precision.",
    bioTe: "సైబర్ నేర ఫిర్యాదులు, కార్మిక వివాదాలు మరియు ఉపాధి హక్కులలో క్లయింట్లకు ఖచ్చితత్వంతో సహాయం చేస్తారు.",
    linkedin: "https://www.linkedin.com/in/jaswanth-y-614112277",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "From start to finish they made a stressful eviction case smooth. Their expertise and attention to detail gave me complete peace of mind.",
    quoteTe:
      "మొదటి నుండి చివరి వరకు ఒత్తిడితో కూడిన ఖాళీ చేయించే కేసును సులభతరం చేశారు. వారి నైపుణ్యం నాకు పూర్తి మనశ్శాంతిని ఇచ్చింది.",
    name: "Lakshmi Devi",
    role: "Homemaker, Hyderabad",
    roleTe: "గృహిణి, హైదరాబాద్",
  },
  {
    quote:
      "I had nowhere to turn for my maintenance case. The team treated me with dignity and got me a fair outcome — completely free.",
    quoteTe:
      "నా భరణం కేసు కోసం ఎక్కడికి వెళ్లాలో తెలియలేదు. బృందం నన్ను గౌరవంగా చూసి న్యాయమైన ఫలితాన్ని అందించింది — పూర్తిగా ఉచితంగా.",
    name: "Sana Begum",
    role: "Teacher, Pune",
    roleTe: "ఉపాధ్యాయురాలు, పూణె",
  },
  {
    quote:
      "They fought for nine of us against a fraudulent builder and won. Professional, persistent and genuinely caring.",
    quoteTe:
      "మోసపూరిత బిల్డర్‌పై మా తొమ్మిది మంది తరఫున పోరాడి గెలిచారు. వృత్తిపరమైన, పట్టుదలతో మరియు నిజమైన శ్రద్ధతో.",
    name: "Rajesh Naidu",
    role: "Shop owner, Bengaluru",
    roleTe: "దుకాణ యజమాని, బెంగళూరు",
  },
];

export const PARTNERS = [
  "NALSA",
  "District Legal Services",
  "Sakhi Centre",
  "Childline",
  "Women's Helpline",
  "Labour Union",
  "Consumer Forum",
  "Aasara NGO",
];

export const FAQS = [
  {
    q: "Who can use this legal aid service?",
    qTe: "ఈ న్యాయ సహాయ సేవను ఎవరు ఉపయోగించవచ్చు?",
    a: "Anyone who needs legal help and cannot easily afford a private lawyer — especially women, workers, senior citizens and low-income families. There is no cost to you.",
    aTe: "ప్రైవేట్ న్యాయవాదిని సులభంగా భరించలేని ఎవరైనా — ముఖ్యంగా మహిళలు, కార్మికులు, వృద్ధులు మరియు తక్కువ ఆదాయ కుటుంబాలు. మీకు ఎటువంటి ఖర్చు ఉండదు.",
  },
  {
    q: "Is the help really free?",
    qTe: "ఈ సహాయం నిజంగా ఉచితమేనా?",
    a: "Yes. This is a pro bono initiative. Consultations, case guidance and our live chat are all free of charge.",
    aTe: "అవును. ఇది ఉచిత సేవా కార్యక్రమం. సంప్రదింపులు, కేసు మార్గదర్శనం మరియు లైవ్ చాట్ అన్నీ ఉచితం.",
  },
  {
    q: "How quickly will someone respond?",
    qTe: "ఎంత త్వరగా ఎవరైనా స్పందిస్తారు?",
    a: "We aim to respond within 24 hours of your request. For urgent matters you can also use the live chat or call the NALSA helpline 15100.",
    aTe: "మీ అభ్యర్థనకు 24 గంటల్లో స్పందించడానికి ప్రయత్నిస్తాం. అత్యవసరమైతే లైవ్ చాట్ ఉపయోగించండి లేదా NALSA హెల్ప్‌లైన్ 15100కి కాల్ చేయండి.",
  },
  {
    q: "Will my information stay confidential?",
    qTe: "నా సమాచారం గోప్యంగా ఉంటుందా?",
    a: "Absolutely. Everything you share is private and used only to help with your case. We never sell or share your details.",
    aTe: "ఖచ్చితంగా. మీరు పంచుకునేదంతా గోప్యంగా ఉంటుంది మరియు మీ కేసుకు సహాయం చేయడానికి మాత్రమే ఉపయోగిస్తాం. మీ వివరాలను ఎప్పటికీ అమ్మము లేదా పంచుకోము.",
  },
];

export const CONTACT = {
  phone: "+91 83092 86918",
  email: "pabbojushivateja2000@gmail.com",
  address: "Hyderabad, Telangana",
  addressTe: "హైదరాబాద్, తెలంగాణ",
};
