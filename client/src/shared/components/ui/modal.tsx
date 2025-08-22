import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

type ModalProps = {
  children: React.ReactNode | React.ReactNode[];
  open: boolean;
  onClose: () => void;
};

export const Modal = ({ children, open, onClose }: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle />
      <DialogDescription />
      <DialogContent className='sm:max-w-[425px]'>{children}</DialogContent>
    </Dialog>
  );
};
