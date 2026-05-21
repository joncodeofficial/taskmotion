import { useState } from 'react';
import { useParams } from 'react-router';
import { EllipsisVertical, Pencil, Rows3, Trash2 } from 'lucide-react';
import { useTasks, useClearTasks } from '@/features/tasks/hooks/useTasks';
import { useLists } from '@/features/lists/hooks/useLists';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

type ListOptionsMenuProps = {
  onRenameList: () => void;
};

export const ListOptionsMenu = ({ onRenameList }: ListOptionsMenuProps) => {
  const { listId } = useParams();
  const { tasks } = useTasks(listId);
  const { lists } = useLists();
  const clearTasks = useClearTasks(listId);
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeList = lists?.find((list) => list.listId === listId);
  const currentListName = activeList?.name ?? '';

  const handleClearTasks = () => {
    if (tasks.length === 0) {
      setIsClearOpen(false);
      return;
    }

    clearTasks.mutate(tasks, {
      onSuccess: () => {
        setIsClearOpen(false);
      },
    });
  };

  const handleCompileTasks = async () => {
    const compiledTasks = tasks
      .map((task) => task.name.trim())
      .filter(Boolean)
      .join(', ');

    await navigator.clipboard.writeText(compiledTasks);
  };

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className={`inline-flex h-[1.15rem] w-auto shrink-0 items-center justify-center rounded-sm px-0.5 py-0 text-neutral-500 align-middle transition-[opacity,color,background-color] hover:bg-transparent hover:text-neutral-700 dark:text-neutral-300 dark:hover:bg-transparent dark:hover:text-white ${
              isMenuOpen
                ? 'opacity-100'
                : 'pointer-events-none opacity-0 group-hover/list-title:pointer-events-auto group-hover/list-title:opacity-100 group-focus-within/list-title:pointer-events-auto group-focus-within/list-title:opacity-100'
            }`}
            aria-label='List options'
          >
            <EllipsisVertical className='h-[1.05rem] w-[1.05rem]' strokeWidth={2.1} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='start'
          className='w-52'
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsMenuOpen(false);
              onRenameList();
            }}
          >
            <Pencil className='mr-2 h-4 w-4' />
            <span>Rename list</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCompileTasks} disabled={tasks.length === 0}>
            <Rows3 className='mr-2 h-4 w-4' />
            <span>Compile tasks</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsClearOpen(true)}
            disabled={tasks.length === 0}
            className='text-red-500 focus:text-red-500 dark:text-red-400 dark:focus:text-red-400'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            <span>Remove all tasks</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isClearOpen} onOpenChange={setIsClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove all tasks?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete every task in <span className='font-semibold'>{currentListName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600! !hover:bg-red-700 dark:text-neutral-200'
              onClick={handleClearTasks}
            >
              Remove all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
