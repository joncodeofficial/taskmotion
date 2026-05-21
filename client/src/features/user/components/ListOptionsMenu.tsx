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
          <Button variant='secondary' size='icon' className='h-9 w-9 rounded-full shrink-0' aria-label='List options'>
            <EllipsisVertical className='h-4 w-4' strokeWidth={1.8} />
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
