import { useEffect, useState, type FormEvent } from 'react';
import { services, serviceTowns, type PartId } from '../data/services';
import { useSite } from '../lib/store';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'not-connected';

/**
 * Quote request form.
 * TODO(owner): connect it. Set VITE_QUOTE_ENDPOINT (in a .env file or your host's settings) to a form
 * backend URL that accepts multipart/form-data, e.g. Formspree, Basin, Netlify Forms or your own API.
 * Until then, the form says so honestly instead of pretending to send.
 */
async function submitQuote(data: FormData): Promise<Status> {
  const endpoint = import.meta.env.VITE_QUOTE_ENDPOINT;
  if (!endpoint) return 'not-connected';
  const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
  return res.ok ? 'sent' : 'error';
}

export default function QuoteForm() {
  const interested = useSite((s) => s.interested);
  const [parts, setParts] = useState<PartId[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  // Pre-fill with whatever the visitor clicked on the house.
  useEffect(() => {
    setParts((p) => Array.from(new Set([...p, ...interested])));
  }, [interested]);

  const toggle = (id: PartId) => setParts((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('services', parts.map((p) => services.find((s) => s.part === p)!.name).join(', '));
    setStatus('sending');
    try {
      setStatus(await submitQuote(fd));
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="quote-done" role="status">
        <h3>Thanks! Your request is in.</h3>
        <p>I’ll get back to you about a time to come by for your free estimate.</p>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={onSubmit}>
      <div className="field-row">
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Town
          <input name="town" list="towns" autoComplete="address-level2" required />
          <datalist id="towns">
            {serviceTowns.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </label>
      </div>
      <div className="field-row">
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" autoComplete="tel" required />
        </label>
      </div>

      <fieldset>
        <legend>What would you like cleaned?</legend>
        <div className="checks">
          {services.map((s) => (
            <label key={s.part} className={`check ${parts.includes(s.part) ? 'is-on' : ''}`}>
              <input type="checkbox" checked={parts.includes(s.part)} onChange={() => toggle(s.part)} />
              {s.name}
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        Tell me exactly what you want done
        <textarea
          name="details"
          rows={5}
          required
          placeholder="Be as specific as you can. For example: “Front and left side of the house only, the back patio (about 15×20 ft) including the joints, but not the steps.”"
        />
        <span className="hint">
          The more specific you are, the more accurate the quote, and there are no surprises on the day.
        </span>
      </label>

      <label>
        Photos (optional)
        <input name="photos" type="file" accept="image/*" multiple />
        <span className="hint">Send a few photos and I can give you a price range before I come out.</span>
      </label>

      <p className="form-note">
        Good to know: I’ll need an outdoor water source (a working spigot), and I don’t wash in the rain.
      </p>

      <button className="btn btn-primary btn-lg" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Book my free quote'}
      </button>

      {status === 'not-connected' && (
        <p className="form-status" role="alert">
          {/* TODO(owner): replace with your phone number once you decide to publish it. */}
          Online requests aren’t switched on yet. Please reach out directly for now.
        </p>
      )}
      {status === 'error' && (
        <p className="form-status" role="alert">
          Something went wrong sending that. Please try again in a minute.
        </p>
      )}
    </form>
  );
}
