// ─────────────────────────────────────────
//  NOVA Site Data
//  Values below are the bundled defaults. The editable copy lives in
//  /content/home.json (edited via /admin) and is merged in by
//  applyHomeContent() before React renders (see loadContent() in
//  caseStudies.js). If that fetch fails, these defaults are shown.
//  Description/body strings may contain links: [text](url) — they're
//  rendered through <RichText />.
// ─────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'About',     href: '#about'     },
  { label: 'Services',  href: '#services'  },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact',   href: '#contact'   },
];

export let IEI_CARDS = [
  { num: '01 — Foundation', title: 'Imagination', desc: "Every campaign starts with a question no one has asked yet. We dream before we plan.", icon: 'compass' },
  { num: '02 — Execution',  title: 'Energy',       desc: "A full in-house team and factory, and a relentless drive to build what others can't.", icon: 'bolt' },
  { num: '03 — Outcome',    title: 'Impact',        desc: "Brands don't just reach people — they move them.", icon: 'chart' },
];

export let SMS_STEPS = [
  { num: '01', title: 'Brief & Discovery',  desc: 'We listen harder than anyone else in the room. Goals, audience, tension — we map it all before a single concept is drawn.' },
  { num: '02', title: 'Creative Strategy',  desc: 'Data meets intuition. We find the insight that makes your brand impossible to ignore — then build the story around it.' },
  { num: '03', title: 'Experience Design',  desc: 'From a napkin sketch to a full activation floor — every detail is designed to make people feel something real.' },
  { num: '04', title: 'Live & Measure',     desc: 'We execute flawlessly, then track what moved — because a great story is only great if people remember it tomorrow.' },
];

export let YBE_CARDS = [
  { num: '01', tag: 'Roadshows',        scene: 'roadshow', desc: 'Branded vehicles that travel city to city — turning every street into a stage for your campaign.' },
  { num: '02', tag: 'Retail Activations', scene: 'retail',  desc: 'Pop-up activations inside malls and retail parks that pull shoppers in and turn browsers into brand fans.' },
  { num: '03', tag: 'Toll Stations',     scene: 'toll',     desc: 'Captive audiences at every gate — branded gantries, booth wraps and sampling while they wait.' },
  { num: '04', tag: 'In-Store Demos',    scene: 'instore',  desc: 'Live demos inside stores — trained brand ambassadors who turn shelf browsers into buyers on the spot.' },
];

export let SERVICES = [
  { num: '01', label: 'Events',      title: 'Events &\nExhibitions',   desc: 'We turn ideas into unforgettable events, exhibitions, and large-scale experiences that stay with audiences long after the lights go down.', icon: 'home' },
  { num: '02', label: 'Activations', title: 'Brand\nActivations',      desc: 'Bold activations that surprise, engage, and connect your brand with real people — creating memories, not just impressions.', icon: 'zap' },
  { num: '03', label: 'Roadshows',   title: 'Nationwide\nRoadshows',   desc: 'Roadshows that travel nationwide, bringing your brand alive across every destination — from Cairo to the coast.', icon: 'globe' },
  { num: '04', label: 'Digital',     title: 'Digital\nExperiences',    desc: 'Interactive games, leaderboards, and immersive screens that captivate audiences and turn passive viewers into active participants.', icon: 'monitor' },
  { num: '05', label: 'Production',  title: 'In-House\nProduction',    desc: 'Crafted with precision from our own factory — booths, stands, counters, and custom builds delivered on time, every time.', icon: 'tool' },
  { num: '06', label: 'Retail',      title: 'Retail &\nOutdoor',       desc: 'From toll stations to in-store demos, we connect shoppers everywhere they go — at the exact moment that matters most.', icon: 'shopping-bag' },
  { num: '07', label: 'Marketing',   title: 'Digital\nMarketing',     desc: 'Social media, paid campaigns, content, and performance marketing that extend your brand beyond the venue — and keep the conversation going online.', icon: 'trending-up' },
];

export const ABOUT_CARDS = [
  { label: 'Founded', value: 'Homegrown', desc: 'Rooted in Cairo, Egypt'     },
  { label: 'HQ',      value: 'Cairo',     desc: 'Zahraa El Maadi, Egypt'     },
  { label: 'Factory', value: 'In-House',  desc: 'Zero outsourcing'           },
  { label: 'Team',    value: 'Full Crew', desc: 'A multidisciplinary team'   },
];

