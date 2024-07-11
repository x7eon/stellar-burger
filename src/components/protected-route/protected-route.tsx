import { useSelector } from '../../services/store';
import {
  getUserSelector,
  isAuthChekedSelector
} from '../../services/auth/slice';
import { Preloader } from '../ui/preloader';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const isAuthCheked = useSelector(isAuthChekedSelector);
  const user = useSelector(getUserSelector);
  const location = useLocation();

  if (!isAuthCheked) {
    return <Preloader />;
  }

  if (user.name && onlyUnAuth) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!user.name && !onlyUnAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children;
};
