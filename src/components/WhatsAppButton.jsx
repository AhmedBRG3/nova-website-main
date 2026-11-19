// ─────────────────────────────────────────
//  WhatsAppButton
//  Floating "chat with us" button, fixed to the
//  bottom-right on every page. Opens a WhatsApp
//  chat with the NOVA number via a wa.me link.
// ─────────────────────────────────────────
import { CONTACT, whatsappUrl } from '../data';

export default function WhatsAppButton() {
  return (
    <a
      className="wa-float"
      href={whatsappUrl("Hello NOVA, I'd like to talk about a project.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with NOVA on WhatsApp (${CONTACT.phones[0]})`}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.2A9.5 9.5 0 1 0 12 2.5z" />
        <g transform="translate(6.6 6.6) scale(.45)"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></g>
      </svg>
    </a>
  );
}
