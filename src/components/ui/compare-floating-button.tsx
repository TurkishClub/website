'use client';

import {memo} from 'react';
import {pillClass} from '@/components/home/Pill';

interface CompareFloatingButtonProps {
  compareCount: number;
  itemLabel: string; // e.g., "yurt" or "ders yeri"
  maxItems?: number;
  onOpenComparison: () => void;
  onClearComparison: () => void;
}

function CompareFloatingButtonComponent({
  compareCount,
  itemLabel,
  maxItems = 4,
  onOpenComparison,
  onClearComparison
}: CompareFloatingButtonProps) {
  if (compareCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex max-w-md items-center gap-3 rounded-full bg-ink-950 py-2 pl-6 pr-2 text-white shadow-[0_24px_60px_-20px_rgb(20_17_17/0.5)]">
        <div className="flex items-center gap-3">
          <div>
            <div className="whitespace-nowrap text-sm font-medium">
              {compareCount} {itemLabel} seçildi
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClearComparison}
            className="rounded-full px-3 py-2 text-sm text-white/70 transition-colors hover:text-white"
          >
            Tümünü temizle
          </button>
          <button
            type="button"
            onClick={onOpenComparison}
            disabled={compareCount === 0}
            className={pillClass('light', 'px-5 py-2.5')}
          >
            Karşılaştır
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export const CompareFloatingButton = memo(CompareFloatingButtonComponent);
