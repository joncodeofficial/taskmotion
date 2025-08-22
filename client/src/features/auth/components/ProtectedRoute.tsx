import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  isAuthenticated: boolean;
  redirect: string;
  children: React.ReactNode | React.ReactNode[];
};

const ProtectedRoute = ({ isAuthenticated, redirect, children }: ProtectedRouteProps) => {
  if (!isAuthenticated) return <Navigate to={redirect} replace />;

  return children;
};

export default ProtectedRoute;
