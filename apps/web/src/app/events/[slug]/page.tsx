import { Suspense } from 'react';
import EventPageParentCard from '@/components/EventPageParentCard';
import { cacheLife } from 'next/cache';

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  'use cache: private'; // 'use cache' does not work because of runtime data such as cookies()
  cacheLife({ stale: 10 }); // prevent data going stale on this path for revalidation
  return (
    <>
      <Suspense fallback={'Loading...'}>
        <EventPageParentCard params={params} />
      </Suspense>
    </>
  );
}
