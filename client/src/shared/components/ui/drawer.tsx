import { useMediaQuery } from '@uidotdev/usehooks';
import { Drawer } from 'vaul';

type ModalProps = {
  children: React.ReactNode | React.ReactNode[];
  open: boolean;
  onClose: () => void;
};

export const DrawerModal = ({ children, open, onClose }: ModalProps) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 1023px)');

  const handleBlurDesktop = () => !isSmallDevice && onClose();

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 bg-background/80 z-40' />
        <Drawer.Content
          className='fixed top-0 z-[70] w-full h-full mx-auto backdrop-blur-sm'
          onClick={handleBlurDesktop}
        >
          <Drawer.Title hidden />
          <Drawer.Description />
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
