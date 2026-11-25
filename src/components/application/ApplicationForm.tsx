'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { applicationTeamKeys, cvError, readApplicationFields, type Application } from '@/lib/application';
import { cn } from '@/lib/utils';

const inputClass = 'w-full border-0 border-b border-ink-950/30 bg-transparent px-0 py-3 text-lg text-ink-950 placeholder:text-ink-500/70 focus:border-cardinal-700 focus:outline-none aria-[invalid=true]:border-cardinal-700';
const errorClass = 'text-sm text-cardinal-700';
type TextFieldName = Exclude<keyof Application, 'teams' | 'consent'>;

function SectionTitle({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-ink-950/30 pt-5">
      <span className="label-caps text-ink-500" aria-hidden>{index}</span>
      <h3 className="font-serif text-[clamp(1.5rem,2.2vw,2rem)] font-normal leading-[1.1] tracking-[-0.01em]">{children}</h3>
    </div>
  );
}

export default function ApplicationForm() {
  const t = useTranslations('application.form');
  const submissionId = useRef<string>(null);
  const submitting = useRef(false);
  const [selectedTeams, setSelectedTeams] = useState<Application['teams']>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const application = readApplicationFields(data);
    const attachmentError = cvError(data.get('cv'));
    const errors: Record<string, string> = {};
    if (!application.success) {
      for (const issue of application.error.issues) {
        errors[String(issue.path[0])] = t(`errors.${issue.path[0] === 'email' ? 'email' : 'field'}`);
      }
    }
    if (attachmentError) errors.cv = t(`errors.${attachmentError}`);
    setFieldErrors(errors);
    setServerError(undefined);
    if (Object.keys(errors).length) {
      const first = [...form.elements].find((element): element is HTMLElement =>
        element instanceof HTMLElement && !!errors[element.getAttribute('name') || '']
      );
      first?.focus();
      return;
    }

    submitting.current = true;
    setIsSubmitting(true);
    try {
      submissionId.current ??= crypto.randomUUID();
      data.set('submissionId', submissionId.current);
      const response = await fetch('/api/application', { method: 'POST', body: data });
      if (response.ok) {
        setSubmitted(true);
        return;
      }
      const { error }: { error?: string } = await response.json();
      switch (error) {
        case 'cvRequired':
        case 'cvTooLarge':
        case 'cvInvalid':
          setFieldErrors({ cv: t(`errors.${error}`) });
          requestAnimationFrame(() => form.querySelector<HTMLInputElement>('#application-cv')?.focus());
          break;
        case 'invalidFields':
        case 'rateLimited':
        case 'inProgress':
          setServerError(t(`errors.${error}`));
          break;
        default:
          setServerError(t('errors.error'));
      }
    } catch {
      setServerError(t('errors.error'));
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  function describe(name: string, hint?: string) {
    const error = fieldErrors[name] ? `application-${name}-error` : undefined;
    return { 'aria-invalid': !!error, 'aria-describedby': [hint, error].filter(Boolean).join(' ') || undefined };
  }

  function fieldError(name: string) {
    return fieldErrors[name] && <p id={`application-${name}-error`} role="alert" className={errorClass}>{fieldErrors[name]}</p>;
  }

  function textField(name: TextFieldName, options: { maxLength: number; label?: string; multiline?: boolean; type?: 'email'; autoComplete?: string; numeric?: boolean }) {
    const id = `application-${name}`;
    const props = { id, name, maxLength: options.maxLength, required: true, ...describe(name) };
    return (
      <div className="flex flex-col gap-2 min-w-0">
        <label htmlFor={id} className="label-caps text-ink-700">{options.label ?? t(`fields.${name}`)} *</label>
        {options.multiline ? (
          <textarea {...props} rows={4} className={cn(inputClass, 'resize-y')} />
        ) : (
          <input {...props} type={options.type || 'text'} autoComplete={options.autoComplete}
            inputMode={options.numeric ? 'numeric' : undefined} className={inputClass} />
        )}
        {fieldError(name)}
      </div>
    );
  }

  if (submitted) {
    return (
      <div role="status" className="border-y border-ink-950/30 py-14">
        <p className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] font-normal leading-[1.15] tracking-[-0.01em] text-cardinal-700">
          {t('success')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-12" aria-busy={isSubmitting}>
      <fieldset disabled={isSubmitting} className="flex min-w-0 flex-col gap-12">
        <section className="flex flex-col gap-8">
          <SectionTitle index="01">{t('sections.about')}</SectionTitle>
          <div className="grid gap-8 sm:grid-cols-2">
            {textField('name', { maxLength: 80, autoComplete: 'name' })}
            {textField('email', { maxLength: 200, type: 'email', autoComplete: 'email' })}
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionTitle index="02">{t('sections.study')}</SectionTitle>
          <div className="grid gap-8 sm:grid-cols-2">
            {textField('university', { maxLength: 120 })}
            {textField('degree', { maxLength: 80 })}
            {textField('program', { maxLength: 120 })}
            {textField('semester', { maxLength: 2, numeric: true })}
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionTitle index="03">{t('sections.club')}</SectionTitle>
          <fieldset className="flex min-w-0 flex-col gap-3" {...describe('teams', 'application-teams-hint')}>
            <legend className="label-caps text-ink-700">{t('fields.teams')} *</legend>
            <p id="application-teams-hint" className="text-sm text-ink-500">{t('teamsHint')}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {applicationTeamKeys.map((key) => (
                <label key={key} className="cursor-pointer">
                  <input type="checkbox" name="teams" value={key} className="peer sr-only"
                    checked={selectedTeams.includes(key)}
                    onChange={(event) => {
                      const checked = event.currentTarget.checked;
                      setSelectedTeams((teams) => checked ? [...teams, key] : teams.filter((team) => team !== key));
                    }} />
                  <span className="inline-flex rounded-full border border-ink-950/25 px-4 py-2 text-sm hover:border-ink-950 peer-checked:bg-ink-950 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-cardinal-700 peer-focus-visible:ring-offset-2">
                    {t(`teams.${key}`)}
                  </span>
                </label>
              ))}
            </div>
            {fieldError('teams')}
          </fieldset>
          {selectedTeams.includes('other') && textField('otherTeam', { maxLength: 120 })}
          {textField('contribution', {
            maxLength: 1800,
            multiline: true,
            label: t(selectedTeams.length > 1 ? 'fields.contributionPlural' : 'fields.contribution'),
          })}
          {textField('motivation', { maxLength: 1800, multiline: true })}
          {textField('availability', { maxLength: 80 })}
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="application-cv" className="label-caps text-ink-700">{t('fields.cv')} *</label>
            <input id="application-cv" name="cv" type="file" accept=".pdf,application/pdf" required
              className="max-w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink-950 file:px-4 file:py-2 file:text-white"
              {...describe('cv', 'application-cv-hint')} />
            <p id="application-cv-hint" className="text-sm text-ink-500">{t('cvHint')}</p>
            {fieldError('cv')}
          </div>
        </section>

        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-700">
            <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-cardinal-700" {...describe('consent')} />
            <span>{t('consent.label')}</span>
          </label>
          {fieldError('consent')}
        </div>
      </fieldset>

      {serverError && <p role="alert" className="rounded-xl bg-cardinal-700/10 px-4 py-3 text-sm text-cardinal-800">{serverError}</p>}

      <div>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-medium text-white hover:bg-cardinal-700 disabled:opacity-60">
          {isSubmitting ? t('submitting') : t('submit')}
          <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}
