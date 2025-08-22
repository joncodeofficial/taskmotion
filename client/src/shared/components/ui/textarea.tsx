import { cn } from '@/shared/lib/utils';
import { TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  classname?: string;
};

export const Textarea = ({ className, ...rest }: TextareaProps) => {
  return (
    <textarea
      rows={rest.rows ?? 8}
      maxLength={rest.maxLength ?? 1024}
      className={cn(
        `w-full pl-3 pr-12 py-1 text-sm rounded-md
          bg-neutral-200 dark:bg-neutral-900 
          placeholder:text-muted-foreground
          dark:placeholder:text-neutral-400
          text-muted-foreground
          dark:text-neutral-100
          focus:outline-none focus:ring-0 focus:ring-transparent
          resize-none transition-all duration-200
           border-none focus-visible:ring-0 outline-none text-pretty`,
        className
      )}
      {...rest}
    />
  );
};
