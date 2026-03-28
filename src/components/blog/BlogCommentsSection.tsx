'use client';

import {type FormEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import type {BlogComment} from '@/lib/comments/types';

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}

type BlogCommentsSectionProps = {
  postSlug: string;
  locale: string;
};

const MAX_RENDER_DEPTH = 8;

export default function BlogCommentsSection({
  postSlug,
  locale
}: BlogCommentsSectionProps) {
  const t = useTranslations('blog.comments');
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const [authorName, setAuthorName] = useState('');
  const [body, setBody] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({postSlug, locale});
      const response = await fetch(`/api/comments?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || t('loadError'));
      }

      setComments(data.comments ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : t('loadError')
      );
    } finally {
      setLoading(false);
    }
  }, [locale, postSlug, t]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  useEffect(() => {
    if (!siteKey || !turnstileContainerRef.current) {
      return;
    }

    let isCancelled = false;

    const mountTurnstile = () => {
      if (
        isCancelled ||
        !window.turnstile ||
        !turnstileContainerRef.current
      ) {
        return;
      }

      if (turnstileWidgetIdRef.current) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }

      turnstileWidgetIdRef.current = window.turnstile.render(
        turnstileContainerRef.current,
        {
          sitekey: siteKey,
          callback: (token) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => setTurnstileToken('')
        }
      );
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-turnstile="true"]'
    );

    if (existingScript) {
      if (window.turnstile) {
        mountTurnstile();
      } else {
        existingScript.addEventListener('load', mountTurnstile, {once: true});
      }
    } else {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = 'true';
      script.addEventListener('load', mountTurnstile, {once: true});
      document.head.appendChild(script);
    }

    return () => {
      isCancelled = true;
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
      }
      turnstileWidgetIdRef.current = null;
    };
  }, [siteKey, replyTo]);

  const totalComments = useMemo(() => countComments(comments), [comments]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    setSubmitting(true);
    try {
      const payload: Record<string, string> = {
        postSlug,
        locale,
        authorName,
        body,
        honeypot,
        turnstileToken
      };

      if (replyTo) {
        payload.parentId = replyTo;
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || t('submitError'));
      }

      setSuccess(t('success'));
      setBody('');
      setReplyTo(null);
      setHoneypot('');
      setTurnstileToken('');
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }

      await loadComments();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : t('submitError')
      );
    } finally {
      setSubmitting(false);
    }
  }

  const localeTag = locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : 'en-US';

  function renderForm(inline: boolean): ReactNode {
    return (
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-gray-200 p-5 bg-gray-50"
      >
        <div>
          <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
            {t('form.name')}
          </label>
          <input
            id="authorName"
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 caret-[#C61E1E] placeholder:text-gray-400"
            placeholder={t('form.namePlaceholder')}
            required
            minLength={2}
            maxLength={60}
          />
        </div>

        <div>
          <label htmlFor="commentBody" className="block text-sm font-medium text-gray-700 mb-1">
            {replyTo ? t('form.replyLabel') : t('form.message')}
          </label>
          <textarea
            id="commentBody"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 caret-[#C61E1E] placeholder:text-gray-400 min-h-28"
            placeholder={t('form.messagePlaceholder')}
            required
            minLength={3}
            maxLength={1200}
          />
        </div>

        <input
          aria-hidden
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          className="hidden"
          name="website"
        />

        {replyTo ? (
          <div className="text-xs text-gray-500">
            {t('replyingTo')}{' '}
            <button
              type="button"
              className="text-[#C61E1E] hover:underline"
              onClick={() => setReplyTo(null)}
            >
              {t('cancelReply')}
            </button>
          </div>
        ) : null}

        {siteKey ? <div ref={turnstileContainerRef} key={inline ? `reply-${replyTo}` : 'root'} /> : null}

        {!siteKey ? (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
            {t('captchaNotConfigured')}
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-[#C61E1E] px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          disabled={submitting || (!turnstileToken && Boolean(siteKey))}
        >
          {submitting ? t('form.submitting') : t('form.submit')}
        </button>
      </form>
    );
  }

  return (
    <section className="mt-20 border-t border-gray-200 pt-12 text-gray-900">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">{t('title')}</h2>
        <span className="text-sm text-gray-500">
          {t('count', {count: totalComments.toString()})}
        </span>
      </div>

      {!replyTo ? renderForm(false) : null}

      <div className="mt-10">
        {loading ? <p className="text-sm text-gray-500">{t('loading')}</p> : null}

        {!loading && comments.length === 0 ? (
          <p className="text-sm text-gray-500">{t('empty')}</p>
        ) : null}

        {!loading && comments.length > 0 ? (
          <ul className="space-y-5">
            {comments.map((comment) => (
              <CommentNode
                key={comment.id}
                comment={comment}
                localeTag={localeTag}
                depth={0}
                onReply={(commentId) => setReplyTo(commentId)}
                replyLabel={t('reply')}
                renderReplyForm={(commentId) =>
                  replyTo === commentId ? (
                    <div className="mt-3">{renderForm(true)}</div>
                  ) : null
                }
              />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

type CommentNodeProps = {
  comment: BlogComment;
  localeTag: string;
  depth: number;
  onReply: (commentId: string) => void;
  replyLabel: string;
  renderReplyForm: (commentId: string) => ReactNode;
};

function CommentNode({
  comment,
  localeTag,
  depth,
  onReply,
  replyLabel,
  renderReplyForm
}: CommentNodeProps) {
  const formattedDate = new Date(comment.createdAt).toLocaleString(localeTag, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <li>
      <article className="rounded-lg border border-gray-200 bg-white p-4">
        <header className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <strong className="text-gray-900">{comment.authorName}</strong>
          <span>•</span>
          <time dateTime={comment.createdAt}>{formattedDate}</time>
        </header>

        <p className="text-gray-700 whitespace-pre-wrap">{comment.body}</p>

        {depth < MAX_RENDER_DEPTH ? (
          <button
            type="button"
            className="mt-3 text-sm text-[#C61E1E] hover:underline"
            onClick={() => onReply(comment.id)}
          >
            {replyLabel}
          </button>
        ) : null}

        {renderReplyForm(comment.id)}
      </article>

      {comment.children.length > 0 && depth < MAX_RENDER_DEPTH ? (
        <ul className="mt-3 ml-4 border-l border-gray-200 pl-4 space-y-3">
          {comment.children.map((child) => (
            <CommentNode
              key={child.id}
              comment={child}
              localeTag={localeTag}
              depth={depth + 1}
              onReply={onReply}
              replyLabel={replyLabel}
              renderReplyForm={renderReplyForm}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function countComments(items: BlogComment[]): number {
  let total = 0;
  for (const item of items) {
    total += 1;
    total += countComments(item.children);
  }
  return total;
}
