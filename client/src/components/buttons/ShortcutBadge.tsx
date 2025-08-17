import { cn } from '@/lib/utils';
import { Command } from 'lucide-react';

type ShortcutButtonProps = {
  keys: string;
  className: string;
};

export const ShortcutBadge = ({ keys, className }: ShortcutButtonProps) => {
  return (
    <div
      className={cn(
        `mr-1 flex items-center gap-x-[3px]
          text-neutral-600 dark:text-neutral-300 rounded-md h-8 text-xs
          group-focus-within:opacity-0 group-focus-within:scale-100 
          transition-opacity duration-200 pointer-events-none`,
        className
      )}
    >
      <div
        className='flex items-center justify-center rounded-[3px] bg-neutral-200 
      dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 w-6 h-6 shadow-sm border border-input'
      >
        <Command className='w-3.5 h-auto' />
      </div>
      <div
        className='flex items-center justify-center rounded-[4px] 
                      bg-neutral-200 dark:bg-neutral-900 
                      text-neutral-700 dark:text-neutral-300 
                      w-6 h-6 shadow-sm border border-input'
      >
        <span className='uppercase font-medium'>{keys}</span>
      </div>
    </div>
  );
};
