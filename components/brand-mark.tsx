import Image from 'next/image';

import { cn } from '@/lib/utils';

export function BrandMark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/uvo-logo.png"
      alt=""
      aria-hidden="true"
      width={627}
      height={300}
      priority={priority}
      className={cn('h-auto w-14 select-none object-contain', className)}
    />
  );
}
