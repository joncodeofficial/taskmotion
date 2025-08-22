import { create } from 'zustand';

interface DragState {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

export const useDragStore = create<DragState>()((set) => ({
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
}));
