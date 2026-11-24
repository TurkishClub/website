'use client';

import {ReactNode} from 'react';
import {X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ComparisonItem} from './comparison-modal';

export interface TableRow<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
  highlight?: (items: T[]) => (item: T) => boolean;
}

interface ComparisonTableProps<T extends ComparisonItem> {
  items: T[];
  rows: TableRow<T>[];
  onRemoveItem: (itemId: string) => void;
}

export function ComparisonTable<T extends ComparisonItem>({
  items,
  rows,
  onRemoveItem
}: ComparisonTableProps<T>) {
  return (
    <div className="p-6 md:p-8">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-950/30">
              <th className="px-4 py-4 text-left text-sm font-normal text-ink-500">Özellik</th>
              {items.map(item => (
                <th key={item.id} className="min-w-[200px] px-4 py-4 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-serif text-xl font-normal leading-tight">{item.name}</div>
                      <div className="mt-1 text-xs font-normal text-ink-500">
                        {item.address?.split(',')[0]}
                      </div>
                    </div>
                    <Button
                      onClick={() => onRemoveItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-ink-500 hover:bg-stone-200 hover:text-cardinal-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.key} className={`border-b border-ink-950/15 ${index % 2 === 0 ? 'bg-white' : ''}`}>
                <td className="px-4 py-5 text-sm font-medium text-ink-700">{row.label}</td>
                {items.map(item => {
                  const isHighlighted = row.highlight ? row.highlight(items)(item) : false;
                  return (
                    <td key={item.id} className="px-4 py-5">
                      <div className={isHighlighted ? 'font-medium text-cardinal-700' : 'text-ink-950'}>
                        {row.render(item)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
