import React from 'react';
import {Card, CardContent, CardHeader} from '@/components/ui/card';

export function JobCardSkeleton() {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <CardHeader className="pb-4">
        {/* Title and department skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
          </div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
        </div>

        {/* Location and type skeleton */}
        <div className="flex items-center gap-4 mt-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Summary skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
        </div>

        {/* Requirements skeleton */}
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded animate-pulse w-4/5" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/5" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-3 mt-6">
          <div className="h-10 bg-gray-200 rounded animate-pulse flex-1" />
          <div className="h-10 bg-gray-100 rounded animate-pulse w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

export function JobGridSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({length: 6}, (_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}
