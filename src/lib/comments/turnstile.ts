const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type VerifyTurnstileArgs = {
  token?: string;
  ip?: string;
};

export async function verifyTurnstile({token, ip}: VerifyTurnstileArgs) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const requireTurnstile = process.env.COMMENTS_REQUIRE_TURNSTILE === 'true';

  if (!secret) {
    return {
      ok: !requireTurnstile,
      reason: requireTurnstile
        ? 'Turnstile secret is missing'
        : 'Turnstile not configured'
    };
  }

  if (!token) {
    return {ok: false, reason: 'Missing captcha token'};
  }

  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) {
    body.set('remoteip', ip);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString(),
    cache: 'no-store'
  });

  if (!response.ok) {
    return {ok: false, reason: 'Captcha verification failed'};
  }

  const result = (await response.json()) as {
    success?: boolean;
    'error-codes'?: string[];
  };

  if (!result.success) {
    return {
      ok: false,
      reason: result['error-codes']?.join(', ') || 'Captcha verification failed'
    };
  }

  return {ok: true};
}
