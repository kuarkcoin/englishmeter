import React, { type ComponentPropsWithoutRef, type ElementType } from 'react';
import { cn } from '@/lib/cn';

type DiamondCardProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

export default function DiamondCard<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: DiamondCardProps<T>) {
  const Component = (as || 'div') as ElementType;

  return (
    <Component
      className={cn(
        'diamond-card diamond-glow group relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--text))] shadow-[0_10px_35px_-20px_rgba(15,23,42,0.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-22px_rgba(59,130,246,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
