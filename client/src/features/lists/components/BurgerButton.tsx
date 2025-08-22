import { useMediaQuery } from '@uidotdev/usehooks';
import { Button, ButtonProps } from '@/shared/components/ui/button';
import { PanelRightIcon } from 'lucide-react';

export const BurgerButton = (props: ButtonProps) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 1023px)');

  return (
    <Button
      variant='secondary'
      className={`!w-10 !h-10 fixed top-3 left-2 z-[70] bg-white 
        ${isSmallDevice ? 'inline-block' : 'hidden'}`}
      {...props}
    >
      <PanelRightIcon
        size={26}
        absoluteStrokeWidth={true}
        strokeWidth={1.75}
        className='text-gray-500 dark:text-neutral-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      />
    </Button>
  );
};
