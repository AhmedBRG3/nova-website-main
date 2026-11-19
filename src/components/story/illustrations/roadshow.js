export const ROADSHOW_SVG = `
          <svg viewBox="0 0 440 220" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <radialGradient id="rsHeadGlow" cx="0%" cy="50%" r="100%"><stop offset="0%" stop-color="rgba(255,220,120,0.5)"/><stop offset="100%" stop-color="rgba(255,220,120,0)"/></radialGradient>
              <clipPath id="rsScreenClip"><rect x="104" y="100" width="47" height="35" rx="1"/></clipPath>
            </defs>
            <rect width="440" height="220" fill="#0A0808"/>
            <rect width="440" height="150" fill="#0D0A0A"/>
            <polygon points="0,155 440,155 440,220 0,220" fill="#0F0E0E"/>
            <line x1="0" y1="163" x2="440" y2="163" stroke="rgba(243,234,211,0.04)" stroke-width="0.5"/>
            <g class="ybe-road-dash">
              <rect x="30" y="182" width="40" height="4" rx="2" fill="rgba(255,200,0,0.18)"/>
              <rect x="100" y="182" width="40" height="4" rx="2" fill="rgba(255,200,0,0.18)"/>
              <rect x="170" y="182" width="40" height="4" rx="2" fill="rgba(255,200,0,0.18)"/>
              <rect x="240" y="182" width="40" height="4" rx="2" fill="rgba(255,200,0,0.18)"/>
              <rect x="310" y="182" width="40" height="4" rx="2" fill="rgba(255,200,0,0.18)"/>
              <rect x="380" y="182" width="40" height="4" rx="2" fill="rgba(255,200,0,0.18)"/>
              <rect x="450" y="182" width="40" height="4" rx="2" fill="rgba(255,200,0,0.18)"/>
            </g>
            <rect x="10" y="122" width="18" height="33" fill="#120E0E"/><rect x="30" y="112" width="14" height="43" fill="#120E0E"/><rect x="48" y="118" width="20" height="37" fill="#120E0E"/>
            <rect x="370" y="115" width="16" height="40" fill="#120E0E"/><rect x="390" y="108" width="22" height="47" fill="#120E0E"/><rect x="414" y="120" width="14" height="35" fill="#120E0E"/>
            <rect x="14" y="126" width="4" height="3" fill="rgba(255,200,80,0.2)" class="ffw-win-flicker"/><rect x="34" y="116" width="4" height="3" fill="rgba(255,200,80,0.2)"/><rect x="394" y="112" width="4" height="3" fill="rgba(255,200,80,0.2)" class="ffw-win-flicker2"/>
            <polygon points="345,138 440,120 440,155 345,141" fill="url(#rsHeadGlow)" class="ybe-lightcone"/>
            <g class="ybe-exhaust"><circle cx="98" cy="150" r="4" fill="rgba(200,200,200,0.3)"/></g>
            <g class="ybe-exhaust" style="animation-delay:.55s"><circle cx="98" cy="150" r="3" fill="rgba(200,200,200,0.25)"/></g>
            <g class="ybe-exhaust" style="animation-delay:1.1s"><circle cx="98" cy="150" r="5" fill="rgba(200,200,200,0.2)"/></g>
            <g class="ybe-truck-bob">
              <rect x="100" y="90" width="200" height="65" rx="4" fill="#1A1212" stroke="rgba(236,32,39,0.5)" stroke-width="1"/>
              <rect x="280" y="100" width="60" height="55" rx="3" fill="#221616" stroke="rgba(236,32,39,0.4)" stroke-width="0.5"/>
              <rect x="286" y="104" width="46" height="26" rx="2" fill="#080606" stroke="rgba(100,150,255,0.2)" stroke-width="0.5"/>
              <rect x="286" y="104" width="46" height="26" rx="2" fill="rgba(80,120,200,0.06)"/>
              <line x1="309" y1="104" x2="309" y2="130" stroke="rgba(243,234,211,0.1)" stroke-width="0.5"/>
              <rect x="337" y="136" width="8" height="5" rx="1" fill="rgba(255,220,100,0.65)" class="ybe-headlight"/>
              <rect x="100" y="134" width="200" height="6" fill="rgba(236,32,39,0.7)"/>
              <rect x="115" y="100" width="150" height="28" rx="2" fill="rgba(236,32,39,0.08)" stroke="rgba(236,32,39,0.2)" stroke-width="0.5"/>
              <text x="190" y="119" text-anchor="middle" font-family="Inter,sans-serif" font-size="14" font-weight="700" fill="#EC2027" letter-spacing="4">NOVA</text>
              <line x1="220" y1="92" x2="220" y2="155" stroke="rgba(243,234,211,0.06)" stroke-width="0.5"/>
              <rect x="100" y="92" width="55" height="62" rx="2" fill="#181010" stroke="rgba(236,32,39,0.35)" stroke-width="0.5"/>
              <rect x="100" y="92" width="55" height="5" fill="rgba(236,32,39,0.6)"/>
              <rect x="104" y="100" width="47" height="35" rx="1" fill="#080505" stroke="rgba(236,32,39,0.2)" stroke-width="0.5"/>
              <rect x="105" y="101" width="45" height="33" rx="1" fill="rgba(236,32,39,0.1)" class="ybe-screen-glow"/>
              <text x="127" y="120" text-anchor="middle" font-family="Inter,sans-serif" font-size="7" font-weight="600" fill="rgba(236,32,39,0.85)" letter-spacing="1">NOVA</text>
              <g clip-path="url(#rsScreenClip)"><rect x="80" y="100" width="16" height="35" fill="rgba(243,234,211,0.16)" class="ybe-screen-shine"/></g>
            </g>
            <g class="ybe-wheel"><circle cx="148" cy="158" r="18" fill="#080606" stroke="rgba(243,234,211,0.15)" stroke-width="1.5"/><circle cx="148" cy="158" r="10" fill="#120E0E" stroke="rgba(243,234,211,0.1)" stroke-width="1"/><line x1="148" y1="148" x2="148" y2="168" stroke="rgba(243,234,211,0.12)" stroke-width="1"/><line x1="138" y1="158" x2="158" y2="158" stroke="rgba(243,234,211,0.12)" stroke-width="1"/></g>
            <g class="ybe-wheel"><circle cx="252" cy="158" r="18" fill="#080606" stroke="rgba(243,234,211,0.15)" stroke-width="1.5"/><circle cx="252" cy="158" r="10" fill="#120E0E" stroke="rgba(243,234,211,0.1)" stroke-width="1"/><line x1="252" y1="148" x2="252" y2="168" stroke="rgba(243,234,211,0.12)" stroke-width="1"/><line x1="242" y1="158" x2="262" y2="158" stroke="rgba(243,234,211,0.12)" stroke-width="1"/></g>
            <g class="ybe-wheel"><circle cx="308" cy="158" r="16" fill="#080606" stroke="rgba(243,234,211,0.15)" stroke-width="1.5"/><circle cx="308" cy="158" r="9" fill="#120E0E" stroke="rgba(243,234,211,0.1)" stroke-width="1"/><line x1="308" y1="149" x2="308" y2="167" stroke="rgba(243,234,211,0.12)" stroke-width="1"/><line x1="299" y1="158" x2="317" y2="158" stroke="rgba(243,234,211,0.12)" stroke-width="1"/></g>
            <ellipse cx="210" cy="162" rx="120" ry="5" fill="rgba(0,0,0,0.5)"/>
            <g class="ybe-person-bob"><ellipse cx="78" cy="157" rx="5" ry="2" fill="rgba(0,0,0,0.3)"/><rect x="75" y="133" width="5" height="24" rx="2" fill="#221616"/><circle cx="78" cy="129" r="5" fill="#221616"/></g>
            <g class="ybe-person-bob2"><ellipse cx="93" cy="157" rx="5" ry="2" fill="rgba(0,0,0,0.3)"/><rect x="90" y="136" width="5" height="22" rx="2" fill="#281C1C"/><circle cx="93" cy="132" r="5" fill="#281C1C"/></g>
            <ellipse cx="355" cy="160" rx="30" ry="6" fill="rgba(255,220,80,0.05)" class="ybe-headlight"/>
          </svg>
`;
