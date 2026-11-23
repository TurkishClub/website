'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

type ApplicationValues = {
  name: string;
  email: string;
  phone: string;
  university: string;
  program: string;
  semester: string;
  interests: string[];
  motivation: string;
  source: string;
  consent: boolean;
};

const INTEREST_KEYS = ['events', 'community', 'media', 'design', 'tech', 'partnerships'] as const;

const inputClass =
  'w-full border-0 border-b border-ink-950/30 bg-transparent px-0 py-3 text-lg text-ink-950 placeholder:text-ink-500/70 focus:border-cardinal-700 focus:outline-none focus:ring-0 aria-[invalid=true]:border-cardinal-700';

function Field({
  id,
  label,
  error,
  children
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label-caps text-ink-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-cardinal-700">
          {error}
        </p>
      )}
    </div>
  );
}

function SectionTitle({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-ink-950/30 pt-5">
      <span className="label-caps text-ink-500">{index}</span>
      <h3 className="font-serif text-[clamp(1.5rem,2.2vw,2rem)] font-normal leading-[1.1] tracking-[-0.01em]">{children}</h3>
    </div>
  );
}

/** Membership application: validated client-side, posted to /api/application. */
export default function ApplicationForm() {
  const t = useTranslations('application.form');
  const tApp = useTranslations('application');
  const universities = tApp.raw('options.universities') as string[];
  const tInterests = (key: (typeof INTEREST_KEYS)[number]) => tApp(`options.interests.${key}`);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const schema = z.object({
    name: z.string().trim().min(2, t('name.tooShort')).max(80, t('name.tooLong')),
    email: z.email(t('email.invalid')),
    phone: z
      .string()
      .trim()
      .refine((v) => v === '' || /^[+()\d\s-]{6,30}$/.test(v), t('phone.invalid')),
    university: z.string().min(1, t('university.required')),
    program: z.string().trim().min(2, t('program.tooShort')).max(100, t('program.tooLong')),
    semester: z.string().trim().max(10),
    interests: z.array(z.string()),
    motivation: z.string().trim().min(30, t('motivation.tooShort')).max(1000, t('motivation.tooLong')),
    source: z.string().trim().max(200),
    consent: z.boolean().refine((v) => v === true, t('consent.required'))
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      university: '',
      program: '',
      semester: '',
      interests: [],
      motivation: '',
      source: '',
      consent: false
    },
    mode: 'onTouched'
  });

  const motivationLength = watch('motivation')?.length ?? 0;

  const onSubmit = async ({ consent: _consent, ...values }: ApplicationValues) => {
    setServerError(null);
    try {
      const res = await fetch('/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          interests: values.interests.map((key) => tInterests(key as (typeof INTEREST_KEYS)[number]))
        })
      });
      if (!res.ok) {
        throw new Error(res.status === 429 ? t('rateLimited') : t('error'));
      }
      setSubmitted(true);
    } catch (err: any) {
      setServerError(err?.message || t('error'));
    }
  };

  const describe = (name: keyof ApplicationValues) =>
    errors[name] ? { 'aria-invalid': true, 'aria-describedby': `application-${name}-error` } : {};

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-12">
      <section className="flex flex-col gap-8">
        <SectionTitle index="01">{t('sections.about')}</SectionTitle>
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id="application-name" label={t('name.label')} error={errors.name?.message}>
            <input id="application-name" autoComplete="name" placeholder={t('name.placeholder')} className={inputClass} {...describe('name')} {...register('name')} />
          </Field>
          <Field id="application-email" label={t('email.label')} error={errors.email?.message}>
            <input id="application-email" type="email" autoComplete="email" placeholder={t('email.placeholder')} className={inputClass} {...describe('email')} {...register('email')} />
          </Field>
        </div>
        <Field id="application-phone" label={t('phone.label')} error={errors.phone?.message}>
          <input id="application-phone" type="tel" autoComplete="tel" placeholder={t('phone.placeholder')} className={inputClass} {...describe('phone')} {...register('phone')} />
        </Field>
      </section>

      <section className="flex flex-col gap-8">
        <SectionTitle index="02">{t('sections.study')}</SectionTitle>
        <Field id="application-university" label={t('university.label')} error={errors.university?.message}>
          <select id="application-university" className={cn(inputClass, 'cursor-pointer')} {...describe('university')} {...register('university')}>
            <option value="">{t('university.placeholder')}</option>
            {universities.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-8 sm:grid-cols-[1fr_8rem]">
          <Field id="application-program" label={t('program.label')} error={errors.program?.message}>
            <input id="application-program" placeholder={t('program.placeholder')} className={inputClass} {...describe('program')} {...register('program')} />
          </Field>
          <Field id="application-semester" label={t('semester.label')} error={errors.semester?.message}>
            <input id="application-semester" inputMode="numeric" placeholder={t('semester.placeholder')} className={inputClass} {...describe('semester')} {...register('semester')} />
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <SectionTitle index="03">{t('sections.club')}</SectionTitle>

        <fieldset className="flex flex-col gap-3">
          <legend className="label-caps text-ink-700">{t('interests.label')}</legend>
          <p className="text-sm text-ink-500">{t('interests.hint')}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {INTEREST_KEYS.map((key) => (
              <label key={key} className="cursor-pointer">
                <input type="checkbox" value={key} className="peer sr-only" {...register('interests')} />
                <span className="inline-flex rounded-full border border-ink-950/25 px-4 py-2 text-sm text-ink-950 transition-[color,background-color,border-color,transform] duration-160 ease-out-strong hover:border-ink-950 active:scale-[0.97] peer-checked:border-ink-950 peer-checked:bg-ink-950 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-cardinal-700 peer-focus-visible:ring-offset-2">
                  {tInterests(key)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field id="application-motivation" label={t('motivation.label')} error={errors.motivation?.message}>
          <textarea id="application-motivation" rows={6} placeholder={t('motivation.placeholder')} className={cn(inputClass, 'resize-none')} {...describe('motivation')} {...register('motivation')} />
          <p className="text-right text-xs text-ink-500" aria-hidden>
            {motivationLength}/1000
          </p>
        </Field>

        <Field id="application-source" label={t('source.label')} error={errors.source?.message}>
          <input id="application-source" placeholder={t('source.placeholder')} className={inputClass} {...describe('source')} {...register('source')} />
        </Field>
      </section>

      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-700">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 cursor-pointer accent-cardinal-700"
            {...describe('consent')}
            {...register('consent')}
          />
          <span>{t('consent.label')}</span>
        </label>
        {errors.consent && (
          <p id="application-consent-error" className="text-sm text-cardinal-700">
            {errors.consent.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="rounded-xl bg-cardinal-700/10 px-4 py-3 text-sm text-cardinal-800">
          {serverError}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-medium text-white transition-[background-color,transform] duration-160 ease-out-strong hover:bg-cardinal-700 active:scale-[0.97] disabled:opacity-60"
        >
          {isSubmitting ? t('submitting') : t('submit')}
          <span aria-hidden className="transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
