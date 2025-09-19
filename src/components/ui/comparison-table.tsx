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
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900 bg-gray-50">Özellik</th>
              {items.map(item => (
                <th key={item.id} className="text-left py-3 px-4 min-w-[200px] bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-600 font-normal mt-1">
                        {item.address?.split(',')[0]}
                      </div>
                    </div>
                    <Button
                      onClick={() => onRemoveItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((row, index) => (
              <tr key={row.key} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="py-4 px-4 font-medium text-gray-800 bg-gray-100">{row.label}</td>
                {items.map(item => {
                  const isHighlighted = row.highlight ? row.highlight(items)(item) : false;
                  return (
                    <td key={item.id} className="py-4 px-4">
                      <div className={isHighlighted ? 'text-green-600 font-medium' : 'text-gray-900'}>
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
