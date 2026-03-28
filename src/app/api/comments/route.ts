import {NextRequest, NextResponse} from 'next/server';
import {checkRateLimit} from '@/lib/comments/rate-limit';
import {
  createCommentSchema,
  listCommentsSchema
} from '@/lib/comments/schema';
import {createComment, listCommentsByPost} from '@/lib/comments/service';
import {verifyTurnstile} from '@/lib/comments/turnstile';

export async function GET(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url);

    const validated = listCommentsSchema.safeParse({
      postSlug: searchParams.get('postSlug') || '',
      locale: searchParams.get('locale') || ''
    });

    if (!validated.success) {
      return NextResponse.json(
        {error: 'Invalid query parameters'},
        {status: 400}
      );
    }

    const comments = await listCommentsByPost(
      validated.data.postSlug,
      validated.data.locale
    );

    return NextResponse.json({comments}, {status: 200});
  } catch (error) {
    console.error('comments GET error', error);
    return NextResponse.json(
      {error: 'Unable to load comments'},
      {status: 500}
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createCommentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          issues: validated.error.flatten()
        },
        {status: 400}
      );
    }

    if (validated.data.honeypot?.trim()) {
      return NextResponse.json({success: true}, {status: 201});
    }

    const ip = getRequestIp(req) || 'unknown';
    const commentKind = validated.data.parentId ? 'reply' : 'root';
    const rateLimitKey = `${ip}:${validated.data.postSlug}:${validated.data.locale}:${commentKind}`;
    const rateLimit = checkRateLimit(rateLimitKey, 5, 60_000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {error: 'Too many comments, please try again later'},
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds)
          }
        }
      );
    }

    const captchaResult = await verifyTurnstile({
      token: validated.data.turnstileToken,
      ip
    });

    if (!captchaResult.ok) {
      return NextResponse.json(
        {error: captchaResult.reason || 'Captcha verification failed'},
        {status: 400}
      );
    }

    const comment = await createComment({
      postSlug: validated.data.postSlug,
      locale: validated.data.locale,
      parentId: validated.data.parentId,
      authorName: validated.data.authorName,
      body: validated.data.body,
      ipHash: await hashIp(ip)
    });

    return NextResponse.json({success: true, comment}, {status: 201});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('comments POST error:', {
      message: errorMessage,
      stack: errorStack,
      type: error?.constructor?.name
    });

    if (error instanceof Error) {
      if (error.message.includes('not configured')) {
        return NextResponse.json(
          {error: 'Comments backend is not configured yet'},
          {status: 503}
        );
      }

      if (
        error.message.includes('Parent comment') ||
        error.message.includes('depth')
      ) {
        return NextResponse.json({error: error.message}, {status: 400});
      }
    }

    return NextResponse.json(
      {error: 'Unable to create comment', details: errorMessage},
      {status: 500}
    );
  }
}

function getRequestIp(req: NextRequest) {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0]?.trim();
  }

  return req.headers.get('x-real-ip');
}

async function hashIp(ip: string) {
  const buffer = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}
