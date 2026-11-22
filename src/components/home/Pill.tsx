import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type Variant = 'ink' | 'onRed' | 'outline' | 'light' | 'onDark';

const VARIANTS: Record<Variant, string> = {
  ink: 'bg-ink-950 text-white hover:bg-cardinal-700',
  onRed: 'bg-white/15 text-white hover:bg-white hover:text-cardinal-800',
  light: 'bg-white text-maroon-950 hover:bg-stone-200',
  onDark: 'border border-white/30 text-white hover:border-white hover:bg-white/10',
  outline: 'border border-ink-950/25 text-ink-950 hover:border-ink-950 hover:bg-ink-950 hover:text-white'
};

/** Rounded pill link with a trailing arrow: the site's one button shape. */
export function Pill({
  href,
  children,
  variant = 'ink',
  external = false,
  arrow = '→',
  className
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  arrow?: string | null;
  className?: string;
}) {
  const classes = cn(
    'group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-[color,background-color,border-color,transform] duration-160 ease-out-strong active:scale-[0.97]',
    VARIANTS[variant],
    className
  );
  const content = (
    <>
      {children}
      {arrow && (
        <span aria-hidden className="transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5">
          {arrow}
        </span>
      )}
    </>
  );

  if (external || href.startsWith('#')) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

/** Small tracked caption label. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('label-caps', className)}>{children}</p>;
}
