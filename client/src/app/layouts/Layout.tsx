import { UserNav } from '@/features/user/components/UserNav';
import { ListCollection } from '@/features/lists/components/ListCollection';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <UserNav />
      <Outlet />
      <ListCollection />
    </>
  );
};
