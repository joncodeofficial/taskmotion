import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { CalendarButton } from '@/shared/components/buttons/CalendarButton';
import { X } from 'lucide-react';
import { useModalStore } from '@/features/tasks/store/modalStore';
import { TextInput } from '@/shared/components/ui/text-input';
import { calculateHeight } from '@/features/tasks/utils/calculateHeight';
import { DrawerModal } from '@/shared/components/ui/drawer';
import { useTask } from '@/features/tasks/hooks/task/useTask';
import { TextDisplay } from '@/shared/components/TextDisplay';
import { Textarea } from '@/shared/components/ui/textarea';
import { IAButton } from '@/shared/components/buttons/IAButton';

export const TaskDrawer = () => {
  const { task, isOpen, setIsOpen } = useModalStore();

  const {
    textareaRef,
    taskName,
    date,
    description,
    isGeneratingAI,
    handleBlurDescription,
    handleChangeDescription,
    setDate,
    checked,
    handleChange,
    handleBlur,
    handleCheckboxChange,
    handleGenerateAIDescription,
  } = useTask(task);

  return (
    <DrawerModal open={isOpen} onClose={() => setIsOpen(false)}>
      <div
        className='w-full lg:max-w-[900px] lg:w-1/2 lg:min-w-[650px] h-full lg:min-h-max lg:h-[70%] bg-neutral-100 dark:bg-background rounded-md shadow-lg border border-border mx-auto mt-16 lg:mt-28'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold text-neutral-600 dark:text-neutral-200'>
            Update Task
          </h2>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsOpen(false)}
            className='rounded-sm'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>

        <div className='p-6 space-y-6'>
          <div className='space-y-4'>
            <div>
              <label htmlFor='name' className='text-sm font-medium text-muted-foreground'>
                Task name
              </label>
              <div
                className={`relative w-full h-full py-2 px-1.5 my-1 rounded-md flex justify-between items-center text-neutral-500 dark:text-neutral-100`}
              >
                <Checkbox
                  name='checked'
                  checked={checked}
                  onChange={handleCheckboxChange}
                  classNameContainer='self-baseline'
                  className='ml-0 disabled:cursor-default z-10 top-1'
                />

                <TextInput
                  id='name'
                  ref={textareaRef}
                  value={taskName}
                  onClick={() => {
                    calculateHeight(textareaRef);
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mx-1.5 focus:bg-neutral-200 dark:bg-background dark:focus:bg-neutral-900 
                    opacity-0 focus:opacity-100 peer`}
                />

                <TextDisplay
                  taskName={taskName}
                  checked={checked}
                  date={task.date || ''}
                  className='pl-0.5 w-[calc(100%-5rem)]'
                  classNameButton='pt-3.5 pointer-events-none'
                />

                <CalendarButton
                  date={date as string}
                  setDate={setDate}
                  className='self-start'
                  classNameButton='w-8 h-8 dark:w-8 dark:h-8'
                />
              </div>
            </div>

            <div>
              <label htmlFor='description' className='text-sm font-medium text-muted-foreground'>
                Description
              </label>
              <div className='mt-1.5 relative'>
                <Textarea
                  id='description'
                  name='description'
                  value={description}
                  onChange={handleChangeDescription}
                  onBlur={handleBlurDescription}
                  placeholder='Add more details to this task...'
                />

                <IAButton
                  isLoading={isGeneratingAI}
                  title={description ? 'Enhance Description' : 'Generate AI description'}
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingAI}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DrawerModal>
  );
};