// Free-standing paragraphs and the hero headline (the page's H1).
export let HOME_TEXT = {
  heroLines: ["We Don't Just Market.", 'We Create Moments.'],
  heroSub: 'Brand activations, events & exhibitions, roadshows, and digital experiences in Egypt —\nconnecting people to what matters.',
  aboutBody: 'NOVA is a full-service brand experience agency headquartered in Cairo. We combine creative strategy, flawless production, and fearless activation to build brands people remember — and love.',
  ieiBody: 'We transform briefs into brand moments that move people — literally and emotionally. Every project begins with vision and ends with results.',
  smsSub: 'Every campaign we build begins with a single question: what feeling do you want people to carry home?',
  ffwSub: 'Precision manufacturing, entirely in-house. Every booth, stand, counter and installation — built by us, delivered on time.',
  ybeSub: 'Roadshows, retail activations, toll stations, in-store demos — we place your brand exactly where people are.',
  contactBody: "Tell us your brand's next chapter. We'll handle the rest — from the first sketch to the final spotlight.",
};

export let ABOUT_VALUES = [
  'Honesty', 'Fast Delivery', 'High Quality',
  'Low Cost', 'Full-Service Team', 'Multinational Partners',
];

// Real project photography, shown as a masonry gallery in <Portfolio />.
// Each entry's `widths` are the responsive raster sizes actually generated on
// disk by scripts/optimize-images.mjs (WebP + JPEG per width, sourced from
// assets/work-source/ so the unoptimized originals never ship) — the gallery
// builds a real srcSet from these instead of shipping a 1600px original into
// every 300px grid cell. Re-run the script and paste its manifest here if
// photos change.
const WORK_MANIFEST = [
  ['work-01', 1.7786, [420, 800, 1400]], ['work-02', 1.7778, [420, 800]],
  ['work-03', 1.7778, [420, 800]], ['work-04', 1.7778, [420, 800]],
  ['work-05', 1.7778, [420, 800]], ['work-06', 1.3333, [420, 800]],
  ['work-07', 0.75, [420, 800]], ['work-08', 1.3333, [420, 800, 1400]],
  ['work-09', 0.75, [420, 800]], ['work-10', 1.3333, [420, 800]],
  ['work-11', 1.7786, [420, 800, 1400]], ['work-12', 1.7778, [420, 800]],
  ['work-13', 0.5625, [420]], ['work-14', 1.3333, [420, 800]],
  ['work-16', 1.7778, [420, 800]],
  ['work-18', 0.75, [420, 800]],
  ['work-19', 1.7778, [420, 800]], ['work-20', 1.7786, [420, 800, 1400]],
  ['work-21', 1.7778, [420, 800]], ['work-22', 1.3333, [420, 800]],
  ['work-23', 0.5625, [420]], ['work-24', 1.7786, [420, 800, 1400]],
  ['work-25', 1.7786, [420, 800, 1400]], ['work-26', 1.3333, [420, 800, 1400]],
  ['work-27', 1.3333, [420, 800, 1400]], ['work-28', 1.3333, [420, 800, 1400]],
  ['work-29', 1.3333, [420, 800, 1400]], ['work-30', 1.3333, [420, 800, 1400]],
  ['work-31', 1.3333, [420, 800, 1400]], ['work-32', 0.75, [420, 800]],
  ['work-33', 1.7778, [420, 800, 1400]], ['work-34', 2.23, [420, 800]],
  ['work-35', 1.7802, [420, 800, 1400]],
];

export const WORK_PHOTOS = WORK_MANIFEST.map(([base, aspect, widths]) => {
  const maxW = widths[widths.length - 1];
  return {
    base,
    aspect,
    widths,
    srcSetWebp: widths.map((w) => `/work/${base}-${w}.webp ${w}w`).join(', '),
    srcSetJpg: widths.map((w) => `/work/${base}-${w}.jpg ${w}w`).join(', '),
    fallback: `/work/${base}-${maxW}.jpg`,
  };
});

