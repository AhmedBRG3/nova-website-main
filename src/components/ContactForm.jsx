// ─────────────────────────────────────────
//  ContactForm
//  Validated contact form. On submit it POSTs to
//  /contact.php (see public/contact.php), which
//  emails the lead to the NOVA inbox so nothing
//  depends on the visitor's mail app. If that
//  endpoint isn't reachable (local dev, non-PHP
//  host) it falls back to a prefilled mailto:.
// ─────────────────────────────────────────
import { useState } from 'react';
import { CONTACT, whatsappUrl } from '../data';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) errors.email = 'Please enter your email.';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'That email address doesn\'t look right.';
  if (!values.message.trim()) errors.message = 'Tell us a bit about your project.';
  else if (values.message.trim().length < 10) errors.message = 'A few more details would help (10+ characters).';
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '', company: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | mailto

  const setField = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(`field-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'failed');
      setValues({ name: '', email: '', phone: '', message: '', company: '' });
      setStatus('sent');
    } catch {
      const subject = `New project inquiry from ${values.name}`;
      const body = [
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        values.phone.trim() && `Phone: ${values.phone}`,
        '',
        values.message,
      ].filter(Boolean).join('\n');
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('mailto');
    }
  };

  const handleWhatsApp = () => {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(`field-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    const text = [
      `Hello NOVA, I'm ${values.name.trim()}.`,
      values.email.trim() && `Email: ${values.email.trim()}`,
      values.phone.trim() && `Phone: ${values.phone.trim()}`,
      '',
      values.message.trim(),
    ].filter((l) => l !== '' && l !== false).join('\n');
    window.open(whatsappUrl(text), '_blank', 'noopener');
  };

  if (status === 'sent') {
    return (
      <div className="contact-form-sent rv in" role="status">
        <p className="contact-form-sent-title">Message sent — thank you.</p>
        <p className="contact-form-sent-body">We'll get back to you shortly.</p>
        <button type="button" className="btn-g" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    );
  }

  if (status === 'mailto') {
    return (
      <div className="contact-form-sent rv in" role="status">
        <p className="contact-form-sent-title">Your email app should be opening now.</p>
        <p className="contact-form-sent-body">
          Didn't pop up? Reach us directly at{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
        <button type="button" className="btn-g" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-row">
        <div className="contact-form-field">
          <label htmlFor="field-name">Name</label>
          <input
            id="field-name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={setField('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'error-name' : undefined}
          />
          {errors.name && <span className="contact-form-error" id="error-name">{errors.name}</span>}
        </div>

        <div className="contact-form-field">
          <label htmlFor="field-email">Email</label>
          <input
            id="field-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={setField('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'error-email' : undefined}
          />
          {errors.email && <span className="contact-form-error" id="error-email">{errors.email}</span>}
        </div>
      </div>

      <div className="contact-form-field">
        <label htmlFor="field-phone">Phone <span className="contact-form-optional">(optional)</span></label>
        <input
          id="field-phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={setField('phone')}
        />
      </div>

      <div className="contact-form-field">
        <label htmlFor="field-message">Tell us about your project</label>
        <textarea
          id="field-message"
          rows={4}
          value={values.message}
          onChange={setField('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'error-message' : undefined}
        />
        {errors.message && <span className="contact-form-error" id="error-message">{errors.message}</span>}
      </div>

      {/* Honeypot — hidden from people, filled by bots */}
      <input
        type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={values.company} onChange={setField('company')}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <div className="contact-form-actions">
        <button type="submit" className="btn-p contact-form-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
        <button type="button" className="btn-g contact-form-wa" onClick={handleWhatsApp}>
          Send via WhatsApp
        </button>
      </div>
    </form>
  );
}
