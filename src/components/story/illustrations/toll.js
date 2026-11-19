export const TOLL_SVG = `
          <svg viewBox="0 0 440 220" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <radialGradient id="tlHeadGlow" cx="0%" cy="50%" r="100%"><stop offset="0%" stop-color="rgba(255,220,120,0.45)"/><stop offset="100%" stop-color="rgba(255,220,120,0)"/></radialGradient>
              <clipPath id="tlScreenClip"><rect x="101" y="19" width="238" height="36" rx="2"/></clipPath>
            </defs>
            <rect width="440" height="220" fill="#0A0808"/>
            <rect width="440" height="140" fill="#0D0A0A"/>
            <polygon points="0,148 440,148 440,220 0,220" fill="#0F0E0E"/>
            <line x1="110" y1="148" x2="90" y2="220" stroke="rgba(243,234,211,0.06)" stroke-width="0.5"/>
            <line x1="220" y1="148" x2="200" y2="220" stroke="rgba(243,234,211,0.06)" stroke-width="0.5"/>
            <line x1="330" y1="148" x2="310" y2="220" stroke="rgba(243,234,211,0.06)" stroke-width="0.5"/>
            <rect x="0" y="100" width="60" height="48" fill="#0D0A0A"/>
            <polygon points="20,102 30,75 40,102" fill="#120E0E"/><polygon points="40,108 52,80 64,108" fill="#120E0E"/>
            <rect x="375" y="100" width="65" height="48" fill="#0D0A0A"/>
            <polygon points="385,108 397,80 409,108" fill="#120E0E"/><polygon points="405,102 418,74 430,102" fill="#120E0E"/>
            <rect x="68" y="50" width="10" height="98" fill="#1A1212" stroke="rgba(243,234,211,0.08)" stroke-width="0.5"/>
            <rect x="362" y="50" width="10" height="98" fill="#1A1212" stroke="rgba(243,234,211,0.08)" stroke-width="0.5"/>
            <rect x="68" y="50" width="304" height="12" rx="2" fill="#221616" stroke="rgba(236,32,39,0.35)" stroke-width="0.5"/>
            <rect x="68" y="50" width="304" height="3" fill="rgba(236,32,39,0.7)"/>
            <rect x="100" y="18" width="240" height="38" rx="3" fill="#181010" stroke="rgba(236,32,39,0.5)" stroke-width="1"/>
            <rect x="101" y="19" width="238" height="36" rx="2" fill="rgba(236,32,39,0.07)" class="ybe-screen-glow"/>
            <text x="220" y="36" text-anchor="middle" font-family="Inter,sans-serif" font-size="16" font-weight="700" fill="#EC2027" letter-spacing="5" class="ybe-screen-glow">NOVA</text>
            <text x="220" y="48" text-anchor="middle" font-family="Inter,sans-serif" font-size="7" fill="rgba(243,234,211,0.4)" letter-spacing="2">BRAND EXPERIENCE · CAIRO</text>
            <g clip-path="url(#tlScreenClip)"><rect x="70" y="19" width="40" height="36" fill="rgba(243,234,211,0.14)" class="ybe-screen-shine"/></g>
            <rect x="100" y="52" width="240" height="2" fill="rgba(236,32,39,0.5)"/>
            <line x1="150" y1="18" x2="150" y2="56" stroke="rgba(243,234,211,0.07)" stroke-width="0.5"/>
            <line x1="290" y1="18" x2="290" y2="56" stroke="rgba(243,234,211,0.07)" stroke-width="0.5"/>
            <rect x="78" y="112" width="36" height="50" rx="2" fill="#181010" stroke="rgba(236,32,39,0.3)" stroke-width="0.5"/>
            <rect x="78" y="112" width="36" height="5" fill="rgba(236,32,39,0.6)"/>
            <rect x="83" y="120" width="26" height="16" rx="1" fill="#080606" stroke="rgba(100,150,255,0.2)" stroke-width="0.5"/>
            <rect x="83" y="120" width="26" height="16" rx="1" fill="rgba(80,120,200,0.06)"/>
            <rect x="112" y="136" width="6" height="14" rx="1" fill="#221616"/>
            <rect x="114" y="140" width="70" height="4" rx="2" fill="#EC2027" opacity="0.75" class="ybe-barrier"/>
            <rect x="326" y="112" width="36" height="50" rx="2" fill="#181010" stroke="rgba(236,32,39,0.3)" stroke-width="0.5"/>
            <rect x="326" y="112" width="36" height="5" fill="rgba(236,32,39,0.6)"/>
            <rect x="331" y="120" width="26" height="16" rx="1" fill="#080606" stroke="rgba(100,150,255,0.2)" stroke-width="0.5"/>
            <rect x="331" y="120" width="26" height="16" rx="1" fill="rgba(80,120,200,0.06)"/>
            <rect x="322" y="136" width="6" height="14" rx="1" fill="#221616"/>
            <rect x="256" y="140" width="70" height="4" rx="2" fill="#EC2027" opacity="0.75" class="ybe-barrier2"/>
            <g class="ybe-car-creep">
              <polygon points="183,165 220,163 220,180 183,180" fill="url(#tlHeadGlow)" class="ybe-lightcone"/>
              <g class="ybe-truck-bob">
                <rect x="125" y="155" width="55" height="30" rx="3" fill="#1A1212" stroke="rgba(243,234,211,0.1)" stroke-width="0.5"/>
                <rect x="130" y="158" width="40" height="14" rx="1" fill="#080606" stroke="rgba(100,150,255,0.15)" stroke-width="0.5"/>
                <rect x="130" y="158" width="40" height="14" rx="1" fill="rgba(80,120,200,0.05)"/>
                <rect x="175" y="169" width="7" height="5" rx="1" fill="rgba(255,220,100,0.55)" class="ybe-headlight"/>
              </g>
              <circle cx="138" cy="187" r="6" fill="#080606" stroke="rgba(243,234,211,0.12)" stroke-width="1"/>
              <circle cx="163" cy="187" r="6" fill="#080606" stroke="rgba(243,234,211,0.12)" stroke-width="1"/>
            </g>
            <rect x="260" y="160" width="50" height="28" rx="3" fill="#221616" stroke="rgba(243,234,211,0.08)" stroke-width="0.5"/>
            <rect x="265" y="163" width="36" height="12" rx="1" fill="#080606" stroke="rgba(100,150,255,0.12)" stroke-width="0.5"/>
            <circle cx="272" cy="190" r="5" fill="#080606" stroke="rgba(243,234,211,0.1)" stroke-width="1"/>
            <circle cx="298" cy="190" r="5" fill="#080606" stroke="rgba(243,234,211,0.1)" stroke-width="1"/>
            <rect x="198" y="158" width="14" height="4" rx="1" fill="rgba(236,32,39,0.5)"/>
            <ellipse cx="220" cy="152" rx="120" ry="4" fill="rgba(236,32,39,0.04)"/>
            <ellipse cx="152" cy="160" rx="20" ry="4" fill="rgba(255,220,80,0.05)" class="ybe-headlight"/>
          </svg>
`;
