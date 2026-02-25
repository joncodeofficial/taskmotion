import { ArrowDownUp, ClipboardCopy, Copy, EllipsisVertical } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useParams } from 'react-router';
import { useLists } from '@/features/lists/hooks/useLists';

type OptionTaskButton = {
  handleDuplicate: () => void;
  handleMoveTo: (listIdMove?: string) => void;
  handleCopyClipboard: () => void;
};

export const OptionTaskButton = ({
  handleDuplicate,
  handleMoveTo,
  handleCopyClipboard,
}: OptionTaskButton) => {
  const { lists } = useLists();
  const { listId } = useParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' className='w-7 h-8 self-start'>
          <EllipsisVertical width={18} strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[11rem]'>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className='mr-2 h-4 w-4' />
          <span>Duplicate</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyClipboard}>
          <ClipboardCopy className='mr-2 h-4 w-4' />
          <span>Copy text</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ArrowDownUp className='mr-2 h-4 w-4' />
            <span>Move to</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            alignOffset={-5}
            sideOffset={5}
            className='w-44 lg:w-full max-h-[240px] overflow-y-auto dark:bg-background
          [scrollbar-width:thin]'
          >
            {lists
              ?.filter((_) => _.listId !== listId)
              .map((l) => (
                <DropdownMenuItem key={l.listId} onClick={() => handleMoveTo(l.listId)}>
                  <span className='truncate'>{l.name}</span>
                </DropdownMenuItem>
              ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
