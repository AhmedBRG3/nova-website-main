// ─────────────────────────────────────────
//  NOVA Design Tokens — v3 (Black / Red / Cream)
// ─────────────────────────────────────────

export const colors = {
  void:   '#0B0906',
  deep:   '#151009',
  card:   '#1E170F',
  pulse:  '#EC2027',
  hot:    '#FF3B41',
  ember:  '#FF6B4A',
  gold:   '#E8C77E',
  silver: '#B8AC8C',
  mist:   '#E8DCC0',
  cream:  '#F3EAD3',
  light:  '#F3EAD3',
  white:  '#F3EAD3', // kept as an alias — the palette has no pure white
};

export const fonts = {
  display: "'Playfair Display', serif",
  accent:  "'Spectral', serif",   // the 6 quoted signature words per section
  body:    "'Inter', sans-serif",
};

// Primary spring-out easing used everywhere (matches CSS var(--e))
export const easing = {
  out: 'cubic-bezier(.16,1,.3,1)',
  io:  'cubic-bezier(.83,0,.17,1)',
};

export const radius = {
  pill: '50px',
  card: '20px',
  cardLg: '24px',
};
