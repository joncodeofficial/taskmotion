import { create } from 'zustand';

interface AlertDialogState {
  listTitle: string;
  open: boolean;
  handleDelete: () => void;
  setOpen: (open: boolean) => void;
  setHandleDelete: (fn: () => void) => void;
  setListTitle: (title: string) => void;
}

export const useAlertDialogStore = create<AlertDialogState>()((set) => ({
  listTitle: '',
  open: false,
  handleDelete: () => {},
  setListTitle(listTitle) {
    set(() => ({ listTitle }));
  },
  setOpen: (open) => set(() => ({ open })),
  // Función para actualizar la referencia a handleDelete
  setHandleDelete: (fn) => set(() => ({ handleDelete: fn })),
}));
