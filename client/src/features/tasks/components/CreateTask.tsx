import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { useParams } from 'react-router';
import { replaceEmojis } from '@/shared/utils/replaceEmojis';
import { SIZE_ID } from '@/shared/constants/base';
import { useShortcut } from '@/shared/hooks/useShortcut';
import { format } from 'date-fns';
import { CalendarButton } from '@/shared/components/buttons/CalendarButton';
import { UserAuth } from '@/app/context/AuthContext';
import { CreateInput } from '@/shared/components/CreateInput';
import { useUpdateNotifications } from '@/shared/hooks/useNotification';
import { createNotification } from '@/shared/utils/createNotification';
import { useCreateTask as useCreateTaskMutation, useTasks } from '@/features/tasks/hooks/useTasks';

const CreateTask = () => {
  const [taskName, setTaskName] = useState('');
  const { listId } = useParams();
  const [checked, setChecked] = useState(false);
  const { tasks } = useTasks(listId);
  const inputRef = useRef(null!) as React.RefObject<HTMLInputElement>;
  const keydown = useShortcut(['ctrl+e']);
  const [date, setDate] = useState<string | undefined>(undefined);
  const { email } = UserAuth().user;
  const updateNotifications = useUpdateNotifications();
  const createTaskMutation = useCreateTaskMutation();

  const createTask = () => {
    if (taskName && listId) {
      const minPosition = tasks.length > 0 ? Math.min(...tasks.map((t) => t.position)) : 1;
      const newTask = {
        id: nanoid(SIZE_ID),
        list_id: listId,
        name: replaceEmojis(taskName),
        description: '',
        checked,
        date: date ? format(date, 'MM-dd-yyyy') : '',
        position: minPosition - 1,
      };

      setDate(undefined);
      setChecked(false);
      setTaskName('');
      createTaskMutation.mutate(newTask);

      const body = createNotification({
        type: 'task',
        action: 'created',
        message: taskName,
        id: newTask.id,
      });

      updateNotifications.mutate({ email, body });
    }
  };

  const handleTaskCreation = () => {
    taskName ? createTask() : inputRef.current?.focus();
  };

  useEffect(() => {
    if (keydown === 'ctrl+e') inputRef.current?.focus();
  }, [keydown]);

  return (
    <CreateInput
      checked={checked}
      onCheck={setChecked}
      value={taskName}
      onChange={setTaskName}
      onSubmit={handleTaskCreation}
      inputRef={inputRef}
      placeholder='Create new task...'
      shortcutKey='e'
    >
      <CalendarButton date={date} setDate={setDate} />
    </CreateInput>
  );
};

export default CreateTask;
