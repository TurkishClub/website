'use client';

import {memo} from 'react';
import {Eye} from 'lucide-react';
import {Button} from '@/components/ui/button';

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
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 flex items-center gap-4 max-w-sm">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {compareCount} {itemLabel} seçildi
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenComparison}
            size="sm"
            className="bg-[#C61E1E] hover:bg-red-700 text-white text-sm font-medium px-4"
            disabled={compareCount === 0}
            >
            <Eye className="w-4 h-4 mr-2" />
            Karşılaştır
          </Button>
          
          <Button
            onClick={onClearComparison}
            size="sm"
            variant="ghost"
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            title="Tümünü temizle"
          >
            Tümünü temizle
          </Button>
        </div>
      </div>
    </div>
  );
}

export const CompareFloatingButton = memo(CompareFloatingButtonComponent);
