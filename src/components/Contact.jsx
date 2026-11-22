// ─────────────────────────────────────────
//  Contact
//  Centered CTA with a slow-pulsing red glow
//  behind the copy, a validated contact form
//  (see ContactForm.jsx), a magnetic call
//  button, and the three contact-info lines.
// ─────────────────────────────────────────
import useReveal from '../hooks/useReveal';
import useMagnet from '../hooks/useMagnet';
import IcosahedronCanvas from './IcosahedronCanvas';
import ContactForm from './ContactForm';
import { CONTACT, HOME_TEXT } from '../data';
import RichText from './RichText';

export default function Contact() {
  const contentRef = useReveal();
  const btnG1Ref = useMagnet();
  const btnG2Ref = useMagnet();

  return (
    <section id="contact" aria-label="Contact NOVA Marketing">
      <IcosahedronCanvas />
      <div className="contact-glow" />
      <div ref={contentRef} className="contact-content rv">
        <p className="section-eyebrow">Let's Create</p>
        <h2 className="contact-title">
          Ready to make<br />something <em className="shimmer">amazing?</em>
        </h2>
        <RichText className="contact-body" text={HOME_TEXT.contactBody} />

        <ContactForm />

        <div className="contact-links">
          <a ref={btnG1Ref} href={`tel:${CONTACT.phones[0]}`} className="btn-g">Call {CONTACT.phones[0]}</a>
          <a ref={btnG2Ref} href={`tel:${CONTACT.phones[1]}`} className="btn-g">Call {CONTACT.phones[1]}</a>
        </div>

        <div className="contact-links">
          <span className="contact-info">📍 <a href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Open NOVA's location in Google Maps">{CONTACT.address}</a></span>
          <span className="contact-info">✉️ <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></span>
          <span className="contact-info">🕐 {CONTACT.hours}</span>
        </div>
      </div>
    </section>
  );
}
