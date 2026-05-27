import { useId, useState, type FormEvent } from 'react';

export interface ContactStrings {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  requiredName: string;
  requiredEmail: string;
  invalidEmail: string;
  requiredMessage: string;
  errorGeneric: string;
}

interface Props {
  /** Access key de Web3Forms (PUBLIC_WEB3FORMS_KEY). */
  accessKey: string;
  /** Ruta de destino tras o envío correcto (páxina de grazas). */
  redirectTo: string;
  /** Asunto do correo que recibe IGIT. */
  subject: string;
  strings: ContactStrings;
}

type Field = 'name' | 'email' | 'message';
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({ accessKey, redirectTo, subject, strings }: Props) {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const formErrorId = useId();
  const ids = {
    name: useId(),
    email: useId(),
    message: useId(),
  };

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = strings.requiredName;
    if (!values.email.trim()) next.email = strings.requiredEmail;
    else if (!EMAIL_RE.test(values.email.trim())) next.email = strings.invalidEmail;
    if (!values.message.trim()) next.message = strings.requiredMessage;
    return next;
  }

  function update(field: Field) {
    return (e: { target: { value: string } }) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Honeypot: se está cuberto, é un bot → ignorar silenciosamente.
    const form = e.currentTarget;
    const botcheck = (form.elements.namedItem('botcheck') as HTMLInputElement | null)?.checked;
    if (botcheck) return;

    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject,
          from_name: 'IGIT — formulario web',
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      });
      const data = (await res.json()) as { success?: boolean };
      if (data.success) {
        window.location.href = redirectTo;
        return;
      }
      setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  const sending = status === 'sending';

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot anti-spam: invisible para persoas, atractivo para bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px]">
        <label>
          Non cubras este campo
          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor={ids.name} className="block text-sm font-medium text-text">
          {strings.name}
        </label>
        <input
          id={ids.name}
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={update('name')}
          placeholder={strings.namePlaceholder}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${ids.name}-err` : undefined}
          className="mt-1.5 w-full rounded-btn border border-border bg-surface px-3.5 py-2.5 text-text outline-none transition-colors focus:border-primary aria-[invalid]:border-destructive"
        />
        {errors.name && (
          <p id={`${ids.name}-err`} className="mt-1.5 text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={ids.email} className="block text-sm font-medium text-text">
          {strings.email}
        </label>
        <input
          id={ids.email}
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={update('email')}
          placeholder={strings.emailPlaceholder}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${ids.email}-err` : undefined}
          className="mt-1.5 w-full rounded-btn border border-border bg-surface px-3.5 py-2.5 text-text outline-none transition-colors focus:border-primary aria-[invalid]:border-destructive"
        />
        {errors.email && (
          <p id={`${ids.email}-err`} className="mt-1.5 text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={ids.message} className="block text-sm font-medium text-text">
          {strings.message}
        </label>
        <textarea
          id={ids.message}
          name="message"
          rows={6}
          value={values.message}
          onChange={update('message')}
          placeholder={strings.messagePlaceholder}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${ids.message}-err` : undefined}
          className="mt-1.5 w-full resize-y rounded-btn border border-border bg-surface px-3.5 py-2.5 text-text outline-none transition-colors focus:border-primary aria-[invalid]:border-destructive"
        />
        {errors.message && (
          <p id={`${ids.message}-err`} className="mt-1.5 text-sm text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {status === 'error' && (
        <p id={formErrorId} role="alert" className="rounded-btn bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {strings.errorGeneric}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        aria-describedby={status === 'error' ? formErrorId : undefined}
        className="inline-flex items-center justify-center gap-2 self-start rounded-btn bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? strings.sending : strings.send}
      </button>
    </form>
  );
}