// Fast lookup used by <ProjectDetail /> to resolve a case study's photo
// basenames (e.g. 'work-01') back to their full responsive image data.
export const WORK_PHOTO_BY_BASE = Object.fromEntries(WORK_PHOTOS.map((p) => [p.base, p]));

export let CLIENTS = [
  'Sanofi', 'AstraZeneca', 'Boehringer Ingelheim', 'Novo Nordisk',
  'Attieh Medico', 'Tamer', 'Ministry of Health', "L'Oréal",
];

export const CONTACT = {
  email:   'info@novaadv.com',
  phones:  ['+20 12 999 11 031', '+20 12 999 11 032'],
  website: 'novaadv.com',
  address: '3/B, Masr El Taamir Buildings, Zahraa El Maadi, Cairo, Egypt',
  hours:   'Sun–Thu 9AM–6PM',
  mapUrl:  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('3/B Masr El Taamir Buildings, Zahraa El Maadi, Cairo, Egypt'),
};

// WhatsApp chat link for the primary NOVA number (digits only, with country code).
export const whatsappUrl = (text = '') =>
  `https://wa.me/${CONTACT.phones[0].replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// ── CMS merge ─────────────────────────────
// Only overrides text fields that are non-empty strings, and never changes
// list lengths — icons, scenes and numbering stay tied to each item.
const str = (v, fallback) => (typeof v === 'string' && v.trim() ? v : fallback);
const pick = (list, i) => (Array.isArray(list) ? list[i] : undefined);

export function applyHomeContent(home) {
  if (!home || typeof home !== 'object') return;
  HOME_TEXT = {
    heroLines: [str(home.hero?.line1, HOME_TEXT.heroLines[0]), str(home.hero?.line2, HOME_TEXT.heroLines[1])],
    heroSub: str(home.hero?.sub, HOME_TEXT.heroSub),
    aboutBody: str(home.about?.body, HOME_TEXT.aboutBody),
    ieiBody: str(home.iei?.body, HOME_TEXT.ieiBody),
    smsSub: str(home.sms?.sub, HOME_TEXT.smsSub),
    ffwSub: str(home.ffw?.sub, HOME_TEXT.ffwSub),
    ybeSub: str(home.ybe?.sub, HOME_TEXT.ybeSub),
    contactBody: str(home.contact?.body, HOME_TEXT.contactBody),
  };
  SERVICES = SERVICES.map((s, i) => ({ ...s, title: str(pick(home.services, i)?.title, s.title), desc: str(pick(home.services, i)?.desc, s.desc) }));
  IEI_CARDS = IEI_CARDS.map((c, i) => ({ ...c, desc: str(pick(home.iei?.cards, i), c.desc) }));
  SMS_STEPS = SMS_STEPS.map((c, i) => ({ ...c, title: str(pick(home.sms?.steps, i)?.title, c.title), desc: str(pick(home.sms?.steps, i)?.desc, c.desc) }));
  YBE_CARDS = YBE_CARDS.map((c, i) => ({ ...c, desc: str(pick(home.ybe?.cards, i), c.desc) }));
  ABOUT_VALUES = ABOUT_VALUES.map((v, i) => str(pick(home.about?.values, i), v));
  CLIENTS = CLIENTS.map((v, i) => str(pick(home.clients, i), v));
}

/** Current editable copy in the /content/home.json shape (used to seed that file). */
export function homeContentSnapshot() {
  return {
    hero: { line1: HOME_TEXT.heroLines[0], line2: HOME_TEXT.heroLines[1], sub: HOME_TEXT.heroSub },
    services: SERVICES.map(({ title, desc }) => ({ title, desc })),
    about: { body: HOME_TEXT.aboutBody, values: [...ABOUT_VALUES] },
    iei: { body: HOME_TEXT.ieiBody, cards: IEI_CARDS.map((c) => c.desc) },
    sms: { sub: HOME_TEXT.smsSub, steps: SMS_STEPS.map(({ title, desc }) => ({ title, desc })) },
    ffw: { sub: HOME_TEXT.ffwSub },
    ybe: { sub: HOME_TEXT.ybeSub, cards: YBE_CARDS.map((c) => c.desc) },
    clients: [...CLIENTS],
    contact: { body: HOME_TEXT.contactBody },
  };
}
