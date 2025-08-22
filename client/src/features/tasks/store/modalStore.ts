import { TaskProps } from '@shared/types/task.types';
import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  task: TaskProps;
  setIsOpen: (isOpen: boolean) => void;
  setTask: (task: TaskProps) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  isOpen: false,
  task: {} as TaskProps,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
  setTask: (task) => set(() => ({ task })),
}));
