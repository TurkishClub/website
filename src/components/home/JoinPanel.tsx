'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

type ContactValues = { name: string; email: string; subject: string; message: string };

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

const inputClass =
  'w-full border-0 border-b border-ink-950/30 bg-transparent px-0 py-3 text-lg text-ink-950 placeholder:text-ink-500/70 focus:border-cardinal-700 focus:outline-none focus:ring-0 aria-[invalid=true]:border-cardinal-700';

/**
 * Two-up call to action: giant serif type on cardinal, contact form on stone.
 * Form behaviour (validation, /api/contact payload, messages) matches the previous ContactForm.
 */
export default function JoinPanel() {
  const t = useTranslations('contact');
  const tJoin = useTranslations('HomePage.join');
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const schema = z.object({
    name: z
      .string()
      .min(2, { message: t('form.name.errors.tooShort') })
      .max(50, { message: t('form.name.errors.tooLong') })
      .trim(),
    email: z.email({ message: t('form.email.errors.invalid') }),
    subject: z
      .string()
      .min(3, { message: t('form.subject.errors.tooShort') })
      .max(120, { message: t('form.subject.errors.tooLong') })
      .trim(),
    message: z
      .string()
      .min(10, { message: t('form.message.errors.tooShort') })
      .max(500, { message: t('form.message.errors.tooLong') })
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
    mode: 'onTouched'
  });

  const onSubmit = async (values: ContactValues) => {
    setServerError(null);
    setServerSuccess(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.name, email: values.email, message: values.message })
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) throw new Error(t('form.rateLimited'));
        throw new Error(data?.error || t('form.genericError'));
      }
      setServerSuccess(t('form.success'));
      reset();
    } catch (err: any) {
      setServerError(err?.message || t('form.error'));
    }
  };

  const describe = (name: keyof ContactValues) =>
    errors[name] ? { 'aria-invalid': true, 'aria-describedby': `contact-${name}-error` } : {};

  return (
    <section id="contact" className="grid scroll-mt-6 lg:grid-cols-2">
      <div className="relative flex min-h-[22rem] items-end overflow-hidden bg-cardinal-800 text-white lg:min-h-[44rem]">
        <p
          aria-hidden
          className="pointer-events-none select-none px-4 pb-6 font-serif text-[clamp(5rem,11.5vw,12rem)] font-normal leading-[0.9] tracking-[-0.03em] text-white md:px-6 md:pb-8"
        >
          {tJoin('giant')}
        </p>
      </div>

      <div className="bg-stone-50 px-4 py-16 text-ink-950 md:px-10 md:py-20 lg:px-14">
        <h2 className="sr-only">{tJoin('giant')}</h2>
        <p className="max-w-xl font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] font-normal leading-[1.2] tracking-[-0.01em]">
          {tJoin('text')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-12 flex max-w-xl flex-col gap-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <Field id="contact-name" label={t('form.name.label')} error={errors.name?.message}>
              <input id="contact-name" autoComplete="name" placeholder={t('form.name.placeholder')} className={inputClass} {...describe('name')} {...register('name')} />
            </Field>
            <Field id="contact-email" label={t('form.email.label')} error={errors.email?.message}>
              <input id="contact-email" type="email" autoComplete="email" placeholder={t('form.email.placeholder')} className={inputClass} {...describe('email')} {...register('email')} />
            </Field>
          </div>
          <Field id="contact-subject" label={t('form.subject.label')} error={errors.subject?.message}>
            <input id="contact-subject" placeholder={t('form.subject.placeholder')} className={inputClass} {...describe('subject')} {...register('subject')} />
          </Field>
          <Field id="contact-message" label={t('form.message.label')} error={errors.message?.message}>
            <textarea id="contact-message" rows={5} placeholder={t('form.message.placeholder')} className={cn(inputClass, 'resize-none')} {...describe('message')} {...register('message')} />
          </Field>

          {serverError && (
            <p role="alert" className="rounded-xl bg-cardinal-700/10 px-4 py-3 text-sm text-cardinal-800">
              {serverError}
            </p>
          )}
          {serverSuccess && (
            <p role="status" className="rounded-xl bg-ink-950/5 px-4 py-3 text-sm text-ink-950">
              {serverSuccess}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-medium text-white transition-[background-color,transform] duration-160 ease-out-strong hover:bg-cardinal-700 active:scale-[0.97] disabled:opacity-60"
            >
              {isSubmitting ? t('form.submitting') : t('form.submit')}
              <span aria-hidden className="transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
