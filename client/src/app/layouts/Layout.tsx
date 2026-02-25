import { UserNav } from '@/features/user/components/UserNav';
import { ListCollection } from '@/features/lists/components/ListCollection';
import { Outlet } from 'react-router';

export const Layout = () => {
  return (
    <>
      <UserNav />
      <Outlet />
      <ListCollection />
    </>
  );
};
