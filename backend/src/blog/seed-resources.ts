// Dummy resources seeded on first boot. Cover images live in the frontend's
// /public/resources folder, so the paths resolve against the website origin.
export interface SeedResource {
  title: string;
  category: string;
  excerpt: string;
  coverImage: string;
  body: string;
}

const lorem =
  'This is a plain-language guide prepared by our volunteer lawyers. ' +
  'It explains the topic step by step so you know what to expect and what your options are. ' +
  'For help specific to your situation, submit a request or use the live chat — our team responds within 24 hours.';

export const SEED_RESOURCES: SeedResource[] = [
  {
    title: 'How to get free legal aid in India',
    category: 'Getting started',
    excerpt: 'Who qualifies for free legal aid, what NALSA offers, and how to apply.',
    coverImage: '/resources/r1.jpg',
    body: `Free legal aid is a right for many people in India.\n\n${lorem}`,
  },
  {
    title: 'Writing a will: a simple guide',
    category: 'Property & estate',
    excerpt: 'Protect your family with a clear, legally valid will — without the jargon.',
    coverImage: '/resources/r2.jpg',
    body: `A will makes sure your wishes are respected.\n\n${lorem}`,
  },
  {
    title: 'Know your fundamental rights',
    category: 'Rights & protection',
    excerpt: 'A short primer on the rights every citizen has and how to use them.',
    coverImage: '/resources/r3.jpg',
    body: `Your rights protect you every day.\n\n${lorem}`,
  },
  {
    title: 'Filing an FIR: step by step',
    category: 'Criminal matters',
    excerpt: 'What an FIR is, when to file one, and what to do if the police refuse.',
    coverImage: '/resources/r4.jpg',
    body: `An FIR is the first step in a criminal case.\n\n${lorem}`,
  },
  {
    title: 'Tenant rights and eviction protection',
    category: 'Property & estate',
    excerpt: 'Your protections as a tenant and what to do if you face wrongful eviction.',
    coverImage: '/resources/r5.jpg',
    body: `Tenants have strong protections under the law.\n\n${lorem}`,
  },
  {
    title: 'Consumer complaints made easy',
    category: 'Consumer rights',
    excerpt: 'How to complain about a faulty product or service and get a refund.',
    coverImage: '/resources/r6.jpg',
    body: `You do not have to accept unfair treatment as a consumer.\n\n${lorem}`,
  },
];
