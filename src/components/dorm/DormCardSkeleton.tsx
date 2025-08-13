'use client';

import {Skeleton} from '@/components/ui/skeleton';
import {Card, CardContent, CardHeader} from '@/components/ui/card';

export function DormCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="text-right">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-12 mt-1" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex items-start gap-2">
          <Skeleton className="w-4 h-4 mt-0.5" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-6 w-8" />
          </div>
        </div>

        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      </CardContent>

      <div className="pt-4 px-6 pb-6 flex-col sm:flex-row gap-2 flex">
        <Skeleton className="h-8 w-full sm:flex-1" />
        <Skeleton className="h-8 w-full sm:w-24" />
      </div>
    </Card>
  );
}
