'use client';

import {PostHogProvider} from '@/components/PostHogProvider';

export default function StudySearchClient({
  children
}: {
  children: React.ReactNode;
}) {
  return <PostHogProvider>{children}</PostHogProvider>;
}
