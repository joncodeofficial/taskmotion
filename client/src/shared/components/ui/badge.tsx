import { cn } from '@/shared/lib/utils';

type BadgeProps = {
  text: string;
  className?: string;
};

export const Badge = ({ text, className }: BadgeProps) => {
  return (
    <div
      className={cn(
        `table self-baseline rounded-md text-xs font-medium leading-none px-1 py-1.5 mr-1 text-nowrap
        }`,
        className
      )}
    >
      {text}
    </div>
  );
};
