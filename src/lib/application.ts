import { z } from 'zod';

export const MAX_CV_BYTES = 5_000_000;
export const MAX_APPLICATION_BYTES = MAX_CV_BYTES + 64 * 1024;

export const applicationTeams = {
  media: 'Sosyal Medya',
  software: 'Yazılım',
  content: 'İçerik',
  events: 'Etkinlik',
  other: 'Other',
} as const;

export const applicationTeamKeys = ['media', 'software', 'content', 'events', 'other'] as const;

const requiredText = (length: number) => z.string().trim().min(1).max(length);

export const applicationSchema = z.object({
  name: requiredText(80),
  email: z.string().trim().max(200).pipe(z.email()),
  university: requiredText(120),
  degree: requiredText(80),
  program: requiredText(120),
  semester: z.string().trim().regex(/^[1-9]\d?$/),
  teams: z.array(z.enum(applicationTeamKeys)).min(1).max(applicationTeamKeys.length),
  otherTeam: z.string().trim().max(120),
  contribution: requiredText(1800),
  motivation: requiredText(1800),
  availability: requiredText(80),
  consent: z.literal(true),
}).refine(({ teams, otherTeam }) => !teams.includes('other') || !!otherTeam, { path: ['otherTeam'] });

export type Application = z.infer<typeof applicationSchema>;

export function readApplicationFields(form: FormData) {
  return applicationSchema.safeParse({
    name: form.get('name'),
    email: form.get('email'),
    university: form.get('university'),
    degree: form.get('degree'),
    program: form.get('program'),
    semester: form.get('semester'),
    teams: form.getAll('teams'),
    otherTeam: form.get('otherTeam') ?? '',
    contribution: form.get('contribution'),
    motivation: form.get('motivation'),
    availability: form.get('availability'),
    consent: form.get('consent') === 'on',
  });
}

export function cvError(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || !value.size) return 'cvRequired';
  if (value.size > MAX_CV_BYTES) return 'cvTooLarge';
  if (!/\.pdf$/i.test(value.name) || (value.type && value.type !== 'application/pdf')) return 'cvInvalid';
}
