// ─────────────────────────────────────────
//  Clients
//  Two infinite CSS-marquee rows scrolling in
//  opposite directions. Each row's list is
//  doubled so the loop point is invisible;
//  hovering either row pauses it.
// ─────────────────────────────────────────
import { CLIENTS } from '../data';

export default function Clients() {
  const forward = [...CLIENTS, ...CLIENTS];
  const reverse = [...CLIENTS].reverse();
  const reverseDoubled = [...reverse, ...reverse];

  return (
    <section id="clients" className="light-section">
      <p className="ticker-label">Trusted by leading brands</p>

      <div className="ticker-inner">
        <div className="ticker-track">
          {forward.map((name, i) => (
            <span key={i} className="client-name">{name}</span>
          ))}
        </div>
      </div>

      <div className="ticker-inner">
        <div className="ticker-track rev">
          {reverseDoubled.map((name, i) => (
            <span key={i} className="client-name">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
