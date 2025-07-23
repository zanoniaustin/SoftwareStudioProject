// src/components/ui/Button.tsx
import React from 'react';
import { cn } from '../../lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',

          // Variants
          variant === 'primary' &&
            'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'secondary' &&
            'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          variant === 'destructive' &&
            'bg-destructive text-destructive-foreground hover:bg-destructive/90',

          // Sizes
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'lg' && 'h-11 px-8',

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
