// src/components/ui/Card.tsx
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-border-color bg-surface text-text-primary shadow-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
