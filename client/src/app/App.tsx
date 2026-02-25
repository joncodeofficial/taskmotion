import { Route, Routes, useLocation } from 'react-router';
import { UserAuth } from '@/app/context/AuthContext';
import Home from '@/pages/Home';
import { TodoList } from '@/pages/TodoList';
import LoginCard from '@/pages/Login';
import { TaskList } from '@/features/tasks/components/TaskList';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { isEmptyObject } from '@/shared/utils/isEmptyObject';
import { Dashboard } from '@/pages/Dashboard';
import useAvoidZoom from '@/shared/hooks/useAvoidZoom';
import { Layout } from '@/app/layouts/Layout';

const App = () => {
  const { user } = UserAuth();
  const location = useLocation();
  const isAuthenticated = !isEmptyObject(user);

  useAvoidZoom();

  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute
            isAuthenticated={!isAuthenticated}
            redirect={!isAuthenticated ? location.pathname : '/u/dashboard'}
          >
            <Home />
          </ProtectedRoute>
        }
      >
        <Route index path='/login' element={<LoginCard />} />
      </Route>
      <Route
        path='/'
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} redirect='/'>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path='u/dashboard' element={<Dashboard />} />
        <Route path='b/:listId' element={<TodoList />}>
          <Route index element={<TaskList />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
