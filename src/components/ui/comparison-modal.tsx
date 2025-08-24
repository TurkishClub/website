'use client';

import {memo, useState, ReactNode, JSX} from 'react';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {items.length} {itemLabel} karşılaştırılıyor
            </p>
          </div>
          <div className="flex items-center gap-3">
            {items.length < maxItems && onAddMore && (
              <Button
                onClick={onAddMore}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                {itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)} Ekle
              </Button>
            )}
            <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-50 px-6 py-3 border-b flex-shrink-0">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-[#C61E1E] text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
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
