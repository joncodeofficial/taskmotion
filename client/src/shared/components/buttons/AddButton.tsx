import { Plus } from 'lucide-react';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { Button } from '../ui/button';

type AddButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
};

export const AddButton = ({ title, ...props }: AddButtonProps) => {
  return (
    <Tooltip title={title}>
      <Button
        size={'icon'}
        data-testid='add-button'
        variant={'secondary'}
        className='w-7 dark:w-7 h-7 dark:h-7'
        {...props}
      >
        <Plus className='w-4 h-4 text-neutral-600 dark:text-neutral-50 pointer-events-none group-focus-within:rotate-90 transition-transform duration-200' />
      </Button>
    </Tooltip>
  );
};
