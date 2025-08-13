import {Card, CardContent, CardHeader} from '@/components/ui/card';

export function BlogCardSkeleton() {
  return (
    <Card className="group bg-white border-0 shadow-md">
      {/* Image skeleton */}
      <div className="h-48 w-full bg-gray-200 animate-pulse rounded-t-lg" />

      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
        </div>

        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
          </div>

          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({length: 12}, (_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
