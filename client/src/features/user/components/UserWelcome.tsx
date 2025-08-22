import { useAlertDialogStore } from '@/shared/store/dialogStore';
import { getGreeting } from '@/features/user/utils/getGreeting';
import { format } from 'date-fns';

const UserWelcome = () => {
  const formatedDate = format(new Date(), 'EEEE, MMMM d');
  const { listTitle } = useAlertDialogStore();

  return (
    <div className='hidden lg:block'>
      <h3 className='text-gray-600 dark:text-neutral-300 text-[17px]'>
        {getGreeting()} Today is {formatedDate}
      </h3>
      <h1
        className='text-gray-700 dark:text-neutral-200 
        text-[1.8rem] font-medium mt-0.5 truncate
      '
      >
        {listTitle ?? 'Loading...'}
      </h1>
    </div>
  );
};

export default UserWelcome;
