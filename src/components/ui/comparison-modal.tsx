'use client';

import {memo, useState, ReactNode, JSX, MouseEvent} from 'react';
import {X, Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';

export interface ComparisonItem {
  id: string;
  name: string;
  address?: string;
}

export interface ComparisonFeature {
  key: string;
  label: string;
}

export interface ComparisonTab {
  key: string;
  label: string;
  content: ReactNode;
}

interface ComparisonModalProps<T extends ComparisonItem> {
  items: T[];
  title: string;
  itemLabel: string; // e.g., "yurt" or "ders yeri"
  onClose: () => void;
  onAddMore?: () => void;
  tabs: ComparisonTab[];
  maxItems?: number;
}

function ComparisonModalComponent<T extends ComparisonItem>({
  items,
  title,
  itemLabel,
  onClose,
  onAddMore,
  tabs,
  maxItems = 4
}: ComparisonModalProps<T>) {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]?.key || 'overview');

  if (items.length === 0) {
    return null;
  }

  const currentTab = tabs.find(tab => tab.key === selectedTab) || tabs[0];

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4" onClick={handleBackdropClick}>
      <div className="flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden bg-stone-50 text-ink-950">
        <div className="flex flex-shrink-0 items-center justify-between gap-4 bg-maroon-950 p-6 text-white md:px-8">
          <div>
            <h2 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm text-white/60">
              {items.length} {itemLabel} karşılaştırılıyor
            </p>
          </div>
          <div className="flex items-center gap-3">
            {items.length < maxItems && onAddMore && (
              <Button
                onClick={onAddMore}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Plus className="w-4 h-4" />
                {itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)} Ekle
              </Button>
            )}
            <Button onClick={onClose} variant="ghost" size="sm" className="rounded-full text-white/70 hover:bg-white/10 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-shrink-0 border-b border-ink-950/15 px-6 py-3 md:px-8">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-[background-color,color,transform] duration-160 ease-out-strong active:scale-[0.97] ${
                  selectedTab === tab.key
                    ? 'bg-ink-950 text-white'
                    : 'text-ink-700 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {currentTab?.content}
        </div>
      </div>
    </div>
  );
}

export const ComparisonModal = memo(ComparisonModalComponent) as <T extends ComparisonItem>(
  props: ComparisonModalProps<T>
) => JSX.Element;
