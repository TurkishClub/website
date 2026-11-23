import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendApplicationEmail } from '../../actions';

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(200),
  phone: z.string().trim().max(30).optional().default(''),
  university: z.string().trim().min(1).max(120),
  program: z.string().trim().min(2).max(100),
  semester: z.string().trim().max(10).optional().default(''),
  interests: z.array(z.string().trim().max(40)).max(10).default([]),
  motivation: z.string().trim().min(30).max(1000),
  source: z.string().trim().max(200).optional().default('')
});

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 });
    }

    const result = await sendApplicationEmail(parsed.data);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Application form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
