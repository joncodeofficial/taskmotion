import CreateTask from '@/features/tasks/components/CreateTask';
import UserWelcome from '@/features/user/components/UserWelcome';
import { Outlet } from 'react-router-dom';
import { TaskDrawer } from '@/features/tasks/components/TaskDrawer';

export const TodoList = () => {
  return (
    <>
      <main className='px-14 lg:px-0 w-full lg:pl-[340px] sticky top-2 lg:top-40 z-50'>
        <div className='max-w-[640px] min-w-48 lg:w-[640px] mx-auto flex flex-col lg:gap-y-2'>
          <UserWelcome />
          <CreateTask />
        </div>
      </main>
      <Outlet />
      <TaskDrawer />
    </>
  );
};
