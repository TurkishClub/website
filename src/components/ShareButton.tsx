'use client';

import {useCallback} from 'react';
import {Button, buttonVariants} from '@/components/ui/button';
import type {VariantProps} from 'class-variance-authority';
import {toast} from 'sonner';

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

interface ShareButtonProps {
  title?: string;
  className?: string;
  variant?: ButtonVariant;
}

export function ShareButton({
  title = '',
  className = '',
  variant = 'ghost'
}: ShareButtonProps) {
  const handleShare = useCallback(async () => {
    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({title: title || document.title, url});
        return;
      }

      await navigator.clipboard.writeText(url);
      // Simple fallback feedback
      toast('Paylaşım başarılı');
    } catch {
      toast.error('Paylaşım başarısız oldu');
    }
  }, [title]);

  return (
    <Button onClick={handleShare} className={className} variant={variant}>
      Paylaş
    </Button>
  );
}
