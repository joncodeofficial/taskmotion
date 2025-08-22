import { LayoutDashboardIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const DashboardButton = () => {
  const { listId } = useParams();
  const navigate = useNavigate();

  const handleClick = () => navigate(`/u/dashboard`);

  return (
    <li
      tabIndex={0}
      id='dashboard'
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={`flex items-center gap-2 px-3 text-neutral-600 dark:text-neutral-50 
    bg-neutral-50 dark:bg-neutral-900 w-full h-12 rounded-md 
    hover:bg-black/10 dark:hover:bg-white/15
    cursor-pointer select-none ${!listId && 'bg-neutral-300 dark:bg-white/15'}`}
    >
      <LayoutDashboardIcon size={20} className='text-primary/70' />
      <span className='font-medium'>Dashboard</span>
    </li>
  );
};
