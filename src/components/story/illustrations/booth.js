export const BOOTH_SVG = `
          <svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <rect width="480" height="320" fill="#0A0808"/>
            <polygon points="0,260 480,260 480,320 0,320" fill="#0D0A0A"/>
            <line x1="0" y1="268" x2="480" y2="268" stroke="rgba(243,234,211,0.04)" stroke-width="0.5"/>
            <line x1="0" y1="280" x2="480" y2="280" stroke="rgba(243,234,211,0.03)" stroke-width="0.5"/>
            <line x1="80" y1="260" x2="60" y2="320" stroke="rgba(243,234,211,0.025)" stroke-width="0.5"/>
            <line x1="160" y1="260" x2="140" y2="320" stroke="rgba(243,234,211,0.025)" stroke-width="0.5"/>
            <line x1="240" y1="260" x2="220" y2="320" stroke="rgba(243,234,211,0.025)" stroke-width="0.5"/>
            <line x1="320" y1="260" x2="300" y2="320" stroke="rgba(243,234,211,0.025)" stroke-width="0.5"/>
            <line x1="400" y1="260" x2="380" y2="320" stroke="rgba(243,234,211,0.025)" stroke-width="0.5"/>
            <rect x="70" y="80" width="340" height="180" fill="#181010" stroke="rgba(236,32,39,0.2)" stroke-width="0.5"/>
            <rect x="70" y="80" width="340" height="8" fill="#EC2027" opacity="0.85"/>
            <rect x="70" y="248" width="340" height="4" fill="#EC2027" opacity="0.6"/>
            <polygon points="70,80 30,100 30,264 70,260" fill="#130E0E" stroke="rgba(236,32,39,0.15)" stroke-width="0.5"/>
            <polygon points="410,80 450,100 450,264 410,260" fill="#130E0E" stroke="rgba(236,32,39,0.15)" stroke-width="0.5"/>
            <rect x="100" y="92" width="280" height="130" rx="2" fill="#080606" stroke="rgba(236,32,39,0.35)" stroke-width="1"/>
            <defs>
              <radialGradient id="screenGrad" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#3A0808"/><stop offset="60%" stop-color="#1A0505"/><stop offset="100%" stop-color="#0A0404"/></radialGradient>
              <clipPath id="screenClip"><rect x="101" y="93" width="278" height="128" rx="1"/></clipPath>
            </defs>
            <rect x="101" y="93" width="278" height="128" rx="1" fill="url(#screenGrad)"/>
            <text x="240" y="148" text-anchor="middle" font-family="Inter,sans-serif" font-size="32" font-weight="700" fill="#EC2027" class="ybe-screen-glow" letter-spacing="6">NOVA</text>
            <text x="240" y="168" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="rgba(243,234,211,0.5)" letter-spacing="3">MARKETING &amp; EVENTS</text>
            <g clip-path="url(#screenClip)"><rect x="60" y="93" width="60" height="128" fill="rgba(243,234,211,0.05)" transform="skewX(-18)" class="ffw-screen-shine"/></g>
            <ellipse cx="240" cy="157" rx="100" ry="40" fill="rgba(236,32,39,0.06)" class="ybe-screen-glow"/>
            <polygon points="150,220 330,220 340,230 140,230" fill="#221616" stroke="rgba(236,32,39,0.4)" stroke-width="0.5"/>
            <rect x="140" y="230" width="200" height="30" fill="#1A1010" stroke="rgba(236,32,39,0.3)" stroke-width="0.5"/>
            <rect x="140" y="230" width="200" height="3" fill="rgba(236,32,39,0.7)"/>
            <text x="240" y="248" text-anchor="middle" font-family="Inter,sans-serif" font-size="7" font-weight="600" fill="rgba(236,32,39,0.8)" letter-spacing="2">NOVA</text>
            <ellipse cx="240" cy="262" rx="90" ry="5" fill="rgba(236,32,39,0.06)"/>
            <rect x="88" y="115" width="18" height="140" fill="#181010" stroke="rgba(236,32,39,0.3)" stroke-width="0.5"/>
            <rect x="88" y="115" width="18" height="5" fill="rgba(236,32,39,0.7)"/>
            <line x1="97" y1="120" x2="97" y2="250" stroke="rgba(236,32,39,0.22)" stroke-width="1" class="ffw-spot"/>
            <rect x="374" y="115" width="18" height="140" fill="#181010" stroke="rgba(236,32,39,0.3)" stroke-width="0.5"/>
            <rect x="374" y="115" width="18" height="5" fill="rgba(236,32,39,0.7)"/>
            <line x1="383" y1="120" x2="383" y2="250" stroke="rgba(236,32,39,0.22)" stroke-width="1" class="ffw-spot2"/>
            <rect x="70" y="76" width="340" height="6" rx="1" fill="#221616" stroke="rgba(243,234,211,0.08)" stroke-width="0.5"/>
            <line x1="120" y1="60" x2="120" y2="80" stroke="rgba(243,234,211,0.1)" stroke-width="1.5"/>
            <line x1="200" y1="50" x2="200" y2="80" stroke="rgba(243,234,211,0.1)" stroke-width="1.5"/>
            <line x1="280" y1="50" x2="280" y2="80" stroke="rgba(243,234,211,0.1)" stroke-width="1.5"/>
            <line x1="360" y1="60" x2="360" y2="80" stroke="rgba(243,234,211,0.1)" stroke-width="1.5"/>
            <line x1="100" y1="50" x2="380" y2="50" stroke="rgba(243,234,211,0.08)" stroke-width="1.5"/>
            <line x1="140" y1="50" x2="140" y2="68" stroke="rgba(243,234,211,0.07)" stroke-width="0.5" stroke-dasharray="2,2"/>
            <ellipse cx="140" cy="70" rx="6" ry="4" fill="#281E1E" stroke="rgba(243,234,211,0.12)" stroke-width="0.5"/>
            <ellipse cx="140" cy="71" rx="3" ry="2" fill="rgba(255,220,100,0.4)" class="ffw-spot"/>
            <line x1="240" y1="50" x2="240" y2="65" stroke="rgba(243,234,211,0.07)" stroke-width="0.5" stroke-dasharray="2,2"/>
            <ellipse cx="240" cy="67" rx="7" ry="4" fill="#281E1E" stroke="rgba(243,234,211,0.12)" stroke-width="0.5"/>
            <ellipse cx="240" cy="68" rx="4" ry="2" fill="rgba(255,220,100,0.45)" class="ffw-spot2"/>
            <line x1="340" y1="50" x2="340" y2="68" stroke="rgba(243,234,211,0.07)" stroke-width="0.5" stroke-dasharray="2,2"/>
            <ellipse cx="340" cy="70" rx="6" ry="4" fill="#281E1E" stroke="rgba(243,234,211,0.12)" stroke-width="0.5"/>
            <ellipse cx="340" cy="71" rx="3" ry="2" fill="rgba(255,220,100,0.4)" class="ffw-spot"/>
            <polygon points="137,74 100,180 143,180" fill="rgba(255,220,100,0.025)" class="ffw-spot"/>
            <polygon points="240,72 210,190 270,190" fill="rgba(255,220,100,0.03)" class="ffw-spot2"/>
            <polygon points="337,74 300,180 343,180" fill="rgba(255,220,100,0.025)" class="ffw-spot"/>
            <rect x="116" y="200" width="20" height="55" rx="1" fill="#181010" stroke="rgba(243,234,211,0.07)" stroke-width="0.5"/>
            <rect x="112" y="196" width="28" height="8" rx="1" fill="#221616" stroke="rgba(236,32,39,0.2)" stroke-width="0.5"/>
            <rect x="344" y="200" width="20" height="55" rx="1" fill="#181010" stroke="rgba(243,234,211,0.07)" stroke-width="0.5"/>
            <rect x="340" y="196" width="28" height="8" rx="1" fill="#221616" stroke="rgba(236,32,39,0.2)" stroke-width="0.5"/>
            <g class="ybe-person-bob"><ellipse cx="175" cy="218" rx="7" ry="3" fill="rgba(0,0,0,0.3)"/><rect x="172" y="185" width="6" height="34" rx="3" fill="#281C1C"/><circle cx="175" cy="180" r="7" fill="#281C1C"/></g>
            <g class="ybe-person-bob2"><ellipse cx="240" cy="222" rx="7" ry="3" fill="rgba(0,0,0,0.3)"/><rect x="237" y="188" width="6" height="35" rx="3" fill="#221616"/><circle cx="240" cy="183" r="7" fill="#221616"/></g>
            <g class="ybe-person-bob"><ellipse cx="305" cy="218" rx="7" ry="3" fill="rgba(0,0,0,0.3)"/><rect x="302" y="185" width="6" height="34" rx="3" fill="#281C1C"/><circle cx="305" cy="180" r="7" fill="#281C1C"/></g>
            <circle cx="85" cy="155" r="16" fill="rgba(236,32,39,0.04)"/>
            <circle cx="415" cy="155" r="16" fill="rgba(236,32,39,0.04)"/>
            <ellipse cx="240" cy="263" rx="200" ry="5" fill="rgba(0,0,0,0.35)"/>
          </svg>
`;
