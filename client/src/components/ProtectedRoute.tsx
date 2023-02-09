import { Navigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const auth = useAuthContext();

  if (auth.user) {
    return children;
  }

  auth.dispatch({ type: 'LOGOUT' });
  return <Navigate to="/" replace />;
}

export default ProtectedRoute;
