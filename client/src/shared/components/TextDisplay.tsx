import { Strikethrough } from '@/shared/components/ui/strikethrough';
import { cn } from '@/shared/lib/utils';

type TextDisplayProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  taskName: string;
  date: string;
  checked: boolean;
  classNameButton?: string;
};

export const TextDisplay = ({
  taskName,
  checked,
  date,
  classNameButton,
  className,
  ...props
}: TextDisplayProps) => {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        `cursor-text absolute pt-3.5 left-0.5 z-0 w-full h-full rounded-md flex items-start text-left 
    peer-focus:pointer-events-none peer-focus:opacity-0 peer-focus:text-transparent`,
        classNameButton
      )}
      {...props}
    >
      <span
        className={cn(
          `pl-9 ml-8 truncate text-sm ${
            date && !checked ? 'w-[calc(100%-9.5rem)]' : 'w-[calc(100%-6.5rem)]'
          }`,
          className
        )}
      >
        <Strikethrough checked={checked}>{taskName}</Strikethrough>
      </span>
    </button>
  );
};
