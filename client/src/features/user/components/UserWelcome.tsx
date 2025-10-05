import { useAlertDialogStore } from '@/shared/store/dialogStore';
import { getGreeting } from '@/features/user/utils/getGreeting';
import { format } from 'date-fns';

const UserWelcome = () => {
  const formatedDate = format(new Date(), 'EEEE, MMMM d');
  const { listTitle } = useAlertDialogStore();

  return (
    <div className='hidden lg:block'>
      <h3 className='text-gray-600 dark:text-neutral-300 text-lg font-light'>
        {getGreeting()} Today is {formatedDate}
      </h3>
      <h1 className='text-3xl font-semibold text-gray-900 dark:text-white truncate'>
        {listTitle || (
          <span className='text-gray-400 dark:text-neutral-500 animate-pulse'>Loading...</span>
        )}
      </h1>
    </div>
  );
};

export default UserWelcome;
