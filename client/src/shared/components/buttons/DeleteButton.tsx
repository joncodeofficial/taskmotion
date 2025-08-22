import { Trash2 } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';
import { Button } from '@/shared/components/ui/button';

export const DeleteButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button size='icon' className='w-7 h-8 self-start' {...props}>
      <Trash2 className='w-4 group-hover:text-red-400 select-none pointer-events-none' />
    </Button>
  );
};
