import { MAX_CONTENT_TASK } from '@/shared/constants/base';
import { cn } from '@/shared/lib/utils';
import { forwardRef, TextareaHTMLAttributes } from 'react';

type textareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

export const TextInput = forwardRef<HTMLTextAreaElement, textareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={1}
        maxLength={MAX_CONTENT_TASK}
        className={cn(
          'w-full h-full overflow-auto py-1 pl-1 text-sm bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-white resize-none outline-none rounded',
          className
        )}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        {...props}
      />
    );
  }
);
