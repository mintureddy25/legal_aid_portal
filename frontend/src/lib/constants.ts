export const CATEGORIES = [
  { key: "Family Law", i18n: "cat.family", icon: "family" },
  { key: "Criminal Matter", i18n: "cat.criminal", icon: "scale" },
  { key: "Property Dispute", i18n: "cat.property", icon: "home" },
  { key: "Consumer Rights", i18n: "cat.consumer", icon: "cart" },
  { key: "Labour & Employment", i18n: "cat.labour", icon: "briefcase" },
  { key: "Domestic Violence", i18n: "cat.dv", icon: "shield" },
  { key: "Cyber Crime", i18n: "cat.cyber", icon: "globe" },
  { key: "Debt & Recovery", i18n: "cat.debt", icon: "coins" },
  { key: "Other", i18n: "cat.other", icon: "dots" },
] as const;

export const URGENCIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type Urgency = (typeof URGENCIES)[number];

export const STATUSES = ["PENDING", "IN_PROGRESS", "RESPONDED", "CLOSED"] as const;
export type Status = (typeof STATUSES)[number];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Other",
];

export const STATUS_STYLE: Record<Status, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  IN_PROGRESS: "bg-navy-50 text-navy-600 ring-navy-600/20",
  RESPONDED: "bg-brand-50 text-brand-700 ring-brand-600/20",
  CLOSED: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export const URGENCY_STYLE: Record<Urgency, string> = {
  LOW: "bg-brand-50 text-brand-700 ring-brand-600/20",
  MEDIUM: "bg-amber-50 text-amber-700 ring-amber-600/20",
  HIGH: "bg-orange-50 text-orange-700 ring-orange-600/20",
  CRITICAL: "bg-red-50 text-red-700 ring-red-600/20",
};
