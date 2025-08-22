import { cn } from '@/shared/lib/utils';
import { CheckIcon } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  classNameContainer?: string;
};

const Checkbox = ({
  name,
  checked,
  disabled,
  className,
  classNameContainer,
  ...props
}: CheckboxProps) => {
  return (
    <label className={cn(`flex w-fit h-fit`, classNameContainer)}>
      <input
        type='checkbox'
        name={name}
        className={`peer pointer-events-none w-0 appearance-none`}
        checked={checked ? true : false}
        disabled={disabled}
        {...props}
      />
      <div
        onMouseDown={(e) => e.preventDefault()}
        className={cn(
          `z-0 w-5 h-5 pointer-events-auto relative aspect-square bg-black/5 hover:bg-black/10 dark:bg-neutral-800 dark:hover:bg-white/10  transition-colors peer-checked:bg-text rounded-lg peer-checked:[&>*]:animate-pop-up peer-checked:[&>*]:opacity-100 
          ${disabled && 'cursor-not-allowed'}`,
          className
        )}
        role='checkbox'
        tabIndex={0}
        aria-checked={checked}
        {...props}
      >
        <CheckIcon className='dark:text-neutral-50 absolute inset-0 m-auto w-[0.6rem] animate-none stroke-[6px] text-foreground opacity-0' />
      </div>
    </label>
  );
};

export { Checkbox };
