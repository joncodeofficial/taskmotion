import { PropsWithChildren } from 'react';
import { DragOverlay, defaultDropAnimationSideEffects, DropAnimation } from '@dnd-kit/core';

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.2',
      },
    },
  }),
};

export function SortableOverlay(props: PropsWithChildren) {
  return <DragOverlay dropAnimation={dropAnimationConfig}>{props.children}</DragOverlay>;
}
